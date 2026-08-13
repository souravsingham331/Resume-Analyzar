import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColorClass(score: number): { text: string; bg: string; border: string; ring: string; hex: string } {
  if (score < 40) {
    return {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      ring: "ring-red-500",
      hex: "#ef4444",
    };
  }
  if (score < 60) {
    return {
      text: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      ring: "ring-orange-500",
      hex: "#f97316",
    };
  }
  if (score < 75) {
    return {
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      ring: "ring-yellow-500",
      hex: "#eab308",
    };
  }
  if (score < 90) {
    return {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      ring: "ring-green-500",
      hex: "#22c55e",
    };
  }
  return {
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-500",
    hex: "#10b981",
  };
}

export function getScoreLabel(score: number): string {
  if (score < 40) return "Needs Improvement";
  if (score < 60) return "Fair";
  if (score < 75) return "Good";
  if (score < 90) return "Strong Match";
  return "Excellent";
}
