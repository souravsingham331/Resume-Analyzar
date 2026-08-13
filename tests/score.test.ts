import { describe, it, expect } from "vitest";
import { calculateATSMetrics } from "../src/services/ats/scorer";
import { parseResumeStructure } from "../src/services/resume/parser";

describe("ATS Scorer Engine", () => {
  it("should calculate score for clean sample resume", () => {
    const rawText = `John Doe
Senior Software Engineer | john@example.com | (555) 000-1111

PROFESSIONAL SUMMARY
Experienced full stack developer with 5+ years of React, Node.js, and TypeScript. Reduced latency by 30%.

WORK EXPERIENCE
Lead Developer | Acme Inc.
• Built scalable React micro-frontend architecture for 100,000+ active users.
• Optimized PostgreSQL queries cutting API latency by 150ms.

EDUCATION
BS in Computer Science | MIT

TECHNICAL SKILLS
React, TypeScript, Node.js, PostgreSQL, Docker, AWS`;

    const structure = parseResumeStructure(rawText);
    const metrics = calculateATSMetrics(structure);

    expect(metrics.overallScore).toBeGreaterThanOrEqual(60);
    expect(metrics.atsScore).toBeGreaterThanOrEqual(70);
    expect(metrics.detectedKeywords).toContain("React");
    expect(metrics.detectedKeywords).toContain("TypeScript");
  });

  it("should deduct ATS score if contact email is missing", () => {
    const rawText = `John Doe\nNo email listed here.\nWORK EXPERIENCE\nDeveloper at Tech Corp`;
    const structure = parseResumeStructure(rawText);
    const metrics = calculateATSMetrics(structure);

    expect(metrics.formattingIssues.some((i) => i.issue.includes("Missing email"))).toBe(true);
  });
});
