"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, ArrowUpRight, ArrowDownRight, GitCompare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function AnalysisComparePage() {
  const [analyses, setAnalyses] = React.useState<any[]>([]);
  const [selectedPreviousId, setSelectedPreviousId] = React.useState<string>("");
  const [selectedCurrentId, setSelectedCurrentId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  const { showToast } = useToast();

  const fetchAnalyses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analyses");
      const data = await res.json();
      if (res.ok && data.analyses) {
        setAnalyses(data.analyses);
        if (data.analyses.length >= 2) {
          setSelectedPreviousId(data.analyses[data.analyses.length - 1].id);
          setSelectedCurrentId(data.analyses[0].id);
        } else if (data.analyses.length === 1) {
          setSelectedCurrentId(data.analyses[0].id);
        }
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to load analyses for comparison" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalyses();
  }, []);

  const previous = analyses.find((a) => a.id === selectedPreviousId);
  const current = analyses.find((a) => a.id === selectedCurrentId);

  const renderDelta = (prevVal: number, currVal: number) => {
    const diff = currVal - prevVal;
    if (diff > 0) {
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ArrowUpRight className="h-3 w-3 mr-0.5" />+{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
          <ArrowDownRight className="h-3 w-3 mr-0.5" />{diff}
        </span>
      );
    }
    return <span className="text-xs text-slate-400 font-medium">No change</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <Link href="/analyses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Analyses
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Revision Comparison</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track ATS and content quality score improvements across resume iterations</p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Previous Revision</label>
          <select
            value={selectedPreviousId}
            onChange={(e) => setSelectedPreviousId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Select a previous report...</option>
            {analyses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.resume?.name} — {new Date(a.createdAt).toLocaleDateString()} (Score: {a.overallScore})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Current Revision</label>
          <select
            value={selectedCurrentId}
            onChange={(e) => setSelectedCurrentId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Select current report...</option>
            {analyses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.resume?.name} — {new Date(a.createdAt).toLocaleDateString()} (Score: {a.overallScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {previous && current ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <GitCompare className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Score Metrics Comparison</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">Previous ({new Date(previous.createdAt).toLocaleDateString()})</th>
                  <th className="py-3 px-4">Current ({new Date(current.createdAt).toLocaleDateString()})</th>
                  <th className="py-3 px-4">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-900">Overall Score</td>
                  <td className="py-4 px-4 font-bold text-slate-700">{previous.overallScore} / 100</td>
                  <td className="py-4 px-4 font-bold text-indigo-600">{current.overallScore} / 100</td>
                  <td className="py-4 px-4">{renderDelta(previous.overallScore, current.overallScore)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-900">Estimated ATS Score</td>
                  <td className="py-4 px-4 font-bold text-slate-700">{previous.atsScore} / 100</td>
                  <td className="py-4 px-4 font-bold text-indigo-600">{current.atsScore} / 100</td>
                  <td className="py-4 px-4">{renderDelta(previous.atsScore, current.atsScore)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-900">Keyword Density</td>
                  <td className="py-4 px-4 font-bold text-slate-700">{previous.keywordScore} / 100</td>
                  <td className="py-4 px-4 font-bold text-indigo-600">{current.keywordScore} / 100</td>
                  <td className="py-4 px-4">{renderDelta(previous.keywordScore, current.keywordScore)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-900">Content & Impact</td>
                  <td className="py-4 px-4 font-bold text-slate-700">{previous.contentScore} / 100</td>
                  <td className="py-4 px-4 font-bold text-indigo-600">{current.contentScore} / 100</td>
                  <td className="py-4 px-4">{renderDelta(previous.contentScore, current.contentScore)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-900">Formatting & Structure</td>
                  <td className="py-4 px-4 font-bold text-slate-700">{previous.formattingScore} / 100</td>
                  <td className="py-4 px-4 font-bold text-indigo-600">{current.formattingScore} / 100</td>
                  <td className="py-4 px-4">{renderDelta(previous.formattingScore, current.formattingScore)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
          <p className="text-sm text-slate-500">
            Please select two analysis reports above to display side-by-side revision comparisons.
          </p>
        </div>
      )}
    </div>
  );
}
