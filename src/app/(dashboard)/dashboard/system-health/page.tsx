"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Database, Server, Cpu, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface HealthData {
    apiLatency: number;
    dbStatus: string;
    memoryUsage: number;
    uptime: number;
    vercelFunctionsHealth: string;
    services: { name: string; status: string }[];
    timestamp: string;
}

export default function SystemHealthPage() {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/system/health");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch health data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        return status === "healthy" ? "text-green-500" : "text-red-500";
    };

    const getStatusIcon = (status: string) => {
        return status === "healthy" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />;
    };

    if (loading && !data) {
        return <div className="p-6">Loading system health...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
                <p className="text-muted-foreground">Real-time system performance monitoring.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API Latency</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.apiLatency}ms</div>
                        <p className="text-xs text-muted-foreground">Response time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(data?.memoryUsage || 0)} MB</div>
                        <p className="text-xs text-muted-foreground">Heap used</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.floor((data?.uptime || 0) / 60)} min</div>
                        <p className="text-xs text-muted-foreground">Since last restart</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-green-500">Healthy</div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Service Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data?.services.map((service, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                <div className="font-medium">{service.name}</div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={service.status === "healthy" ? "outline" : "destructive"} className={service.status === "healthy" ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                        {service.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resource Utilization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>API Load</span>
                                <span className="text-muted-foreground">Low</span>
                            </div>
                            <Progress value={25} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Database Connections</span>
                                <span className="text-muted-foreground">Stable</span>
                            </div>
                            <Progress value={40} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Storage</span>
                                <span className="text-muted-foreground">12% used</span>
                            </div>
                            <Progress value={12} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
