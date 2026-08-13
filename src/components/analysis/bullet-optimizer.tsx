"use client";

import * as React from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { BulletSuggestion } from "@/types";
import { useToast } from "@/components/ui/toast";

export interface BulletOptimizerProps {
  suggestions: BulletSuggestion[];
}

export function BulletOptimizer({ suggestions }: BulletOptimizerProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const { showToast } = useToast();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast({ type: "success", title: "Copied!", message: "Improved bullet point copied to clipboard." });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 text-sm">
        No bullet point rewrites required. Your experience bullet points are already strong and action-oriented!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((item, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Bullet */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Original Bullet</span>
              <p className="text-sm text-slate-700 mt-1 italic">"{item.original}"</p>
            </div>

            {/* Improved Bullet */}
            <div className="rounded-lg bg-indigo-50/50 p-4 border border-indigo-100 relative group">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  AI Suggested Revision
                </span>

                <button
                  onClick={() => handleCopy(item.improved, idx)}
                  className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-600 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shadow-xs hover:bg-indigo-50 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy suggestion</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm font-medium text-slate-900 mt-1.5">"{item.improved}"</p>
            </div>
          </div>

          {/* Reason / Why */}
          <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-50/50 p-2.5 rounded-md">
            <span className="font-semibold text-slate-700 shrink-0">Why:</span>
            <span>{item.reason}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
