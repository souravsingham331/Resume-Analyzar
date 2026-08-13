"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const showToast = React.useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start space-x-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300",
              toast.type === "success" && "bg-emerald-50/95 border-emerald-200 text-emerald-900",
              toast.type === "error" && "bg-red-50/95 border-red-200 text-red-900",
              toast.type === "info" && "bg-indigo-50/95 border-indigo-200 text-indigo-900"
            )}
          >
            {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              {toast.message && <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
