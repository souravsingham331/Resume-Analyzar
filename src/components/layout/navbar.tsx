"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Menu, X, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavbarProps {
  user?: { email: string; name?: string | null } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span className="font-extrabold text-slate-900">ResumeAI</span>
          </Link>
        </div>

        {/* Desktop Title / Breadcrumb Placeholder */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform</span>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">Resume Analysis Workspace</span>
        </div>

        {/* Quick Action & User menu */}
        <div className="flex items-center space-x-3">
          <Link href="/resumes">
            <Button size="sm" className="hidden sm:inline-flex">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Upload Resume
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                  {user.name || "Candidate"}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{user.email}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {(user.name || user.email || "U")[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            href="/resumes"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            My Resumes
          </Link>
          <Link
            href="/analyses"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Analyses History
          </Link>
          <Link
            href="/job-matches"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Job Matches
          </Link>
          <Link
            href="/analyses/compare"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Compare Revisions
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Settings
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
