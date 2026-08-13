import { ExtractedResumeStructure } from "@/types";

export interface DeterministicScoreResult {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  formattingScore: number;
  keywordScore: number;
  experienceScore: number;
  formattingIssues: Array<{ issue: string; severity: "low" | "medium" | "high"; recommendation: string }>;
  detectedKeywords: string[];
  missingSections: string[];
}

const COMMON_TECH_KEYWORDS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", "SQL",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "Kubernetes", "GraphQL", "REST API",
  "Git", "CI/CD", "Jest", "Tailwind CSS", "Microservices", "System Design",
  "Agile", "Scrum", "TDD", "Redis", "Kafka", "Linux", "GCP", "Azure"
];

const ACTION_VERBS = [
  "built", "developed", "architected", "implemented", "scaled", "optimized",
  "engineered", "reduced", "increased", "spearheaded", "orchestrated", "led",
  "transformed", "designed", "created", "automated", "launched", "improved"
];

export function calculateATSMetrics(
  structure: ExtractedResumeStructure,
  jobDescription?: string
): DeterministicScoreResult {
  const text = structure.fullText;
  const formattingIssues: DeterministicScoreResult["formattingIssues"] = [];
  const missingSections: string[] = [];

  // 1. Evaluate ATS Compatibility Score (0 - 100)
  let atsScore = 85;

  // Contact info check
  if (!structure.contactInfo.email) {
    atsScore -= 15;
    formattingIssues.push({
      issue: "Missing email address in contact section",
      severity: "high",
      recommendation: "Include a clear, professional email address at the top of your resume.",
    });
  }
  if (!structure.contactInfo.phone) {
    atsScore -= 10;
    formattingIssues.push({
      issue: "Missing phone number",
      severity: "medium",
      recommendation: "Provide a primary contact phone number for recruiters.",
    });
  }

  // Check section completeness
  if (!structure.sections.summary || structure.sections.summary.length < 20) {
    missingSections.push("Professional Summary");
    atsScore -= 10;
  }
  if (structure.sections.experience.length === 0) {
    missingSections.push("Work Experience");
    atsScore -= 20;
  }
  if (structure.sections.education.length === 0) {
    missingSections.push("Education");
    atsScore -= 10;
  }
  if (structure.sections.skills.length === 0) {
    missingSections.push("Skills");
    atsScore -= 15;
  }

  // Parsing risk checks
  if (text.includes("│") || text.includes("┌") || text.includes("║")) {
    atsScore -= 10;
    formattingIssues.push({
      issue: "Complex ASCII border tables detected",
      severity: "high",
      recommendation: "Avoid graphic borders or complex tables as ATS parsers struggle to extract text from them.",
    });
  }

  // 2. Evaluate Keyword Score
  const lowerText = text.toLowerCase();
  const detectedKeywords: string[] = [];

  COMMON_TECH_KEYWORDS.forEach((kw) => {
    if (lowerText.includes(kw.toLowerCase())) {
      detectedKeywords.push(kw);
    }
  });

  let keywordScore = Math.min(100, Math.round((detectedKeywords.length / 10) * 100));
  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();
    const jdKeywords = COMMON_TECH_KEYWORDS.filter((kw) => jdLower.includes(kw.toLowerCase()));
    if (jdKeywords.length > 0) {
      const matched = jdKeywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
      keywordScore = Math.round((matched.length / jdKeywords.length) * 100);
    }
  }

  // 3. Evaluate Content Score
  let contentScore = 70;
  let actionVerbCount = 0;
  let metricCount = 0;

  ACTION_VERBS.forEach((verb) => {
    const matches = lowerText.match(new RegExp(`\\b${verb}\\b`, "g"));
    if (matches) actionVerbCount += matches.length;
  });

  // Check for metrics (% | $ | numbers followed by k/m/x or words like increased/decreased)
  const metricMatches = text.match(/(\d+%\s*|\$\d+[\d,]*|\b\d+x\b|\b\d+\s*percent\b|\b\d+\s*users\b|\b\d+\s*ms\b)/gi);
  if (metricMatches) {
    metricCount = metricMatches.length;
  }

  contentScore += Math.min(15, actionVerbCount * 3);
  contentScore += Math.min(15, metricCount * 5);
  contentScore = Math.min(100, contentScore);

  if (metricCount === 0) {
    formattingIssues.push({
      issue: "Lack of measurable impact metrics",
      severity: "medium",
      recommendation: "Add quantifiable results (e.g. 'Improved speed by 35%', 'Managed $50k budget').",
    });
  }

  // 4. Experience Score
  let experienceScore = 75;
  if (structure.sections.experience.length >= 3) experienceScore += 15;
  if (actionVerbCount >= 5) experienceScore += 10;
  experienceScore = Math.min(100, experienceScore);

  // 5. Formatting Score
  let formattingScore = 85;
  if (text.length < 500) {
    formattingScore -= 20;
    formattingIssues.push({
      issue: "Resume content is too sparse",
      severity: "high",
      recommendation: "Expand on work achievements, skills, and technical responsibilities.",
    });
  } else if (text.length > 8000) {
    formattingScore -= 15;
    formattingIssues.push({
      issue: "Resume exceeds recommended length limit",
      severity: "low",
      recommendation: "Condense experience to 1–2 focused, impactful pages.",
    });
  }

  // Clamp all scores between 0 and 100
  atsScore = Math.max(0, Math.min(100, atsScore));
  contentScore = Math.max(0, Math.min(100, contentScore));
  formattingScore = Math.max(0, Math.min(100, formattingScore));
  keywordScore = Math.max(0, Math.min(100, keywordScore));
  experienceScore = Math.max(0, Math.min(100, experienceScore));

  const overallScore = Math.round(
    atsScore * 0.3 + contentScore * 0.25 + keywordScore * 0.2 + experienceScore * 0.15 + formattingScore * 0.1
  );

  return {
    overallScore,
    atsScore,
    contentScore,
    formattingScore,
    keywordScore,
    experienceScore,
    formattingIssues,
    detectedKeywords,
    missingSections,
  };
}
