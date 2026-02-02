'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Zap,
    Star,
    Target,
    DollarSign,
    RefreshCw,
    CheckCircle2
} from 'lucide-react';

interface DailyMetrics {
    date: Date;
    variant: string;
    avgResponseTimeMs: number;
    p95ResponseTimeMs: number;
    totalRequests: number;
    errorCount: number;
    errorRate: number;
    avgUserRating: number;
    totalRatings: number;
    actionTakenRate: number;
    avgSpecificity: number;
    avgConfidence: number;
    avgPromptTokens: number;
    avgCompletionTokens: number;
    totalTokens: number;
    uniquePatternsDetected: number;
    anomalyScore: number;
}

interface DriftDetection {
    hasDrift: boolean;
    metrics: string[];
    severity: 'low' | 'medium' | 'high';
}

export default function AIQualityPage() {
    const [metrics, setMetrics] = useState<DailyMetrics[]>([]);
    const [drift, setDrift] = useState<{ big4: DriftDetection; baseline: DriftDetection } | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDays, setSelectedDays] = useState(30);
    const [selectedVariant, setSelectedVariant] = useState<'all' | 'big4' | 'baseline'>('all');

    useEffect(() => {
        fetchMetrics();
    }, [selectedDays, selectedVariant]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const variantParam = selectedVariant === 'all' ? '' : `&variant=${selectedVariant}`;
            const res = await fetch(`/api/admin/ai-quality?days=${selectedDays}${variantParam}`);
            const data = await res.json();

            if (data.success) {
                setMetrics(data.metrics);
                setDrift(data.drift);
            }
        } catch (err) {
            console.error('Failed to fetch metrics:', err);
        } finally {
            setLoading(false);
        }
    };

    const triggerAggregation = async () => {
        setLoading(true);
        try {
            const { runAggregationAction } = await import('@/app/(dashboard)/admin/demo-data/actions');
            const result = await runAggregationAction();

            if (result.success) {
                alert(result.message || 'Daily aggregation complete');
                fetchMetrics();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (err: any) {
            console.error('Failed to trigger aggregation:', err);
            alert('Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getLatestMetrics = (variant: string) => {
        return metrics.filter(m => m.variant === variant).slice(-1)[0];
    };

    const big4Latest = getLatestMetrics('big4');
    const baselineLatest = getLatestMetrics('baseline');

    const getDriftBadge = (drift: DriftDetection) => {
        if (!drift.hasDrift) {
            return <Badge variant="outline" className="gap-1"><CheckCircle2 className="h-3 w-3" />No Drift</Badge>;
        }

        const colors = {
            low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };

        return (
            <Badge className={colors[drift.severity]}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {drift.severity.toUpperCase()} DRIFT
            </Badge>
        );
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Activity className="h-8 w-8 text-primary" />
                        AI Quality Metrics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        MLOps monitoring and drift detection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={triggerAggregation} variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Run Aggregation
                    </Button>
                    <Button onClick={fetchMetrics} variant="outline">
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Time Range:</span>
                            {[7, 14, 30, 60].map(days => (
                                <Button
                                    key={days}
                                    size="sm"
                                    variant={selectedDays === days ? 'default' : 'outline'}
                                    onClick={() => setSelectedDays(days)}
                                >
                                    {days} days
                                </Button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm font-medium">Variant:</span>
                            {(['all', 'big4', 'baseline'] as const).map(variant => (
                                <Button
                                    key={variant}
                                    size="sm"
                                    variant={selectedVariant === variant ? 'default' : 'outline'}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    {variant}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Drift Detection Alerts */}
            {drift && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Big 4 Drift Status</CardTitle>
                                {getDriftBadge(drift.big4)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {drift.big4.hasDrift ? (
                                <div className="space-y-2">
                                    {drift.big4.metrics.map((metric, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                            {metric}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">All metrics within expected range</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Baseline Drift Status</CardTitle>
                                {getDriftBadge(drift.baseline)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {drift.baseline.hasDrift ? (
                                <div className="space-y-2">
                                    {drift.baseline.metrics.map((metric, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                            {metric}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">All metrics within expected range</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Key Metrics */}
            <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="cost">Cost</TabsTrigger>
                    <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard
                            title="Avg Response Time"
                            icon={<Zap className="h-5 w-5" />}
                            big4Value={big4Latest?.avgResponseTimeMs}
                            baselineValue={baselineLatest?.avgResponseTimeMs}
                            unit="ms"
                            lowerIsBetter
                        />
                        <MetricCard
                            title="p95 Response Time"
                            icon={<Activity className="h-5 w-5" />}
                            big4Value={big4Latest?.p95ResponseTimeMs}
                            baselineValue={baselineLatest?.p95ResponseTimeMs}
                            unit="ms"
                            lowerIsBetter
                        />
                        <MetricCard
                            title="Total Requests"
                            icon={<TrendingUp className="h-5 w-5" />}
                            big4Value={big4Latest?.totalRequests}
                            baselineValue={baselineLatest?.totalRequests}
                            unit=""
                        />
                    </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard
                            title="Avg User Rating"
                            icon={<Star className="h-5 w-5" />}
                            big4Value={big4Latest?.avgUserRating}
                            baselineValue={baselineLatest?.avgUserRating}
                            unit="/5"
                            decimals={2}
                        />
                        <MetricCard
                            title="Action Taken Rate"
                            icon={<Target className="h-5 w-5" />}
                            big4Value={big4Latest?.actionTakenRate}
                            baselineValue={baselineLatest?.actionTakenRate}
                            unit="%"
                            decimals={1}
                        />
                        <MetricCard
                            title="Specificity Score"
                            icon={<CheckCircle2 className="h-5 w-5" />}
                            big4Value={big4Latest?.avgSpecificity}
                            baselineValue={baselineLatest?.avgSpecificity}
                            unit="%"
                            decimals={1}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="cost" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard
                            title="Avg Prompt Tokens"
                            icon={<DollarSign className="h-5 w-5" />}
                            big4Value={big4Latest?.avgPromptTokens}
                            baselineValue={baselineLatest?.avgPromptTokens}
                            unit=""
                        />
                        <MetricCard
                            title="Avg Completion Tokens"
                            icon={<DollarSign className="h-5 w-5" />}
                            big4Value={big4Latest?.avgCompletionTokens}
                            baselineValue={baselineLatest?.avgCompletionTokens}
                            unit=""
                        />
                        <MetricCard
                            title="Total Tokens (24h)"
                            icon={<DollarSign className="h-5 w-5" />}
                            big4Value={big4Latest?.totalTokens}
                            baselineValue={baselineLatest?.totalTokens}
                            unit=""
                        />
                    </div>
                </TabsContent>

                <TabsContent value="anomalies" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MetricCard
                            title="Anomaly Score"
                            icon={<AlertTriangle className="h-5 w-5" />}
                            big4Value={big4Latest?.anomalyScore}
                            baselineValue={baselineLatest?.anomalyScore}
                            unit="/100"
                            lowerIsBetter
                            decimals={1}
                        />
                        <MetricCard
                            title="Unique Patterns"
                            icon={<Activity className="h-5 w-5" />}
                            big4Value={big4Latest?.uniquePatternsDetected}
                            baselineValue={baselineLatest?.uniquePatternsDetected}
                            unit=""
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Timeline Chart Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Metrics Timeline</CardTitle>
                    <CardDescription>Historical trends over {selectedDays} days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Chart visualization would go here (recharts/chart.js integration)
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function MetricCard({
    title,
    icon,
    big4Value,
    baselineValue,
    unit,
    lowerIsBetter = false,
    decimals = 0
}: {
    title: string;
    icon: React.ReactNode;
    big4Value?: number;
    baselineValue?: number;
    unit: string;
    lowerIsBetter?: boolean;
    decimals?: number;
}) {
    const formatValue = (val?: number) => {
        if (val === undefined) return 'N/A';
        return val.toFixed(decimals);
    };

    const getDifference = () => {
        if (big4Value === undefined || baselineValue === undefined || baselineValue === 0) return null;
        const diff = ((big4Value - baselineValue) / baselineValue) * 100;
        return diff;
    };

    const diff = getDifference();
    const isBetter = diff !== null && ((lowerIsBetter && diff < 0) || (!lowerIsBetter && diff > 0));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Big 4</span>
                        <span className="text-lg font-bold">
                            {formatValue(big4Value)}{unit}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Baseline</span>
                        <span className="text-lg font-bold text-muted-foreground">
                            {formatValue(baselineValue)}{unit}
                        </span>
                    </div>
                    {diff !== null && (
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Difference</span>
                                <span className={isBetter ? 'text-green-600' : 'text-red-600'}>
                                    {isBetter ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
