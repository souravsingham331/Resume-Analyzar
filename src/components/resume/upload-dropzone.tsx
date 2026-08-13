"use client";

import * as React from "react";
import { Upload, FileText, CheckCircle2, AlertTriangle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";

export interface UploadDropzoneProps {
  onSuccess?: (resume: any) => void;
}

export function UploadDropzone({ onSuccess }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const { showToast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSelectFile = (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    // Validate size (10 MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit. Please upload a smaller file.");
      showToast({ type: "error", title: "File too large", message: "Maximum file size is 10 MB." });
      return;
    }

    // Validate extension
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setError("Unsupported file format. Please upload a PDF or DOCX resume.");
      showToast({ type: "error", title: "Unsupported format", message: "Only PDF and DOCX files are allowed." });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(50);
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress(100);
      setSuccess(true);
      showToast({ type: "success", title: "Upload Successful", message: `${file.name} uploaded and extracted.` });
      
      if (onSuccess) {
        onSuccess(data.resume);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload resume. Please try again.");
      showToast({ type: "error", title: "Upload Failed", message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-indigo-600 bg-indigo-50/50 scale-[1.01]"
              : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm mb-4">
            <Upload className="h-7 w-7" />
          </div>

          <h3 className="text-base font-semibold text-slate-900">Upload your resume</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Drag & drop your resume file here or click browse to select from your computer
          </p>

          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          <p className="mt-3 text-xs text-slate-400">PDF or DOCX • Max 10 MB</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">{file.name}</h4>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="uppercase font-medium">{file.name.split(".").pop()}</span>
                </div>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Progress Bar during upload */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Uploading & Extracting Text...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-4 flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span className="flex-1">{error}</span>
              <button onClick={handleUpload} className="inline-flex items-center space-x-1 font-semibold underline hover:text-red-900">
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="mt-4 flex items-center space-x-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Resume uploaded & text extracted successfully!</span>
            </div>
          )}

          {/* Upload Button */}
          {!success && !isUploading && (
            <div className="mt-5 flex justify-end space-x-3">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button onClick={handleUpload} isLoading={isUploading}>
                Upload & Extract Text
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
