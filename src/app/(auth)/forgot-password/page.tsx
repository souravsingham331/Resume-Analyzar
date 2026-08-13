"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">
              Resume<span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Reset Password</h2>
          <p className="text-sm text-slate-500">Enter your registered email address</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Reset instructions sent!</h3>
              <p className="text-xs text-slate-500">
                We have sent password reset instructions to <strong className="text-slate-800">{email}</strong> if an account exists.
              </p>
              <Link href="/login" className="block pt-2">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
