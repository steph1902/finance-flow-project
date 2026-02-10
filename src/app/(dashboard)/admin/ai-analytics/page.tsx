'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Target, Brain, AlertCircle } from 'lucide-react';
import type { AICategorizationStats } from '@/types/ai';

/**
 * Admin AI Analytics Dashboard
 * Displays AI categorization performance, learned keywords, and insights
 */
export default function AIAnalyticsDashboard() {
    const [stats, setStats] = useState<AICategorizationStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/ai-analytics/categorization-stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch AI stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <Sparkles className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                    <p className="mt-2 text-sm text-slate-500">Loading AI analytics...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
                <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                    Failed to load AI analytics
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">AI Categorization Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Monitor AI performance and manage learned keywords
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
                        <Brain className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSuggestions.toLocaleString()}</div>
                        <p className="text-xs text-slate-500">AI categorization attempts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                        <Target className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageConfidence.toFixed(1)}%</div>
                        <p className="text-xs text-slate-500">AI certainty score</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.acceptanceRate.toFixed(1)}%</div>
                        <p className="text-xs text-slate-500">User approval rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Tabs */}
            <Tabs defaultValue="categories" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="categories">Performance by Category</TabsTrigger>
                    <TabsTrigger value="low-confidence">Low Confidence</TabsTrigger>
                    <TabsTrigger value="rejections">Recent Rejections</TabsTrigger>
                </TabsList>

                {/* Category Performance */}
                <TabsContent value="categories" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Performance</CardTitle>
                            <CardDescription>Accuracy and usage statistics per category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.topCategories.map((cat) => (
                                    <div
                                        key={cat.category}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">{cat.category}</h3>
                                                <Badge variant="outline">{cat.count} suggestions</Badge>
                                            </div>
                                            <div className="mt-2 flex gap-4 text-sm text-slate-500">
                                                <span>Acceptance: {cat.acceptanceRate.toFixed(1)}%</span>
                                                <span>Avg Confidence: {cat.avgConfidence.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {cat.acceptedCount}/{cat.count}
                                            </div>
                                            <div className="text-xs text-slate-500">accepted</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Low Confidence Suggestions */}
                <TabsContent value="low-confidence" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Confidence Suggestions</CardTitle>
                            <CardDescription>
                                Suggestions below 70% confidence that need review
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats.lowConfidenceSuggestions.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    <Target className="mx-auto h-8 w-8 opacity-50" />
                                    <p className="mt-2">No low-confidence suggestions found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {stats.lowConfidenceSuggestions.map((suggestion) => (
                                        <div
                                            key={suggestion.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{suggestion.suggestedValue}</p>
                                                <p className="text-sm text-slate-500">
                                                    Transaction: {suggestion.transactionId.slice(0, 8)}...
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-orange-600">
                                                {Math.round(suggestion.confidenceScore * 100)}% confidence
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recent Rejections */}
                <TabsContent value="rejections" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Rejections</CardTitle>
                            <CardDescription>
                                User corrections to learn from and improve accuracy
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats.recentRejections.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    <Sparkles className="mx-auto h-8 w-8 opacity-50" />
                                    <p className="mt-2">No rejections yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {stats.recentRejections.map((rejection) => (
                                        <div
                                            key={rejection.id}
                                            className="rounded-lg border p-4 space-y-2"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="destructive" className="text-xs">
                                                            Rejected
                                                        </Badge>
                                                        <span className="text-sm text-slate-500">
                                                            {new Date(rejection.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="text-sm">
                                                            <span className="text-slate-500">AI Suggested:</span>{' '}
                                                            <span className="font-medium line-through">
                                                                {rejection.suggestedValue}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="text-slate-500">Correct Category:</span>{' '}
                                                            <span className="font-medium text-green-600">
                                                                {rejection.correctCategory}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {rejection.rejectionReason && (
                                                <div className="text-xs text-slate-500">
                                                    Reason: {rejection.rejectionReason.replace(/_/g, ' ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
