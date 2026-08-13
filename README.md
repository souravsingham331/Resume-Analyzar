# ResumeAI — Production-Ready Full-Stack Resume Analysis Platform

**ResumeAI** is an AI-powered resume analysis web application built from scratch to help candidates evaluate ATS compatibility, identify skill gaps, optimize experience bullet points with action-oriented metrics, and match resumes against target job descriptions.

---

## 🚀 Key Features

1. **AI Resume Analysis & Parsing Engine**:
   - Extract raw text and structural sections from **PDF** (`pdf-parse`) and **DOCX** (`mammoth`) documents up to **10 MB**.
   - Magic-byte file signature verification to prevent corrupted or malicious file uploads.
2. **ATS Compatibility & Score Gauges**:
   - Transparent **0–100** score system: **Estimated ATS Compatibility Score**, Overall Resume Quality, Content Score, Formatting Score, Keyword Score, and Experience Score.
   - Color coding system:
     - 🔴 `0–39`: Red (Needs Improvement)
     - 🟠 `40–59`: Orange (Fair)
     - 🟡 `60–74`: Yellow (Good)
     - 🟢 `75–89`: Green (Strong Match)
     - 🟢 `90–100`: Excellent Green
3. **Side-by-Side Bullet Point Rewriter**:
   - Compares original bullet points with AI-improved revisions using active technical verbs and quantifiable impact metrics. Includes 1-click **"Copy suggestion"** button.
4. **Tailored Job Description Matching**:
   - Compare uploaded resumes against specific job descriptions to highlight matched requirements vs undetected skill gaps.
5. **Revision Comparison View**:
   - Track ATS score improvements across multiple revisions of a resume side-by-side with delta indicators.
6. **PDF Report Export**:
   - Professional PDF report generation for exporting complete analysis results.
7. **Instant 1-Click Demo Mode**:
   - Built-in demo mode initializing sample candidate data so the app can be fully explored without registration or API key dependencies.
8. **Security & Data Privacy**:
   - Hashed passwords (`bcryptjs`), JWT session cookies (`jose`), strict user resource isolation, and 1-click total account data purge.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React icons, custom design system tokens
- **Data Visualization**: Recharts (Score Gauges, Section Bar Charts)
- **Database & ORM**: Prisma ORM with zero-config SQLite (`file:./dev.db`) for local execution & PostgreSQL support for Docker
- **Authentication**: JWT HTTP-Only session cookies with bcrypt password hashing
- **AI Abstraction**: Pluggable `AIProvider` interface (`MockAIProvider`, `OpenAIProvider`, `GeminiAIProvider`) with Zod schema validation
- **DevOps**: Docker & Docker Compose (`docker-compose.yml`)

---

## 📦 Project Structure

```text
resume-ai/
├── prisma/
│   ├── schema.prisma           # Prisma database schema
│   └── seed.ts                 # Demo database seed script
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router (Pages & API handlers)
│   │   ├── (auth)/             # Login, Register, Forgot Password, Reset Password
│   │   ├── (dashboard)/        # Dashboard, Resumes, Analyses, Job Matches, Profile, Settings
│   │   └── api/                # Auth, Resumes, Analyses, Job Descriptions, Seed-demo APIs
│   ├── components/
│   │   ├── ui/                 # Button, Card, Dialog, Progress, Badge, Toast
│   │   ├── charts/             # ScoreGauge, SectionChart
│   │   ├── resume/             # UploadDropzone, ResumeCard
│   │   ├── analysis/           # BulletOptimizer, KeywordBreakdown, RecommendationsList, JobMatchCard
│   │   └── layout/             # Sidebar, Navbar
│   ├── services/
│   │   ├── ai/                 # AIProvider, MockAIProvider, OpenAIProvider
│   │   ├── resume/             # Document parsing service (PDF & DOCX)
│   │   ├── ats/                # ATS Scoring Engine
│   │   └── storage/            # Local Storage Provider & Magic Bytes validation
│   ├── lib/
│   │   ├── db/                 # Prisma singleton instance
│   │   ├── auth/               # JWT, bcrypt, session cookies
│   │   └── validation/         # Zod schemas
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # Color helpers, class mergers
├── tests/                      # Vitest unit tests
├── Dockerfile                  # Production Docker container setup
├── docker-compose.yml          # App + PostgreSQL docker orchestration
├── .env.example                # Environment variables template
└── README.md
```

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="resume_ai_super_secret_auth_key_32bytes_minimum_length_production_grade"
AI_PROVIDER="mock"
AI_API_KEY=""
STORAGE_PROVIDER="local"
STORAGE_PATH="./uploads"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🏃 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Run Migrations
```bash
npx prisma db push
```

### 3. Seed Demo Data
```bash
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Account Credentials

- **Email**: `demo@resumeai.com`
- **Password**: `Password123!`

---

## 🐳 Docker Setup

Run the application alongside PostgreSQL using Docker Compose:

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run Vitest unit tests:

```bash
npm test
```

Run TypeScript type check:

```bash
npx tsc --noEmit
```
