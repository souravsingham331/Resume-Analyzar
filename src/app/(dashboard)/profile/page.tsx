"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Lock, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>(null);
  const [name, setName] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
        }
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, newPassword: newPassword || undefined }),
      });

      if (res.ok) {
        showToast({ type: "success", title: "Updated", message: "Profile updated successfully." });
        setNewPassword("");
      } else {
        throw new Error("Update failed");
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to update profile." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/auth/profile", { method: "DELETE" });
      if (res.ok) {
        showToast({ type: "success", title: "Account Deleted", message: "All user data permanently purged." });
        router.push("/login");
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to delete account." });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account information, security, and privacy preferences</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Account Details</h3>

        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Change Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-red-700">
          <ShieldAlert className="h-5 w-5" />
          <h3 className="text-lg font-bold">Danger Zone</h3>
        </div>

        <p className="text-xs text-slate-600 max-w-xl">
          Deleting your account will permanently remove all your uploaded resumes, parsed texts, job matches, and analysis history. This action cannot be reversed.
        </p>

        <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete My Account & Data
        </Button>
      </div>

      <Dialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
        description="Are you sure you want to permanently delete your account and all associated resume data?"
      >
        <div className="space-y-4 pt-2">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete Account Permanently
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
