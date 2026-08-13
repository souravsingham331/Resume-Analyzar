import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json({ error: "No analysis IDs provided for comparison" }, { status: 400 });
    }

    const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);

    const rawAnalyses = await db.analysis.findMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
      include: {
        resume: { select: { id: true, name: true, originalFileName: true } },
        jobDescription: { select: { id: true, title: true, company: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const analyses = rawAnalyses.map((a) => ({
      ...a,
      analysisJson: JSON.parse(a.analysisJson),
    }));

    return NextResponse.json({ analyses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to compare analyses" }, { status: 500 });
  }
}
