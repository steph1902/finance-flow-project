"use client";

import { useState } from "react";
import { DownloadIcon, CalendarIcon, FilterIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExportDialogProps {
  onExport: (options: {
    startDate?: string;
    endDate?: string;
    category?: string;
    format: "csv" | "json";
  }) => Promise<void>;
}

export function ExportDialog({ onExport }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(category && { category }),
        format,
      });
      setOpen(false);
      // Reset form
      setStartDate("");
      setEndDate("");
      setCategory("");
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <DownloadIcon />
          Export Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
          <DialogDescription>
            Download your transaction data with optional filters
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Format Selection */}
          <div className="grid gap-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={format === "csv" ? "default" : "outline"}
                onClick={() => setFormat("csv")}
                className="w-full"
              >
                CSV
              </Button>
              <Button
                type="button"
                variant={format === "json" ? "default" : "outline"}
                onClick={() => setFormat("json")}
                className="w-full"
              >
                JSON (All Data)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {format === "csv"
                ? "Export transactions as CSV spreadsheet"
                : "Export all data including budgets and goals"}
            </p>
          </div>

          {format === "csv" && (
            <>
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">
                    <CalendarIcon className="inline size-3 mr-1" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">
                    <CalendarIcon className="inline size-3 mr-1" />
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="grid gap-2">
                <Label htmlFor="category">
                  <FilterIcon className="inline size-3 mr-1" />
                  Category (Optional)
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Food, Transport"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
