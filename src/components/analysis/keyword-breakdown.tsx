import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface KeywordBreakdownProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function KeywordBreakdown({ matchedKeywords, missingKeywords }: KeywordBreakdownProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Keywords */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h4 className="font-semibold text-slate-900 text-sm">Matched Keywords ({matchedKeywords.length})</h4>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {matchedKeywords.length > 0 ? (
            matchedKeywords.map((kw, idx) => (
              <Badge key={idx} variant="success">
                {kw}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-slate-500">No primary tech keywords matched yet.</p>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-amber-100">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h4 className="font-semibold text-slate-900 text-sm">Missing Keywords ({missingKeywords.length})</h4>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((kw, idx) => (
              <Badge key={idx} variant="warning">
                + {kw}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-slate-500">All key targeted keywords detected!</p>
          )}
        </div>
      </div>
    </div>
  );
}
