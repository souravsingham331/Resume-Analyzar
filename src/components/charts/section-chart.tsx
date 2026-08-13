"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { getScoreColorClass } from "@/utils/cn";

export interface SectionScoreItem {
  name: string;
  score: number;
  feedback?: string;
}

export interface SectionChartProps {
  data: SectionScoreItem[];
}

export function SectionChart({ data }: SectionChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#475569"
            fontSize={12}
            tickLine={false}
            width={120}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as SectionScoreItem;
                const colors = getScoreColorClass(item.score);
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                    <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                    <p className={`text-sm font-bold mt-1 ${colors.text}`}>Score: {item.score} / 100</p>
                    {item.feedback && <p className="text-xs text-slate-500 mt-1 max-w-xs">{item.feedback}</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, index) => {
              const color = getScoreColorClass(entry.score);
              return <Cell key={`cell-${index}`} fill={color.hex} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
