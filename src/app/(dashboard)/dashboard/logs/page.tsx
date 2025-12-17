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
import { Loader2, RefreshCw, AlertTriangle, Info, CheckCircle, Database, Shield } from "lucide-react";
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
            const data = await res.json();
            setLogs(data.logs);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error("Failed to fetch logs", error);
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
                return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">INFO</Badge>;
            case "WARN":
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">WARN</Badge>;
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
            case "API": return <RefreshCw className="w-4 h-4" />;
            case "AUTH": return <Shield className="w-4 h-4" />;
            case "DB": return <Database className="w-4 h-4" />;
            case "UI": return <Info className="w-4 h-4" />;
            case "SYSTEM": return <CheckCircle className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                    <p className="text-muted-foreground">Monitor application events and errors.</p>
                </div>
                <Button onClick={fetchLogs} variant="outline" size="sm">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
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
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {format(new Date(log.timestamp), "MMM dd HH:mm:ss")}
                                            </TableCell>
                                            <TableCell>{getLevelBadge(log.level)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    {getCategoryIcon(log.category)}
                                                    <span>{log.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate" title={log.message}>
                                                {log.message}
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
        </div>
    );
}
