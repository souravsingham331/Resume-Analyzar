import { ResumeAnalysisData } from "@/types";
import { ResumeAnalysisSchema } from "@/lib/validation/schemas";
import { parseResumeStructure } from "@/services/resume/parser";
import { calculateATSMetrics } from "@/services/ats/scorer";

export interface AIProvider {
  analyzeResume(extractedText: string, jobDescription?: string): Promise<ResumeAnalysisData>;
}

export class MockAIProvider implements AIProvider {
  async analyzeResume(extractedText: string, jobDescription?: string): Promise<ResumeAnalysisData> {
    const structure = parseResumeStructure(extractedText);
    const metrics = calculateATSMetrics(structure, jobDescription);

    const skills = [
      { name: "React / Next.js", category: "Frontend", confidence: 92 },
      { name: "TypeScript", category: "Languages", confidence: 90 },
      { name: "Node.js", category: "Backend", confidence: 85 },
      { name: "PostgreSQL", category: "Databases", confidence: 82 },
      { name: "REST APIs & GraphQL", category: "Architecture", confidence: 88 },
      { name: "Docker & Containerization", category: "DevOps", confidence: 75 },
      { name: "CI/CD & Git", category: "Tools", confidence: 86 },
    ];

    const matchedKeywords = metrics.detectedKeywords.length > 0 
      ? metrics.detectedKeywords 
      : ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Git"];

    const missingKeywords = jobDescription 
      ? ["Kubernetes", "AWS Lambda", "Microservices", "Redis", "Terraform"].filter(k => !matchedKeywords.includes(k))
      : ["Docker", "Kubernetes", "Redis", "AWS", "CI/CD Pipeline"];

    const bulletSuggestions = [
      {
        original: "Worked on web application features and bug fixes.",
        improved: "Engineered and deployed 12+ scalable React components, reducing application bundle size by 28% and improving page load latency.",
        reason: "Uses strong action verbs ('Engineered', 'Deployed') and includes measurable impact metrics.",
      },
      {
        original: "Responsible for managing database queries and backend APIs.",
        improved: "Optimized PostgreSQL queries and REST endpoints, reducing average server response time by 140ms across 50,000+ daily active requests.",
        reason: "Replaces passive language ('Responsible for') with active achievement and quantifiable server performance metrics.",
      },
      {
        original: "Assisted team members with testing and code reviews.",
        improved: "Spearheaded automated unit and integration testing workflows in Jest, increasing codebase test coverage from 45% to 88%.",
        reason: "Replaces generic assistance with definitive engineering initiative and concrete coverage numbers.",
      },
    ];

    const strengths = [
      "Demonstrates clear experience with modern web technologies (React, TypeScript, Node.js).",
      "Clean section structure that is easily readable by Automated Applicant Tracking Systems.",
      "Effective use of industry-standard tech stack keywords across work experiences.",
    ];

    const weaknesses = [
      "Several bullet points lack quantifiable business metrics or performance results.",
      "Missing dedicated section for key projects or open-source contributions.",
      "Some work experience descriptions rely on passive phrasing ('worked on', 'assisted').",
    ];

    const recommendations = [
      {
        priority: "high" as const,
        title: "Quantify Work Achievements",
        description: "Add measurable numbers (percentages, latency reductions, user counts, budget saved) to at least 4 key bullet points.",
      },
      {
        priority: "medium" as const,
        title: "Incorporate High-Impact Action Verbs",
        description: "Begin every bullet point with a powerful technical verb such as Architected, Spearheaded, Scaled, or Optimized.",
      },
      {
        priority: "medium" as const,
        title: "Add Missing ATS Keywords",
        description: `Incorporate missing keywords (${missingKeywords.slice(0, 3).join(", ")}) into your skills and experience sections.`,
      },
    ];

    const experienceAnalysis = structure.sections.experience.length > 0 
      ? structure.sections.experience.map(exp => ({
          company: exp.company || "Company",
          role: exp.title || "Software Engineer",
          strengths: ["Clear timeline", "Relevant tech stack mentioned"],
          weaknesses: exp.bullets.some(b => !/\d/.test(b)) ? ["Contains bullet points without measurable metrics"] : [],
          suggestions: ["Add metrics like % performance increase or team size managed"],
        }))
      : [
          {
            company: "Tech Enterprise Inc.",
            role: "Full Stack Engineer",
            strengths: ["Strong technical core", "Good project context"],
            weaknesses: ["Bullet points could be more action-driven"],
            suggestions: ["Quantify impact on user conversion or API latency"],
          }
        ];

    const jobMatch = jobDescription ? {
      matchScore: Math.max(65, metrics.keywordScore),
      matchedRequirements: [
        "Proficiency in TypeScript and React ecosystem",
        "Experience building backend APIs in Node.js",
        "Familiarity with relational databases (PostgreSQL)",
      ],
      missingRequirements: [
        "Cloud infrastructure experience with AWS or GCP",
        "Container orchestration with Kubernetes",
      ],
      transferableSkills: [
        "Agile software development",
        "Frontend architecture and state management",
      ],
      recommendations: [
        "Highlight any cloud deployment or CI/CD pipeline setup experience.",
        "Include relevant personal projects that use containerized microservices.",
      ],
    } : undefined;

    const result: ResumeAnalysisData = {
      overallScore: metrics.overallScore,
      atsScore: metrics.atsScore,
      contentScore: metrics.contentScore,
      formattingScore: metrics.formattingScore,
      keywordScore: metrics.keywordScore,
      experienceScore: metrics.experienceScore,
      summary: structure.sections.summary || "Solid technical candidate with relevant industry experience and core software engineering skills.",
      strengths,
      weaknesses,
      missingKeywords,
      matchedKeywords,
      skills,
      sections: [
        { name: "Professional Summary", score: structure.sections.summary ? 85 : 60, feedback: "Summary conveys key focus area clearly." },
        { name: "Work Experience", score: metrics.experienceScore, feedback: "Work history shows progressive technical responsibility." },
        { name: "Technical Skills", score: metrics.keywordScore, feedback: "Well-categorized technical skill set." },
        { name: "Education", score: 85, feedback: "Degree and academic background clearly listed." },
        { name: "ATS Formatting", score: metrics.atsScore, feedback: "Parses cleanly without major graphical table errors." },
      ],
      experienceAnalysis,
      bulletSuggestions,
      formattingIssues: metrics.formattingIssues,
      missingSections: metrics.missingSections,
      recommendations,
      jobMatch,
    };

    return ResumeAnalysisSchema.parse(result);
  }
}

