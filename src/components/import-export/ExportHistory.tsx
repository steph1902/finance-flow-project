"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DownloadIcon, FileTextIcon, CalendarIcon, CheckCircle2Icon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ExportRecord {
  id: string;
  type: 'transactions' | 'budgets' | 'goals' | 'report';
  format: 'csv' | 'pdf' | 'json';
  fileName: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
  size?: number;
  downloadUrl?: string;
  expiresAt?: string;
}

interface ExportHistoryProps {
  exports: ExportRecord[];
  onDownload?: (exportId: string) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'transactions':
      return '💳';
    case 'budgets':
      return '💰';
    case 'goals':
      return '🎯';
    case 'report':
      return '📊';
    default:
      return '📄';
  }
};

const getFormatColor = (format: string) => {
  switch (format) {
    case 'pdf':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'csv':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'json':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export function ExportHistory({ exports, onDownload }: ExportHistoryProps) {
  if (exports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileTextIcon className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No export history yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your exported files will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Export History</h3>
        <Badge variant="secondary">{exports.length} files</Badge>
      </div>

      <div className="space-y-3">
        {exports.map((exportRecord) => (
          <Card key={exportRecord.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left Section - File Info */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{getTypeIcon(exportRecord.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{exportRecord.fileName}</p>
                      {exportRecord.status === 'completed' && (
                        <CheckCircle2Icon className="size-4 text-green-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge
                        variant="secondary"
                        className={`text-xs uppercase ${getFormatColor(exportRecord.format)}`}
                      >
                        {exportRecord.format}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {exportRecord.type}
                      </Badge>
                      {exportRecord.size && (
                        <span>{formatFileSize(exportRecord.size)}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />
                        {formatDistanceToNow(new Date(exportRecord.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {exportRecord.expiresAt && (
                        <span className="text-orange-600">
                          Expires {formatDistanceToNow(new Date(exportRecord.expiresAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2">
                  {exportRecord.status === 'completed' && onDownload && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(exportRecord.id)}
                    >
                      <DownloadIcon className="size-4" />
                    </Button>
                  )}
                  {exportRecord.status === 'pending' && (
                    <Badge variant="secondary">Processing...</Badge>
                  )}
                  {exportRecord.status === 'failed' && (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
