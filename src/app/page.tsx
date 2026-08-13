"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  FileCheck,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Play,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const handleStartDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch("/api/seed-demo", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch {
      router.push("/login");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const faqs = [
    {
      q: "How does the ATS score calculation work?",
      a: "Our ATS evaluator analyzes section headers, parsing readability, bullet density, action verb strength, and keyword alignment against real hiring algorithms to estimate your ATS compatibility score on a 0-100 scale.",
    },
    {
      q: "Are my uploaded resumes and personal data private?",
      a: "Yes. All resumes are stored securely with strict user isolation. We do not sell or expose your personal resume data, and you can delete your files and account at any time.",
    },
    {
      q: "Can I analyze my resume without a job description?",
      a: "Absolutely! If no job description is provided, ResumeAI generates a comprehensive general resume quality audit covering formatting, content impact, bullet verb strength, and ATS parsing readiness.",
    },
    {
      q: "Does ResumeAI invent experience or fake metrics?",
      a: "No. Our AI rules strictly forbid fabricating experience, companies, or fake metrics. Rewrite suggestions enhance your existing experience with active phrasing while prompting you to insert actual measurable numbers.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Resume<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#ats-scoring" className="hover:text-white transition-colors">
              ATS Scoring
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={handleStartDemo}
              isLoading={isDemoLoading}
            >
              <Play className="h-4 w-4 mr-1.5 text-indigo-400 fill-indigo-400" />
              Instant Demo
            </Button>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-950/80 px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-800/50 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Production-Ready AI Resume Analysis Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Analyze Your Resume. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Get Hired Faster.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered resume analysis that helps you understand ATS compatibility, identify keyword gaps, rewrite weak bullet points, and land more technical interviews.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 text-base">
                Analyze My Resume Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={handleStartDemo}
              isLoading={isDemoLoading}
              className="w-full sm:w-auto border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <Play className="h-4 w-4 mr-2 text-indigo-400 fill-indigo-400" />
              View Instant Demo
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-slate-800 max-w-3xl mx-auto">
            <div>
              <p className="text-3xl font-extrabold text-white">94%</p>
              <p className="text-xs text-slate-400 mt-1">ATS Pass Rate Boost</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">3.2x</p>
              <p className="text-xs text-slate-400 mt-1">More Recruiter Replies</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400 mt-1">Truthful Re-writes</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">PDF / DOCX</p>
              <p className="text-xs text-slate-400 mt-1">Instant Text Extraction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-950 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Step-by-Step Workflow</h2>
            <h3 className="text-3xl font-extrabold text-white">How ResumeAI Transforms Your Resume</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                1
              </div>
              <h4 className="text-lg font-bold text-white">Upload Resume</h4>
              <p className="text-sm text-slate-400">
                Drag & drop your PDF or DOCX file (up to 10 MB). Instant text and section extraction.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                2
              </div>
              <h4 className="text-lg font-bold text-white">Paste Job Description</h4>
              <p className="text-sm text-slate-400">
                Optionally paste target job posting details for tailored keyword & requirement matching.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                3
              </div>
              <h4 className="text-lg font-bold text-white">AI Analysis & Scoring</h4>
              <p className="text-sm text-slate-400">
                Evaluates ATS compatibility, content quality, keyword density, and bullet action verbs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                4
              </div>
              <h4 className="text-lg font-bold text-white">Optimize & Export</h4>
              <p className="text-sm text-slate-400">
                Apply side-by-side bullet point suggestions with 1-click copy and export complete PDF report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Showcase */}
      <section id="features" className="py-20 px-6 border-t border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Comprehensive Suite</h2>
            <h3 className="text-3xl font-extrabold text-white">Everything You Need to Beat the ATS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 space-y-4 hover:border-slate-700 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <FileCheck className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Estimated ATS Compatibility</h4>
              <p className="text-sm text-slate-400">
                Transparent 0–100 score evaluating parsing risks, column traps, header completeness, and text readability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 space-y-4 hover:border-slate-700 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Tailored Job Description Match</h4>
              <p className="text-sm text-slate-400">
                Instantly identifies matched keywords vs missing requirements without making false assumptions about your skills.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 space-y-4 hover:border-slate-700 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Bullet Point Rewriter</h4>
              <p className="text-sm text-slate-400">
                Side-by-side comparison replacing weak passive phrasing with high-impact action verbs and metric suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-16 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto rounded-3xl border border-indigo-900/50 bg-gradient-to-br from-indigo-950/40 to-slate-900 p-8 sm:p-12 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white">Strict Privacy & User Control</h4>
            <p className="text-sm text-slate-300">
              Your resume belongs to you. We strictly enforce user isolation, safe AI processing, and 1-click total account data deletion whenever you choose.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 border-t border-slate-800 bg-slate-900">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Frequently Asked Questions</h2>
            <h3 className="text-3xl font-extrabold text-white">Got Questions? We Have Answers.</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${openFaq === idx ? "rotate-180 text-indigo-400" : "text-slate-500"}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="font-bold text-white">ResumeAI Platform</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Register
            </Link>
            <button onClick={handleStartDemo} className="hover:text-white transition-colors">
              Demo Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