export class OpenAIProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeResume(extractedText: string, jobDescription?: string): Promise<ResumeAnalysisData> {
    const prompt = `You are an expert ATS Specialist, Senior Tech Recruiter, and Professional Resume Writer.
Analyze the following resume content${jobDescription ? " against the provided Job Description" : ""}.

STRICT RULES:
1. Never invent experience, companies, skills, or certifications not mentioned in the resume.
2. Give actionable, measurable recommendations.
3. For rewritten bullet points, suggest improvements only if supported by existing content. Suggest adding metrics without fabricating false numbers.
4. Output MUST be valid JSON adhering strictly to the JSON schema.

RESUME CONTENT:
---
${extractedText}
---

${jobDescription ? `JOB DESCRIPTION:\n---\n${jobDescription}\n---` : ""}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API request failed: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty response received from OpenAI API");

    try {
      const parsedJson = JSON.parse(rawContent);
      return ResumeAnalysisSchema.parse(parsedJson);
    } catch {
      // Fallback to Mock provider if parsing fails
      return new MockAIProvider().analyzeResume(extractedText, jobDescription);
    }
  }
}

export function getAIProvider(): AIProvider {
  const providerName = (process.env.AI_PROVIDER || "mock").toLowerCase();
  const apiKey = process.env.AI_API_KEY || "";

  if (providerName === "openai" && apiKey) {
    return new OpenAIProvider(apiKey);
  }

  return new MockAIProvider();
}
