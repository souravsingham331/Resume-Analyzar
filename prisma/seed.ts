import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@resumeai.com" },
    update: {},
    create: {
      email: "demo@resumeai.com",
      name: "Alex Morgan",
      passwordHash,
    },
  });

  console.log(`✅ Demo user created/verified: ${user.email}`);

  // 2. Create Demo Resume
  const sampleExtractedText = `Alex Morgan
Senior Full Stack Engineer | San Francisco, CA | alex.morgan@example.com | (555) 234-5678 | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 6+ years of experience architecting and scaling web applications using React, Next.js, Node.js, TypeScript, and PostgreSQL. Proven track record of reducing latency by 40% and leading high-performing engineering teams.

WORK EXPERIENCE
Senior Full Stack Engineer | TechCorp Solutions | Jan 2022 – Present
• Architected and developed core customer-facing web dashboard serving 150,000+ monthly active users using Next.js 14, TypeScript, and Tailwind CSS.
• Optimized PostgreSQL database queries and indexing, cutting median API latency by 140ms and reducing AWS RDS infrastructure costs by 22%.
• Spearheaded migration from legacy monolithic REST architecture to scalable GraphQL microservices.
• Mentored 5 junior developers and conducted code reviews enforcing strict TypeScript standards.

Software Engineer | Innovate Software Inc. | Jun 2018 – Dec 2021
• Worked on web application features and resolved production bug fixes.
• Implemented automated CI/CD deployment pipelines using GitHub Actions and Docker.
• Developed RESTful API microservices handling 2M+ daily requests in Node.js and Express.
• Collaborative agile team player participating in daily standups and sprint planning.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2014 – 2018

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, GraphQL, Jest
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git, CI/CD`;

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      name: "Alex_Morgan_Senior_FullStack_Resume.pdf",
      originalFileName: "Alex_Morgan_Senior_FullStack_Resume.pdf",
      fileType: "application/pdf",
      fileSize: 245000,
      storageKey: "demo-resume-key.pdf",
      extractedText: sampleExtractedText,
      parsedDataJson: JSON.stringify({
        contactInfo: {
          name: "Alex Morgan",
          email: "alex.morgan@example.com",
          phone: "(555) 234-5678",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/alexmorgan",
          github: "github.com/alexmorgan",
        },
      }),
    },
  });

  console.log(`✅ Demo resume created: ${resume.name}`);

  // 3. Create Demo Job Description
  const jobDescription = await prisma.jobDescription.create({
    data: {
      userId: user.id,
      title: "Lead Senior Full Stack Engineer - AI Platforms",
      company: "Vanguard Tech Inc.",
      description: `We are looking for a Lead Senior Full Stack Engineer to lead our core AI platform team. 

Key Requirements:
• 5+ years of experience with React, Next.js, TypeScript, and Node.js.
• Proven track record in optimizing backend APIs and PostgreSQL databases.
• Experience with cloud containerization using Docker and Kubernetes on AWS.
• Strong leadership skills and experience mentoring engineering teams.
• Excellent understanding of ATS-friendly clean code practices and system design.`,
    },
  });

  console.log(`✅ Demo job description created: ${jobDescription.title}`);

  // 4. Create Demo Analysis
  const demoAnalysisData = {
    overallScore: 88,
    atsScore: 82,
    contentScore: 85,
    formattingScore: 90,
    keywordScore: 88,
    experienceScore: 92,

    summary: "High-caliber Senior Full Stack candidate with strong architectural experience in Next.js, Node.js, and PostgreSQL. Demonstrates clear quantifiable impact metrics in recent roles.",

    strengths: [
      "Excellent quantifiable metrics (e.g. '150,000+ MAU', '140ms latency reduction', '22% cost savings').",
      "Clean section structure compatible with modern ATS parsers.",
      "Comprehensive technical skill set covering full-stack web engineering.",
    ],

    weaknesses: [
      "Older work experience at Innovate Software includes passive bullet points ('Worked on web application features').",
      "Missing container orchestration keywords like Kubernetes.",
      "Could expand on automated unit/integration test coverage figures.",
    ],

    missingKeywords: ["Kubernetes", "AWS Lambda", "Redis", "TDD", "System Design"],

    matchedKeywords: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GraphQL", "REST API", "Git", "CI/CD"],

    skills: [
      { name: "React / Next.js", category: "Frontend", confidence: 95 },
      { name: "TypeScript", category: "Languages", confidence: 94 },
      { name: "Node.js & Express", category: "Backend", confidence: 90 },
      { name: "PostgreSQL & SQL", category: "Databases", confidence: 88 },
      { name: "GraphQL & REST", category: "APIs", confidence: 86 },
      { name: "Docker & CI/CD", category: "DevOps", confidence: 80 },
    ],

    sections: [
      { name: "Professional Summary", score: 90, feedback: "Concise summary highlighting experience level and core impact metrics." },
      { name: "Work Experience", score: 92, feedback: "Strong action-oriented bullets with clear financial and technical achievements." },
      { name: "Technical Skills", score: 88, feedback: "Well-organized technical skills section categorized logically." },
      { name: "Education", score: 85, feedback: "Degree in Computer Science from accredited university." },
      { name: "ATS Compatibility", score: 82, feedback: "Parses cleanly with low parsing risk." },
    ],

    experienceAnalysis: [
      {
        company: "TechCorp Solutions",
        role: "Senior Full Stack Engineer",
        strengths: ["Great metrics (140ms latency cut, 22% cost reduction)", "Clear leadership duties"],
        weaknesses: [],
        suggestions: ["Add technology version tags"],
      },
      {
        company: "Innovate Software Inc.",
        role: "Software Engineer",
        strengths: ["CI/CD setup and API scale details"],
        weaknesses: ["First bullet point uses passive phrasing"],
        suggestions: ["Replace 'Worked on' with 'Engineered' or 'Architected'"],
      },
    ],

    bulletSuggestions: [
      {
        original: "Worked on web application features and resolved production bug fixes.",
        improved: "Engineered 14+ core SaaS platform features and resolved 80+ high-priority production bug tickets, maintaining 99.9% application uptime.",
        reason: "Replaces passive language with active engineering verbs and uptime reliability metrics.",
      },
      {
        original: "Collaborative agile team player participating in daily standups and sprint planning.",
        improved: "Facilitated agile sprint planning and bi-weekly retrospectives, increasing team velocity by 18% across 6 engineering sprints.",
        reason: "Turns routine attendance into a leadership achievement with measurable team velocity improvements.",
      },
    ],

    formattingIssues: [
      {
        issue: "Contains non-standard bullet symbols in older sections",
        severity: "low" as const,
        recommendation: "Use standard round bullet dots (•) for maximum parser readability.",
      },
    ],

    missingSections: [],

    recommendations: [
      {
        priority: "high" as const,
        title: "Incorporate Kubernetes Keywords",
        description: "The job description specifically emphasizes Kubernetes. Include any experience with container orchestration.",
      },
      {
        priority: "medium" as const,
        title: "Strengthen First Role Bullet Point",
        description: "Update the first bullet under Innovate Software to emphasize feature impact rather than tasks.",
      },
    ],

    jobMatch: {
      matchScore: 87,
      matchedRequirements: [
        "5+ years experience with React, Next.js, TypeScript, and Node.js",
        "Proven track record optimizing PostgreSQL database performance",
        "Experience mentoring developers and leading code reviews",
      ],
      missingRequirements: [
        "Kubernetes cluster management experience",
      ],
      transferableSkills: [
        "Microservices architecture migration",
        "Automated CI/CD deployment workflows",
      ],
      recommendations: [
        "Highlight any container deployment experience on AWS ECS or EKS.",
      ],
    },
  };

  const analysis = await prisma.analysis.create({
    data: {
      userId: user.id,
      resumeId: resume.id,
      jobDescriptionId: jobDescription.id,
      overallScore: 88,
      atsScore: 82,
      contentScore: 85,
      formattingScore: 90,
      keywordScore: 88,
      experienceScore: 92,
      analysisJson: JSON.stringify(demoAnalysisData),
    },
  });

  console.log(`✅ Demo analysis created (ID: ${analysis.id})`);
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
