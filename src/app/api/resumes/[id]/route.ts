import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { storageService } from "@/services/storage";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await db.resume.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        analyses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch resume" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await db.resume.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found or unauthorized access" }, { status: 404 });
    }

    // Delete physical file from storage
    await storageService.deleteFile(resume.storageKey);

    // Delete database record (cascade deletes analyses)
    await db.resume.delete({ where: { id: resume.id } });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete resume" }, { status: 500 });
  }
}
