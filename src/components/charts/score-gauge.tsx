"use client";

import * as React from "react";
import { getScoreColorClass, getScoreLabel } from "@/utils/cn";

export interface ScoreGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, label, sublabel, size = "md" }: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const colors = getScoreColorClass(clampedScore);
  const scoreTextLabel = getScoreLabel(clampedScore);

  const strokeWidth = size === "lg" ? 12 : size === "md" ? 10 : 8;
  const radius = size === "lg" ? 70 : size === "md" ? 54 : 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const widthHeight = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg width={widthHeight} height={widthHeight} className="-rotate-90 transform transition-all duration-700">
          {/* Track background */}
          <circle
            cx={widthHeight / 2}
            cy={widthHeight / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={widthHeight / 2}
            cy={widthHeight / 2}
            r={radius}
            stroke={colors.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Score Number */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight ${size === "lg" ? "text-4xl" : size === "md" ? "text-3xl" : "text-xl"} ${colors.text}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        <span className={`mt-1 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
          {scoreTextLabel}
        </span>
        {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
      </div>
    </div>
  );
}
