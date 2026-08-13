"use client";

import * as React from "react";
import { Settings, Cpu, HardDrive, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Platform configuration, AI engine status, and local storage provider</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Engine Abstraction</h3>
              <p className="text-xs text-slate-500">Configured provider model</p>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-600">Active Provider:</span>
            <Badge variant="default" className="capitalize">Mock / Fallback AI Provider</Badge>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
            <span className="text-slate-600">Structured Output:</span>
            <Badge variant="success">Strict Zod Schema Validated</Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">File Storage Provider</h3>
              <p className="text-xs text-slate-500">Local upload directory</p>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-600">Storage Mode:</span>
            <Badge variant="secondary">Local FileSystem (./uploads)</Badge>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
            <span className="text-slate-600">Magic Bytes Validation:</span>
            <Badge variant="success">Active (PDF &amp; DOCX signature check)</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
