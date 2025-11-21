import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Upload,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface UploadedFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  result?: any;
  error?: string;
}

export default function JSONManualUpload() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.name.endsWith(".json")
    );

    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id
          ? { ...f, status: "uploading", progress: 10 }
          : f
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("operator", user?.username || "unknown");

      // Simulate progress
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, progress: 30 } : f
        )
      );

      const response = await fetch("http://localhost:3005/api/upload", {
        method: "POST",
        body: formData,
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, progress: 70 } : f
        )
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "success", progress: 100, result }
            : f
        )
      );
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? {
                ...f,
                status: "error",
                progress: 0,
                error: error.message,
              }
            : f
        )
      );
    }
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    for (const file of pendingFiles) {
      await uploadFile(file);
    }
  };

  const clearCompleted = () => {
    setFiles((prev) =>
      prev.filter((f) => f.status !== "success" && f.status !== "error")
    );
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "pending":
        return <FileJson className="h-5 w-5 text-gray-400" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: UploadedFile["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "uploading":
        return (
          <Badge className="bg-blue-100 text-blue-800">Uploading...</Badge>
        );
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Manual JSON Upload
        </h2>
        <p className="text-gray-600 mt-1">
          Upload CNC JSON files for quality control analysis
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload JSON Files</CardTitle>
          <CardDescription>
            Drag and drop CNC JSON files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            <Upload
              className={`h-12 w-12 mx-auto mb-4 ${
                isDragging ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragging ? "Drop files here" : "Drag & drop JSON files here"}
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label>
              <input
                type="file"
                multiple
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button type="button" variant="outline" asChild>
                <span className="cursor-pointer">Browse Files</span>
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supported format: .json (CNC machining project files)
            </p>
          </div>

          {/* Action Buttons */}
          {files.length > 0 && (
            <div className="flex gap-3 mt-4">
              <Button
                onClick={uploadAll}
                disabled={pendingCount === 0}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload All ({pendingCount})
              </Button>
              <Button
                onClick={clearCompleted}
                variant="outline"
                disabled={successCount === 0 && errorCount === 0}
              >
                Clear Completed
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue</CardTitle>
            <CardDescription>{files.length} file(s) in queue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(uploadedFile.status)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      {getStatusBadge(uploadedFile.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {uploadedFile.status === "uploading" && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {uploadedFile.progress}%
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadedFile.status === "error" &&
                      uploadedFile.error && (
                        <p className="text-sm text-red-600 mt-1">
                          {uploadedFile.error}
                        </p>
                      )}

                    {/* Success Info */}
                    {uploadedFile.status === "success" &&
                      uploadedFile.result && (
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            ✓ Analysis complete -{" "}
                            {uploadedFile.result.rulesApplied || 0} rules
                            applied
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {uploadedFile.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => uploadFile(uploadedFile)}
                      >
                        Upload
                      </Button>
                    )}
                    {uploadedFile.status === "error" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uploadFile(uploadedFile)}
                      >
                        Retry
                      </Button>
                    )}
                    {uploadedFile.status === "success" && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`/results/${uploadedFile.result?.id}`}
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(uploadedFile.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileJson className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No files uploaded yet. Drag and drop or browse to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
