import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "ResumeAI — Production-Ready AI Resume & ATS Analysis Platform",
  description: "AI-powered resume analysis platform to evaluate ATS compatibility, identify keyword gaps, rewrite weak bullet points, and match resumes against job descriptions.",
  keywords: ["Resume Analyzer", "ATS Score", "AI Resume Optimizer", "Career Tools", "Job Match Engine"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased text-slate-900 bg-background">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
