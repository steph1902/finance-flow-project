"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { ImportPreview } from "./ImportPreview";
import { ImportErrors } from "./ImportErrors";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, UploadIcon } from "lucide-react";

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: {
    row: number;
    error: string;
    data: Record<string, unknown>;
  }[];
}

interface PreviewTransaction {
  date: string;
  amount: string;
  type: string;
  category: string;
  description?: string;
}

interface ImportSectionProps {
  onDownloadTemplate: () => void;
}

export function ImportSection({ onDownloadTemplate }: ImportSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<PreviewTransaction[]>([]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setPreview([]);

    // Parse CSV for preview (first 10 rows)
    const text = await selectedFile.text();
    const lines = text.trim().split("\n");
    if (lines.length > 1) {
      const previewData = lines.slice(1, 11).map((line) => {
        const values = line.split(",");
        return {
          date: values[0]?.trim() || "",
          amount: values[1]?.trim() || "",
          type: values[2]?.trim() || "",
          category: values[3]?.trim() || "",
          description: values[4]?.trim() || "",
        };
      });
      setPreview(previewData);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import-export/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Please check your file and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Import Transactions</h2>
          <p className="text-muted-foreground mt-1">
            Upload a CSV file to import your transactions
          </p>
        </div>
        <Button variant="outline" onClick={onDownloadTemplate}>
          Download Template
        </Button>
      </div>

      <FileUpload onFileSelect={handleFileSelect} disabled={isUploading} />

      {preview.length > 0 && !result && (
        <>
          <ImportPreview transactions={preview} maxRows={10} />
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
            size="lg"
          >
            <UploadIcon />
            {isUploading
              ? "Importing..."
              : `Import ${preview.length}+ Transactions`}
          </Button>
        </>
      )}

      {result && (
        <div className="space-y-4">
          {/* Success Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2Icon className="size-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Import Complete
                </h3>
                <p className="text-sm text-green-700">
                  {result.successful} of {result.total} transactions imported
                  successfully
                  {result.failed > 0 && ` (${result.failed} failed)`}
                </p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && <ImportErrors errors={result.errors} />}

          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setResult(null);
              setPreview([]);
            }}
            className="w-full"
          >
            Import Another File
          </Button>
        </div>
      )}
    </div>
  );
}
