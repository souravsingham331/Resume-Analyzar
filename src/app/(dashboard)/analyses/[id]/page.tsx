"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Layers,
  Zap,
} from "lucide-react";
import { ScoreGauge } from "@/components/charts/score-gauge";
import { SectionChart } from "@/components/charts/section-chart";
import { BulletOptimizer } from "@/components/analysis/bullet-optimizer";
import { KeywordBreakdown } from "@/components/analysis/keyword-breakdown";
import { RecommendationsList } from "@/components/analysis/recommendations-list";
import { JobMatchCard } from "@/components/analysis/job-match-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { ResumeAnalysisData } from "@/types";

export default function AnalysisDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [analysis, setAnalysis] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const { showToast } = useToast();

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analyses/${id}`);
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
      } else {
        showToast({ type: "error", title: "Error", message: data.error });
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to load analysis report" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) fetchAnalysis();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast({ type: "success", title: "Deleted", message: "Analysis removed." });
        router.push("/analyses");
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to delete analysis." });
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    showToast({ type: "info", title: "Preparing PDF Report...", message: "Formatting analysis document for export." });
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500 space-y-3">
        <div className="mx-auto h-8 w-8 animate-spin text-indigo-600 rounded-full border-2 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium">Loading comprehensive AI Analysis Report...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Analysis Not Found</h3>
        <Link href="/analyses">
          <Button variant="outline">Return to Analyses</Button>
        </Link>
      </div>
    );
  }

  const data: ResumeAnalysisData = analysis.analysisJson;

  return (
    <div className="space-y-8 pb-12 print:p-0 print:space-y-4">
      {/* Top Header Controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div className="flex items-center space-x-3">
          <Link href="/analyses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 truncate max-w-md">
              {analysis.resume?.name || "Resume Analysis"}
            </h1>
            <p className="text-xs text-slate-500">
              Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExportPDF} isLoading={isExporting}>
            <Download className="h-4 w-4 mr-1.5" />
            Download PDF
          </Button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Top Scores Hero Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Executive Analysis</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">Analysis Overview</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
        </div>

        <div className="flex items-center justify-around bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <ScoreGauge score={data.overallScore} label="Overall Score" sublabel="Quality & Impact" size="md" />
          <div className="h-20 w-px bg-slate-200" />
          <ScoreGauge score={data.atsScore} label="Estimated ATS" sublabel="Parsing Readiness" size="md" />
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-emerald-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Key Strengths ({data.strengths.length})</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {data.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/20 p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Areas for Improvement ({data.weaknesses.length})</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {data.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-amber-600 font-bold">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section Scores Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center">
          <Layers className="h-5 w-5 text-indigo-600 mr-2" />
          Section Score Breakdown
        </h3>
        <SectionChart data={data.sections} />
      </div>

      {/* Job Match Card (If JD supplied) */}
      {data.jobMatch && (
        <JobMatchCard
          jobMatch={data.jobMatch}
          jobTitle={analysis.jobDescription?.title}
          company={analysis.jobDescription?.company}
        />
      )}

      {/* Side-by-Side Bullet Point Improvements */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Zap className="h-5 w-5 text-indigo-600 mr-2" />
            Action-Oriented Bullet Point Rewrites
          </h3>
          <span className="text-xs text-slate-500">Includes metric & verb recommendations</span>
        </div>
        <BulletOptimizer suggestions={data.bulletSuggestions} />
      </div>

      {/* Keyword Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Keyword Density & Match Breakdown</h3>
        <KeywordBreakdown matchedKeywords={data.matchedKeywords} missingKeywords={data.missingKeywords} />
      </div>

      {/* Actionable Recommendations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Actionable Recommendations</h3>
        <RecommendationsList recommendations={data.recommendations} />
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Analysis"
        description="Are you sure you want to delete this analysis report?"
      >
        <div className="space-y-4 pt-2">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Analysis
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
