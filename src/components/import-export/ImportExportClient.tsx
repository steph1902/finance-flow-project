"use client";

import { ImportSection } from "@/components/import-export/ImportSection";
import { ExportSection } from "@/components/import-export/ExportSection";

export function ImportExportClient() {
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/import-export/template");
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transaction-template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Template download failed:", error);
    }
  };

  return (
    <>
      {/* Import Section */}
      <ImportSection onDownloadTemplate={handleDownloadTemplate} />

      {/* Divider */}
      <div className="border-t" />

      {/* Export Section */}
      <ExportSection />
    </>
  );
}
