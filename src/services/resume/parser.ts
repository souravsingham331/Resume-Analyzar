import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { ExtractedResumeStructure } from "@/types";

export async function extractRawTextFromBuffer(buffer: Buffer, fileType: string): Promise<string> {
  const cleanFileType = fileType.toLowerCase();
  
  if (cleanFileType.includes("pdf") || cleanFileType === ".pdf") {
    try {
      const data = await pdfParse(buffer);
      return data.text || "";
    } catch (err: any) {
      throw new Error(`Failed to parse PDF document: ${err.message || "Corrupted file"}`);
    }
  }

  if (cleanFileType.includes("docx") || cleanFileType.includes("word") || cleanFileType === ".docx") {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    } catch (err: any) {
      throw new Error(`Failed to parse DOCX document: ${err.message || "Corrupted file"}`);
    }
  }

  throw new Error("Unsupported file format for text extraction.");
}

export function parseResumeStructure(rawText: string): ExtractedResumeStructure {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const contactInfo: ExtractedResumeStructure["contactInfo"] = {};
  
  // Extract contact info regex patterns
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contactInfo.email = emailMatch[0];

  const phoneMatch = rawText.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contactInfo.phone = phoneMatch[0];

  const linkedinMatch = rawText.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) contactInfo.linkedin = linkedinMatch[0];

  const githubMatch = rawText.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) contactInfo.github = githubMatch[0];

  // Infer candidate name from top lines if email/phone matches don't collide
  if (lines.length > 0) {
    const candidateName = lines[0];
    if (candidateName.length < 50 && !candidateName.includes("@") && !candidateName.match(/\d{5,}/)) {
      contactInfo.name = candidateName;
    }
  }

  // Section Headers Keywords
  const sectionKeywords: Record<string, RegExp> = {
    summary: /^(summary|profile|about|professional summary|objective|executive summary)/i,
    experience: /^(experience|work experience|employment history|professional experience|career history|work history)/i,
    education: /^(education|academic background|qualifications|degrees)/i,
    skills: /^(skills|technical skills|core competencies|expertise|technologies|tools)/i,
    certifications: /^(certifications|licenses|courses|certificates|credentials)/i,
    projects: /^(projects|key projects|personal projects|portfolio)/i,
  };

  const sectionsData: ExtractedResumeStructure["sections"] = {
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
  };

  let currentSection = "summary";
  const sectionTextMap: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
  };

  for (const line of lines) {
    let matchedNewSection = false;
    for (const [key, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line)) {
        currentSection = key;
        matchedNewSection = true;
        break;
      }
    }

    if (!matchedNewSection) {
      if (sectionTextMap[currentSection]) {
        sectionTextMap[currentSection].push(line);
      }
    }
  }

  // Parse Summary
  sectionsData.summary = sectionTextMap.summary.join(" ");

  // Parse Skills list
  const skillsText = sectionTextMap.skills.join(" ");
  sectionsData.skills = skillsText
    .split(/[,•·|\/\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40);

  // Parse Certifications list
  sectionsData.certifications = sectionTextMap.certifications.filter((line) => line.length > 3);

  // Parse Experience
  const expLines = sectionTextMap.experience;
  let currentExpItem: { title?: string; company?: string; dates?: string; bullets: string[] } | null = null;

  for (const line of expLines) {
    const isBullet = line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || line.startsWith("–");
    const cleanLine = line.replace(/^[•\-\*–]\s*/, "").trim();

    if (!currentExpItem || (!isBullet && cleanLine.length > 5 && (cleanLine.includes("Engineer") || cleanLine.includes("Developer") || cleanLine.includes("Manager") || cleanLine.includes("Lead") || cleanLine.match(/\b(20\d{2}|19\d{2})\b/)))) {
      if (currentExpItem) {
        sectionsData.experience.push(currentExpItem);
      }
      currentExpItem = {
        title: cleanLine,
        bullets: [],
      };
    } else if (currentExpItem) {
      currentExpItem.bullets.push(cleanLine);
    }
  }
  if (currentExpItem) {
    sectionsData.experience.push(currentExpItem);
  }

  // Parse Education
  const eduLines = sectionTextMap.education;
  for (const line of eduLines) {
    if (line.length > 3) {
      sectionsData.education.push({
        institution: line,
        degree: line,
      });
    }
  }

  return {
    fullText: rawText,
    contactInfo,
    sections: sectionsData,
  };
}
