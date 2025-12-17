"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileTextIcon } from "lucide-react"
import { useReports } from "@/hooks/useReports"
import { ReportCard } from "./ReportCard"

export function ReportList() {
  const { reports, isLoading } = useReports(20)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="size-5" />
            Your Reports
          </CardTitle>
          <CardDescription>
            You haven&apos;t generated any reports yet. Create your first report above.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="type-h3 mb-2">Your Reports</h2>
        <p className="type-small text-muted-foreground">
          {reports.length} report{reports.length === 1 ? '' : 's'} generated
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  )
}
