"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Sparkles, Plus, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function JobMatchesPage() {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  React.useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => {
        if (data.resumes && data.resumes.length > 0) {
          setResumes(data.resumes);
          setSelectedResumeId(data.resumes[0].id);
        }
      });
  }, []);

  const handleAnalyzeJobMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      showToast({ type: "error", title: "No Resume Selected", message: "Please upload or select a resume first." });
      return;
    }

    if (description.trim().length < 20) {
      showToast({ type: "error", title: "Description Too Short", message: "Job description must be at least 20 characters." });
      return;
    }

    setIsLoading(true);
    showToast({ type: "info", title: "Comparing Job Match...", message: "Evaluating resume against job description requirements." });

    try {
      const res = await fetch(`/api/resumes/${selectedResumeId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle || "Target Job Posting",
          company: company || "Target Company",
          inlineJobDescription: description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast({ type: "success", title: "Job Match Analysis Complete!", message: "Opening analysis report." });
        router.push(`/analyses/${data.analysis.id}`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Match Error", message: err.message || "Failed to complete job match analysis." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job Description Matching</h1>
        <p className="text-sm text-slate-500 mt-1">
          Paste a target job description to calculate keyword alignment and detect requirement gaps
        </p>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleAnalyzeJobMatch} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
            >
              {resumes.length === 0 ? (
                <option value="">No resumes found. Please upload a resume first.</option>
              ) : (
                resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({new Date(r.createdAt).toLocaleDateString()})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Job Title (Optional)</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company (Optional)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Tech Inc."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Job Description (Required)</label>
            <textarea
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job posting requirements, tech stack details, and responsibilities here..."
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none font-sans"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" isLoading={isLoading} disabled={resumes.length === 0}>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Resume Against Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
