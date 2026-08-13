"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Search, Trash2, ArrowRight, GitCompare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { getScoreColorClass } from "@/utils/cn";

export default function AnalysesHistoryPage() {
  const [analyses, setAnalyses] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [filterScore, setFilterScore] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);

  const { showToast } = useToast();

  const fetchAnalyses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analyses");
      const data = await res.json();
      if (res.ok) {
        setAnalyses(data.analyses || []);
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to load analyses history" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
        showToast({ type: "success", title: "Deleted", message: "Analysis removed." });
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to delete analysis" });
    }
  };

  const filteredAnalyses = analyses.filter((a) => {
    const nameMatch = (a.resume?.name || "").toLowerCase().includes(search.toLowerCase());
    const jdMatch = (a.jobDescription?.title || "").toLowerCase().includes(search.toLowerCase());
    const matchesSearch = nameMatch || jdMatch;

    if (filterScore === "excellent") return matchesSearch && a.overallScore >= 90;
    if (filterScore === "good") return matchesSearch && a.overallScore >= 75 && a.overallScore < 90;
    if (filterScore === "needs-improvement") return matchesSearch && a.overallScore < 75;

    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analyses History</h1>
          <p className="text-sm text-slate-500 mt-1">Review, track, and compare all your generated ATS evaluation reports</p>
        </div>

        <Link href="/analyses/compare">
          <Button variant="outline">
            <GitCompare className="h-4 w-4 mr-1.5 text-indigo-600" />
            Compare Revisions
          </Button>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by resume name or job title..."
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="all">All Scores</option>
            <option value="excellent">Excellent (90+)</option>
            <option value="good">Good (75–89)</option>
            <option value="needs-improvement">Needs Improvement (&lt;75)</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading analysis history...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
            <p className="text-sm text-slate-500">No matching analyses found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAnalyses.map((analysis) => {
              const colors = getScoreColorClass(analysis.overallScore);
              return (
                <div key={analysis.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${colors.bg} ${colors.text} ${colors.border} border`}>
                      {analysis.overallScore}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{analysis.resume?.name}</h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                        <span>ATS Score: {analysis.atsScore}/100</span>
                        {analysis.jobDescription && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">
                              Target: {analysis.jobDescription.title || "Job Description"}
                            </span>
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

                  <div className="flex items-center space-x-2">
                    <Link href={`/analyses/${analysis.id}`}>
                      <Button variant="outline" size="sm">
                        View Report
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
