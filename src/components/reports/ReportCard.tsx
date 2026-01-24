"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Trash2Icon, FileTextIcon, CalendarIcon } from "lucide-react"
import { type Report, downloadReport, deleteReport } from "@/hooks/useReports"
import { format } from "date-fns"
import { toast } from "sonner"
import { mutate } from "swr"

interface ReportCardProps {
  report: Report;
}

const REPORT_TYPE_LABELS: Record<Report['type'], string> = {
  MONTHLY: "Monthly Summary",
  YEARLY: "Yearly Summary",
  CATEGORY: "Category Breakdown",
  TAX: "Tax Report",
  CUSTOM: "Custom Range",
}

export function ReportCard({ report }: ReportCardProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this report?")) return

    try {
      await deleteReport(report.id)
      toast.success("Report deleted")
      mutate('/api/reports')
    } catch (error) {
      console.error("Failed to delete report:", error)
      toast.error("Failed to delete report")
    }
  }

  const handleDownload = (format: 'csv' | 'json') => {
    downloadReport(report.id, format)
    toast.success(`Downloading ${format.toUpperCase()}...`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileTextIcon className="size-4" />
          {report.name}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-primary">
            {REPORT_TYPE_LABELS[report.type]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          <span>
            {format(new Date(report.startDate), 'MMM d, yyyy')} -{' '}
            {format(new Date(report.endDate), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          Generated {format(new Date(report.createdAt), 'MMM d, yyyy')}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload('csv')}
            className="flex-1"
          >
            <DownloadIcon className="size-3 mr-1" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload('json')}
            className="flex-1"
          >
            <DownloadIcon className="size-3 mr-1" />
            JSON
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2Icon className="size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
