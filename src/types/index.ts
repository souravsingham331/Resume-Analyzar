export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  name: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  extractedText: string;
  parsedDataJson?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface JobDescription {
  id: string;
  userId: string;
  title?: string | null;
  company?: string | null;
  description: string;
  createdAt: Date | string;
}

export interface SkillItem {
  name: string;
  category: string;
  confidence: number;
}

export interface SectionScore {
  name: string;
  score: number;
  feedback: string;
}

export interface ExperienceAnalysisItem {
  company: string;
  role: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface BulletSuggestion {
  original: string;
  improved: string;
  reason: string;
}

export interface FormattingIssue {
  issue: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

export interface Recommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface JobMatchAnalysis {
  matchScore: number;
  matchedRequirements: string[];
  missingRequirements: string[];
  transferableSkills: string[];
  recommendations: string[];
}

export interface ResumeAnalysisData {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  formattingScore: number;
  keywordScore: number;
  experienceScore: number;

  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  skills: SkillItem[];
  sections: SectionScore[];
  experienceAnalysis: ExperienceAnalysisItem[];
  bulletSuggestions: BulletSuggestion[];
  formattingIssues: FormattingIssue[];
  missingSections: string[];
  recommendations: Recommendation[];
  jobMatch?: JobMatchAnalysis;
}

export interface Analysis {
  id: string;
  userId: string;
  resumeId: string;
  jobDescriptionId?: string | null;
  overallScore: number;
  atsScore: number;
  contentScore: number;
  formattingScore: number;
  keywordScore: number;
  experienceScore: number;
  analysisJson: ResumeAnalysisData;
  createdAt: Date | string;
  updatedAt: Date | string;
  resume?: Resume;
  jobDescription?: JobDescription;
}

export interface ExtractedResumeStructure {
  fullText: string;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  sections: {
    summary?: string;
    experience: Array<{
      title?: string;
      company?: string;
      dates?: string;
      description?: string;
      bullets: string[];
    }>;
    education: Array<{
      institution?: string;
      degree?: string;
      dates?: string;
      details?: string;
    }>;
    skills: string[];
    certifications: string[];
    projects: Array<{
      name?: string;
      description?: string;
      tech?: string[];
    }>;
  };
}
