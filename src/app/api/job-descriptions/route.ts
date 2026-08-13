import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { JobDescriptionSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobDescriptions = await db.jobDescription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobDescriptions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch job descriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = JobDescriptionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid job description input", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, company, description } = result.data;

    const jobDescription = await db.jobDescription.create({
      data: {
        userId: user.id,
        title: title || "Target Role",
        company: company || "Target Company",
        description,
      },
    });

    return NextResponse.json({ jobDescription, message: "Job description saved successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create job description" }, { status: 500 });
  }
}
