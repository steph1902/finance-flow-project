import { Metadata } from "next";
import { ImportExportClient } from "@/components/import-export/ImportExportClient";

export const metadata: Metadata = {
  title: "Import & Export | FinanceFlow",
  description: "Import and export your financial data",
};

export default function ImportExportPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import & Export</h1>
        <p className="text-muted-foreground mt-1">
          Manage your financial data with ease
        </p>
      </div>

      {/* Client Component */}
      <ImportExportClient />
    </div>
  );
}
