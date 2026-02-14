"use client";

import { ExportDialog } from "./ExportDialog";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export function ExportSection() {
  const handleExport = async (options: {
    startDate?: string;
    endDate?: string;
    category?: string;
    format: "csv" | "json";
  }) => {
    try {
      let url = "";

      if (options.format === "json") {
        url = "/api/import-export/export-all";
      } else {
        const params = new URLSearchParams();
        if (options.startDate) params.append("startDate", options.startDate);
        if (options.endDate) params.append("endDate", options.endDate);
        if (options.category) params.append("category", options.category);
        url = `/api/import-export/export?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download =
        options.format === "json"
          ? `financeflow-data-${new Date().toISOString().split("T")[0]}.json`
          : `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Export Data</h2>
        <p className="text-muted-foreground mt-1">
          Download your financial data
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Export Transactions (CSV)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Download your transactions as a spreadsheet with optional filters
          </p>
          <ExportDialog onExport={handleExport} />
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Full Data Export (JSON)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Download all your data including transactions, budgets, and goals
          </p>
          <Button onClick={() => handleExport({ format: "json" })}>
            <DownloadIcon />
            Export All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
