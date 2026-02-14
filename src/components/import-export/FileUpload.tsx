"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloudIcon, FileTextIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = { "text/csv": [".csv"] },
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection && rejection.errors[0]?.code === "file-too-large") {
          setError(
            `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
          );
        } else if (
          rejection &&
          rejection.errors[0]?.code === "file-invalid-type"
        ) {
          setError("Invalid file type. Please upload a CSV file");
        } else {
          setError("Error uploading file");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file) {
          setSelectedFile(file);
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, maxSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          !isDragActive && "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive bg-destructive/5",
        )}
      >
        <input {...getInputProps()} />
        <UploadCloudIcon className="size-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop the file here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">
              Drag & drop a CSV file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (max {maxSize / 1024 / 1024}MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {selectedFile && !error && (
        <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileTextIcon className="size-8 text-primary" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-muted-foreground hover:text-destructive transition-colors"
            disabled={disabled}
          >
            <XIcon className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
