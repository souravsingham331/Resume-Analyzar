import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { getAIProvider } from "@/services/ai";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { jobDescriptionId, inlineJobDescription } = body;

    let jobDescriptionText = "";
    let finalJdId: string | null = null;

    if (jobDescriptionId) {
      const jd = await db.jobDescription.findFirst({
        where: { id: jobDescriptionId, userId: user.id },
      });
      if (jd) {
        jobDescriptionText = jd.description;
        finalJdId = jd.id;
      }
    } else if (inlineJobDescription && typeof inlineJobDescription === "string" && inlineJobDescription.trim().length > 10) {
      jobDescriptionText = inlineJobDescription;
      // Save created job description for history tracking
      const newJd = await db.jobDescription.create({
        data: {
          userId: user.id,
          title: body.jobTitle || "Custom Job Match",
          company: body.company || "Target Company",
          description: inlineJobDescription,
        },
      });
      finalJdId = newJd.id;
    }

    // Call AI provider abstraction
    const aiProvider = getAIProvider();
    const analysisResult = await aiProvider.analyzeResume(resume.extractedText, jobDescriptionText);

    // Save Analysis record to Database
    const analysis = await db.analysis.create({
      data: {
        userId: user.id,
        resumeId: resume.id,
        jobDescriptionId: finalJdId,
        overallScore: analysisResult.overallScore,
        atsScore: analysisResult.atsScore,
        contentScore: analysisResult.contentScore,
        formattingScore: analysisResult.formattingScore,
        keywordScore: analysisResult.keywordScore,
        experienceScore: analysisResult.experienceScore,
        analysisJson: JSON.stringify(analysisResult),
      },
    });

    return NextResponse.json({
      analysis: {
        ...analysis,
        analysisJson: analysisResult,
      },
      message: "AI Analysis completed successfully",
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Analysis temporarily unavailable. Your resume has been saved." },
      { status: 500 }
    );
  }
}
