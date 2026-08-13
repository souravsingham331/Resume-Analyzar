import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await db.analysis.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        resume: true,
        jobDescription: true,
      },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json({
      analysis: {
        ...analysis,
        analysisJson: JSON.parse(analysis.analysisJson),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch analysis" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await db.analysis.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    await db.analysis.delete({ where: { id: analysis.id } });

    return NextResponse.json({ message: "Analysis deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete analysis" }, { status: 500 });
  }
}
