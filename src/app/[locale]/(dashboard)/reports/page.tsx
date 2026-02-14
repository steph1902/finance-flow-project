"use client";

import { useState } from "react";
import { FileTextIcon } from "lucide-react";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportList } from "@/components/reports/ReportList";
import { type Report } from "@/hooks/useReports";
import { mutate } from "swr";

export default function ReportsPage() {
  const [, setLastGenerated] = useState<Report | null>(null);

  const handleReportGenerated = (report: Report) => {
    setLastGenerated(report);
    mutate("/api/reports"); // Refresh the list
  };

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="type-h2 flex items-center gap-3">
          <FileTextIcon className="size-8 text-primary" />
          Financial Reports
        </h1>
        <p className="type-body text-muted-foreground max-w-2xl">
          Generate comprehensive financial reports with custom date ranges and
          filters. Export to CSV or JSON format.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        <div>
          <ReportGenerator onReportGenerated={handleReportGenerated} />
        </div>

        <div>
          <ReportList />
        </div>
      </div>
    </div>
  );
}
