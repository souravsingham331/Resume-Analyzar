"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  BarChart3,
  Briefcase,
  GitCompare,
  User,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "My Resumes", href: "/resumes", icon: FileText },
    { name: "Analyses", href: "/analyses", icon: Sparkles },
    { name: "Job Matches", href: "/job-matches", icon: Briefcase },
    { name: "Compare Revisions", href: "/analyses/compare", icon: GitCompare },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between hidden md:flex h-screen sticky top-0">
      <div className="p-6">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Resume<span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              ATS Optimizer
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-indigo-500" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4 text-slate-400 hover:text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
