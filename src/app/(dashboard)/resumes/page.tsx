"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Eye, Play, Sparkles, AlertTriangle } from "lucide-react";
import { UploadDropzone } from "@/components/resume/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export default function ResumesPage() {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedResumeText, setSelectedResumeText] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const router = useRouter();
  const { showToast } = useToast();

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      if (res.ok) {
        setResumes(data.resumes || []);
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to load resumes" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/resumes/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        showToast({ type: "success", title: "Deleted", message: "Resume removed successfully." });
        setResumes((prev) => prev.filter((r) => r.id !== deleteId));
      } else {
        throw new Error("Delete failed");
      }
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to delete resume." });
    } finally {
      setDeleteId(null);
    }
  };

  const handleAnalyze = async (resumeId: string) => {
    try {
      showToast({ type: "info", title: "Analyzing Resume...", message: "Evaluating ATS compatibility and quality." });
      const res = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ type: "success", title: "Analysis Complete!", message: "Opening analysis dashboard." });
        router.push(`/analyses/${data.analysis.id}`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Analysis Error", message: err.message || "Failed to complete analysis" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
        <p className="text-sm text-slate-500 mt-1">Upload, manage, and extract text from your resume files</p>
      </div>

      {/* Upload Dropzone */}
      <UploadDropzone onSuccess={() => fetchResumes()} />

      {/* Uploaded Resumes List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Uploaded Documents ({resumes.length})</h3>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
            <p className="text-sm text-slate-500">No resumes uploaded yet. Drag & drop a PDF or DOCX file above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {resumes.map((resume) => {
              const latestAnalysis = resume.analyses?.[0];
              return (
                <div key={resume.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{resume.originalFileName}</h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                        <span>{formatFileSize(resume.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(resume.createdAt).toLocaleDateString()}</span>
                        {latestAnalysis && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                              Score: {latestAnalysis.overallScore}/100
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedResumeText(resume.extractedText)}
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View Text
                    </Button>

                    <Button size="sm" onClick={() => handleAnalyze(resume.id)}>
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Analyze
                    </Button>

                    <button
                      onClick={() => setDeleteId(resume.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Extracted Text Modal */}
      <Dialog
        isOpen={!!selectedResumeText}
        onClose={() => setSelectedResumeText(null)}
        title="Extracted Resume Content"
        description="Raw extracted text parsed from your uploaded document"
      >
        <div className="max-h-96 overflow-y-auto rounded-lg bg-slate-900 p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap">
          {selectedResumeText}
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Resume Deletion"
        description="Are you sure you want to delete this resume? All associated analysis reports will be permanently deleted."
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>This action cannot be undone.</span>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
