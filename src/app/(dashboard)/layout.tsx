import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar user={user} />
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
