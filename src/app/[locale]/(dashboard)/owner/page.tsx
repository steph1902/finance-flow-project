"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    TrendingUp,
    Users,
    Globe,
    Activity,
    Sparkles,
    CreditCard,
    Target,
    DollarSign
} from "lucide-react";

interface DashboardStats {
    totalUsers: number;
    activeUsers: {
        last7Days: number;
        last30Days: number;
    };
    featureUsage: {
        transactions: number;
        budgets: number;
        goals: number;
        big4Analyses: number;
        aiCategorizations: number;
    };
    geographic: Array<{
        country: string;
        users: number;
    }>;
    systemHealth: {
        apiCalls: number;
        avgResponseTime: number;
        errorRate: number;
    };
}

export default function OwnerDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/owner/analytics");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Activity className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container mx-auto p-6">
                <p className="text-muted-foreground">Failed to load analytics</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                <p className="text-muted-foreground">
                    Track feature usage, user engagement, and system health
                </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold">{stats.totalUsers}</span>
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active (7d)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold">{stats.activeUsers.last7Days}</span>
                            <Activity className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active (30d)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold">{stats.activeUsers.last30Days}</span>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Countries</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold">{stats.geographic.length}</span>
                            <Globe className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feature Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Feature Usage
                    </CardTitle>
                    <CardDescription>Most popular features among users</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <FeatureUsageBar
                            icon={<DollarSign className="w-4 h4" />}
                            label="Transactions Created"
                            value={stats.featureUsage.transactions}
                            max={Math.max(...Object.values(stats.featureUsage))}
                            color="bg-blue-600"
                        />
                        <FeatureUsageBar
                            icon={<Target className="w-4 h-4" />}
                            label="Budgets Created"
                            value={stats.featureUsage.budgets}
                            max={Math.max(...Object.values(stats.featureUsage))}
                            color="bg-green-600"
                        />
                        <FeatureUsageBar
                            icon={<TrendingUp className="w-4 h-4" />}
                            label="Goals Set"
                            value={stats.featureUsage.goals}
                            max={Math.max(...Object.values(stats.featureUsage))}
                            color="bg-purple-600"
                        />
                        <FeatureUsageBar
                            icon={<Sparkles className="w-4 h-4" />}
                            label="Big 4 Analyses"
                            value={stats.featureUsage.big4Analyses}
                            max={Math.max(...Object.values(stats.featureUsage))}
                            color="bg-yellow-600"
                        />
                        <FeatureUsageBar
                            icon={<CreditCard className="w-4 h-4" />}
                            label="AI Categorizations"
                            value={stats.featureUsage.aiCategorizations}
                            max={Math.max(...Object.values(stats.featureUsage))}
                            color="bg-pink-600"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Geographic Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Geographic Distribution
                        </CardTitle>
                        <CardDescription>Where your users are from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.geographic.slice(0, 5).map((location, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="font-medium">{location.country}</span>
                                    <Badge variant="secondary">{location.users} users</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            System Health
                        </CardTitle>
                        <CardDescription>Performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">API Calls (24h)</span>
                            <span className="font-bold">{stats.systemHealth.apiCalls.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Avg Response Time</span>
                            <span className="font-bold">{stats.systemHealth.avgResponseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Error Rate</span>
                            <span className={`font-bold ${stats.systemHealth.errorRate < 1 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.systemHealth.errorRate.toFixed(2)}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface FeatureUsageBarProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    max: number;
    color: string;
}

function FeatureUsageBar({ icon, label, value, max, color }: FeatureUsageBarProps) {
    const percentage = (value / max) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <span className="text-muted-foreground">{value.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
