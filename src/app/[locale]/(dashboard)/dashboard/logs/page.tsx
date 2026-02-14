"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  Database,
  Shield,
} from "lucide-react";
import { format } from "date-fns";

interface Log {
  id: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  category: "API" | "AUTH" | "SYSTEM" | "UI" | "DB";
  message: string;
  timestamp: string;
  metadata: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (filterLevel !== "ALL") params.append("level", filterLevel);
      if (filterCategory !== "ALL") params.append("category", filterCategory);

      const res = await fetch(`/api/logs?${params}`);

      if (res.status === 401) {
        // Handle unauthorized
        setLogs([]);
        // Optionally redirect or show message
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch logs");

      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch logs", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterLevel, filterCategory]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "INFO":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
          >
            INFO
          </Badge>
        );
      case "WARN":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
          >
            WARN
          </Badge>
        );
      case "ERROR":
        return <Badge variant="destructive">ERROR</Badge>;
      case "DEBUG":
        return <Badge variant="outline">DEBUG</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "API":
        return <RefreshCw className="w-4 h-4" />;
      case "AUTH":
        return <Shield className="w-4 h-4" />;
      case "DB":
        return <Database className="w-4 h-4" />;
      case "UI":
        return <Info className="w-4 h-4" />;
      case "SYSTEM":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast here
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor application events and errors.
          </p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm">
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          {/* ... (keep existing filters) ... */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>Log Entries</CardTitle>
            <div className="flex gap-2">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARN">Warning</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="DEBUG">Debug</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="AUTH">Auth</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                  <SelectItem value="DB">Database</SelectItem>
                  <SelectItem value="UI">UI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedLog(log)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.timestamp), "MMM dd HH:mm:ss")}
                      </TableCell>
                      <TableCell>{getLevelBadge(log.level)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          {getCategoryIcon(log.category)}
                          <span>{log.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[500px] truncate font-medium"
                          title={log.message}
                        >
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(JSON.stringify(log, null, 2))
                          }
                          title="Copy log JSON"
                        >
                          <span className="sr-only">Copy</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M1 9.50006C1 10.3285 1.67157 11 2.5 11H4L4 10H2.5C2.22386 10 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2 2.5 2L9.5 2C9.77614 2 10 2.22392 10 2.50006V4H11V2.50006C11 1.67163 10.3284 1 9.5 1L2.5 1C1.67157 1 1 1.67163 1 2.50006V9.50006ZM5 5.5C5 4.67157 5.67157 4 6.5 4H12.5C13.3284 4 14 4.67157 14 5.5V12.5C14 13.3284 13.3284 14 12.5 14H6.5C5.67157 14 5 13.3284 5 12.5V5.5ZM6.5 5C6.22386 5 6 5.22386 6 5.5V12.5C6 12.7761 6.22386 13 6.5 13H12.5C12.7761 13 13 12.7761 13 12.5V5.5C13 5.22386 12.7761 5 12.5 5H6.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setSelectedLog(null)}
        >
          <Card
            className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  {getLevelBadge(selectedLog.level)}
                  <span className="font-mono text-base font-normal text-muted-foreground">
                    {format(
                      new Date(selectedLog.timestamp),
                      "yyyy-MM-dd HH:mm:ss.SSS",
                    )}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getCategoryIcon(selectedLog.category)}
                  <span>{selectedLog.category}</span>
                  <span>•</span>
                  <span className="font-mono text-xs">{selectedLog.id}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLog(null)}
              >
                <span className="sr-only">Close</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.1929 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Message
                </h3>
                <div className="p-3 bg-muted/50 rounded-md border text-sm font-medium whitespace-pre-wrap break-words">
                  {selectedLog.message}
                </div>
              </div>

              {selectedLog.metadata &&
                Object.keys(selectedLog.metadata).length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Metadata / Stack Trace
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(selectedLog.metadata, null, 2),
                          )
                        }
                      >
                        Copy JSON
                      </Button>
                    </div>
                    <pre className="p-3 bg-slate-950 text-slate-50 rounded-md border text-xs font-mono overflow-auto max-h-[400px]">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
