import * as React from "react";
import { ArrowRight, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Recommendation } from "@/types";
import { Badge } from "@/components/ui/badge";

export interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (!recommendations || recommendations.length === 0) {
    return <p className="text-xs text-slate-500">No specific recommendations.</p>;
  }

  const getPriorityBadge = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="warning">Medium Priority</Badge>;
      default:
        return <Badge variant="secondary">Low Priority</Badge>;
    }
  };

  const getPriorityIcon = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-indigo-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className="flex items-start space-x-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-colors"
        >
          {getPriorityIcon(rec.priority)}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h5 className="text-sm font-semibold text-slate-900">{rec.title}</h5>
              {getPriorityBadge(rec.priority)}
            </div>
            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
