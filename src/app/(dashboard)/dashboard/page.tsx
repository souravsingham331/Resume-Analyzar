import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { ScoreGauge } from "@/components/charts/score-gauge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Sparkles,
  Briefcase,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Fetch metrics
  const resumeCount = await db.resume.count({ where: { userId: user.id } });
  const jobMatchCount = await db.jobDescription.count({ where: { userId: user.id } });
  const recentAnalyses = await db.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      resume: { select: { name: true } },
      jobDescription: { select: { title: true, company: true } },
    },
  });

  const latestAnalysis = recentAnalyses[0];
  const overallScore = latestAnalysis?.overallScore || 0;
  const atsScore = latestAnalysis?.atsScore || 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user.name || "Candidate"}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your ATS scores, optimize bullet points, and prepare for top tech interviews.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/resumes">
            <Button size="lg" className="shadow-sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Upload Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Score Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Gauge */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated ATS Score</span>
            <Badge variant="default">ATS Parser</Badge>
          </div>
          <ScoreGauge score={atsScore} label="ATS Compatibility" sublabel="Estimated Parsing Readiness" size="lg" />
          <p className="text-xs text-slate-500 text-center">
            {atsScore >= 75 ? "Your resume parses cleanly with low parsing risk." : "Upload a revised resume to boost your ATS score."}
          </p>
        </div>

        {/* Overall Resume Quality Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Quality</span>
            <Badge variant="success">Content & Impact</Badge>
          </div>
          <ScoreGauge score={overallScore} label="Resume Quality" sublabel="Impact & Metrics Evaluator" size="lg" />
          <p className="text-xs text-slate-500 text-center">
            {overallScore >= 80 ? "Strong action verbs and impact metrics detected." : "Enhance your experience bullet points to increase score."}
          </p>
        </div>

        {/* Overview Stats Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Uploaded Resumes</span>
                    <span className="text-lg font-bold text-slate-900">{resumeCount}</span>
                  </div>
                </div>
                <Link href="/resumes" className="text-xs font-semibold text-indigo-600 hover:underline">
                  View All
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Target Job Matches</span>
                    <span className="text-lg font-bold text-slate-900">{jobMatchCount}</span>
                  </div>
                </div>
                <Link href="/job-matches" className="text-xs font-semibold text-indigo-600 hover:underline">
                  View All
                </Link>
              </div>
            </div>
          </div>

          <Link href="/analyses/compare">
            <Button variant="outline" className="w-full text-xs">
              <TrendingUp className="h-4 w-4 mr-1.5 text-indigo-600" />
              Compare Revision Progress
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Analyses</h2>
            <p className="text-xs text-slate-500">Your latest AI analysis results and ATS breakdown</p>
          </div>
          <Link href="/analyses">
            <Button variant="ghost" size="sm" className="text-indigo-600">
              View History <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No analyses yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your first resume to receive instant AI-powered feedback, ATS scoring, and bullet improvements.
            </p>
            <Link href="/resumes" className="inline-block pt-2">
              <Button>Upload & Analyze Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="py-4 flex items-center justify-between hover:bg-slate-50 px-3 rounded-xl transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {analysis.overallScore}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs">{analysis.resume.name}</h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                      <span>ATS: {analysis.atsScore}/100</span>
                      {analysis.jobDescription && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-medium">{analysis.jobDescription.title || "Target Role"}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href={`/analyses/${analysis.id}`}>
                  <Button variant="outline" size="sm">
                    View Report
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
