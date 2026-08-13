import * as React from "react";
import { CheckCircle2, HelpCircle, Briefcase, Sparkles } from "lucide-react";
import { JobMatchAnalysis } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getScoreColorClass, getScoreLabel } from "@/utils/cn";

export interface JobMatchCardProps {
  jobMatch: JobMatchAnalysis;
  jobTitle?: string;
  company?: string;
}

export function JobMatchCard({ jobMatch, jobTitle, company }: JobMatchCardProps) {
  const colors = getScoreColorClass(jobMatch.matchScore);
  const matchLabel = getScoreLabel(jobMatch.matchScore);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Top Match Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">{jobTitle || "Target Job Description"}</h3>
          </div>
          {company && <p className="text-sm text-slate-500 mt-0.5">{company}</p>}
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-xs uppercase font-semibold text-slate-400 block">Job Match Score</span>
            <span className={`text-2xl font-extrabold ${colors.text}`}>{jobMatch.matchScore}%</span>
          </div>
          <Badge variant="success" className={`${colors.bg} ${colors.text} ${colors.border}`}>
            {matchLabel}
          </Badge>
        </div>
      </div>

      {/* Grid of Matched vs Missing Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Requirements */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-1.5" />
            Matching Requirements ({jobMatch.matchedRequirements.length})
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {jobMatch.matchedRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Gaps (Wording: "This skill was not detected in the resume") */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <HelpCircle className="h-4 w-4 text-amber-600 mr-1.5" />
            Potential Gaps / Undetected ({jobMatch.missingRequirements.length})
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {jobMatch.missingRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                <span className="text-amber-600 font-bold">•</span>
                <span>{req} — <span className="italic text-slate-500 font-medium">This skill was not detected in your resume text.</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transferable Skills & Recommendations */}
      {jobMatch.transferableSkills.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Transferable Skills Detected</h4>
          <div className="flex flex-wrap gap-2">
            {jobMatch.transferableSkills.map((skill, idx) => (
              <Badge key={idx} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
