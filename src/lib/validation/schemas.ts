import { z } from "zod";

// User Registration Schema
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// User Login Schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Job Description Input Schema
export const JobDescriptionSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  description: z.string().min(20, "Job description must be at least 20 characters"),
});

// Zod Schema for Structured AI Resume Analysis Response
export const SkillItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  confidence: z.number().min(0).max(100),
});

export const SectionScoreSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

export const ExperienceAnalysisItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const BulletSuggestionSchema = z.object({
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
});

export const FormattingIssueSchema = z.object({
  issue: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  recommendation: z.string(),
});

export const RecommendationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
});

export const JobMatchSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedRequirements: z.array(z.string()),
  missingRequirements: z.array(z.string()),
  transferableSkills: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  contentScore: z.number().min(0).max(100),
  formattingScore: z.number().min(0).max(100),
  keywordScore: z.number().min(0).max(100),
  experienceScore: z.number().min(0).max(100),

  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  matchedKeywords: z.array(z.string()),
  skills: z.array(SkillItemSchema),
  sections: z.array(SectionScoreSchema),
  experienceAnalysis: z.array(ExperienceAnalysisItemSchema),
  bulletSuggestions: z.array(BulletSuggestionSchema),
  formattingIssues: z.array(FormattingIssueSchema),
  missingSections: z.array(z.string()),
  recommendations: z.array(RecommendationSchema),
  jobMatch: JobMatchSchema.optional(),
});
