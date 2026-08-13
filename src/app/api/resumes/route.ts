import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { storageService, validateResumeFile } from "@/services/storage";
import { extractRawTextFromBuffer, parseResumeStructure } from "@/services/resume/parser";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await db.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        analyses: {
          select: {
            id: true,
            overallScore: true,
            atsScore: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ resumes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate size, extension, magic bytes
    const validation = validateResumeFile(buffer, file.name, file.type);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Save physical file
    const { storageKey, fileSize } = await storageService.saveFile(buffer, file.name);

    // Real text extraction from PDF / DOCX
    let extractedText = "";
    try {
      extractedText = await extractRawTextFromBuffer(buffer, file.name);
    } catch (parseErr: any) {
      await storageService.deleteFile(storageKey);
      return NextResponse.json({ error: parseErr.message || "Failed to extract text from file." }, { status: 422 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      await storageService.deleteFile(storageKey);
      return NextResponse.json(
        { error: "Extracted text is empty. The file may be a scanned image without OCR text." },
        { status: 422 }
      );
    }

    const parsedStructure = parseResumeStructure(extractedText);

    // Create Resume database record
    const resume = await db.resume.create({
      data: {
        userId: user.id,
        name: file.name,
        originalFileName: file.name,
        fileType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        fileSize,
        storageKey,
        extractedText,
        parsedDataJson: JSON.stringify(parsedStructure),
      },
    });

    return NextResponse.json({ resume, message: "Resume uploaded and extracted successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process resume upload" }, { status: 500 });
  }
}
