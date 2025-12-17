"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, FileTextIcon } from "lucide-react"
import { createReport, type Report } from "@/hooks/useReports"
import { toast } from "sonner"

interface ReportGeneratorProps {
  onReportGenerated?: (report: Report) => void;
}

export function ReportGenerator({ onReportGenerated }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<Report['type']>("MONTHLY")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleGenerate = async () => {
    if (!name || !startDate || !endDate) {
      toast.error("Please fill all required fields")
      return
    }

    setIsGenerating(true)
    try {
      const report = await createReport(
        name,
        type,
        new Date(startDate),
        new Date(endDate)
      )
      
      toast.success("Report generated successfully!")
      onReportGenerated?.(report)
      
      // Reset form
      setName("")
      setStartDate("")
      setEndDate("")
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast.error("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="size-5" />
          Generate New Report
        </CardTitle>
        <CardDescription>
          Create custom financial reports with date range and filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-name">Report Name</Label>
          <Input
            id="report-name"
            placeholder="Monthly Budget Review"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as Report['type'])}>
            <SelectTrigger id="report-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">Monthly Summary</SelectItem>
              <SelectItem value="YEARLY">Yearly Summary</SelectItem>
              <SelectItem value="CATEGORY">Category Breakdown</SelectItem>
              <SelectItem value="TAX">Tax Report</SelectItem>
              <SelectItem value="CUSTOM">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !name || !startDate || !endDate}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  )
}
