import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawAnalyses = await db.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        resume: {
          select: { id: true, name: true, originalFileName: true },
        },
        jobDescription: {
          select: { id: true, title: true, company: true },
        },
      },
    });

    const analyses = rawAnalyses.map((a) => ({
      ...a,
      analysisJson: JSON.parse(a.analysisJson),
    }));

    return NextResponse.json({ analyses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch analyses" }, { status: 500 });
  }
}
