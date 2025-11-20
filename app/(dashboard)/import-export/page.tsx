import { Metadata } from "next"
import { ImportSection } from "@/components/import-export/ImportSection"
import { ExportSection } from "@/components/import-export/ExportSection"

export const metadata: Metadata = {
  title: "Import & Export | FinanceFlow",
  description: "Import and export your financial data",
}

export default function ImportExportPage() {
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/import-export/template")
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "transaction-template.csv"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Template download failed:", error)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import & Export</h1>
        <p className="text-muted-foreground mt-1">
          Manage your financial data with ease
        </p>
      </div>

      {/* Import Section */}
      <ImportSection onDownloadTemplate={handleDownloadTemplate} />

      {/* Divider */}
      <div className="border-t" />

      {/* Export Section */}
      <ExportSection />
    </div>
  )
}
