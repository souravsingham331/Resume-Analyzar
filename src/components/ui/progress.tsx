import * as React from "react";
import { cn } from "@/utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
}

export function Progress({ value, className, indicatorColor, ...props }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  let color = "bg-indigo-600";
  if (!indicatorColor) {
    if (clampedValue < 40) color = "bg-red-500";
    else if (clampedValue < 60) color = "bg-orange-500";
    else if (clampedValue < 75) color = "bg-yellow-500";
    else if (clampedValue < 90) color = "bg-green-500";
    else color = "bg-emerald-500";
  } else {
    color = indicatorColor;
  }

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", color)}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}
