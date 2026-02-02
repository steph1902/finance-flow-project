'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Sparkles,
    Target,
    Activity,
    DollarSign,
    Calendar,
    RefreshCw
} from 'lucide-react';

interface Big4Analysis {
    cashflowDiagnosis: {
        netCashflowAvg: number;
        trend: string;
        variability: string;
        assessment: string;
    };
    riskProjection: {
        thirtyDay: { level: 'Safe' | 'Warning' | 'Critical'; description: string };
        sixtyDay: { level: 'Safe' | 'Warning' | 'Critical'; description: string };
        ninetyDay: { level: 'Safe' | 'Warning' | 'Critical'; description: string };
    };
    strategicWeakPoints: {
        structuralIssues: string[];
        bufferStatus: string;
        rhythmBalance: string;
    };
    recommendations: {
        priority: number;
        action: string;
        impact: string;
        metric: string;
    }[];
}

interface AnalysisMetadata {
    responseTimeMs?: number;
    confidenceScore?: number;
    specificityScore?: number;
    analysisDate?: string;
}

export default function InsightsPage() {
    const [analysis, setAnalysis] = useState<Big4Analysis | null>(null);
    const [metadata, setMetadata] = useState<AnalysisMetadata>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cached, setCached] = useState(false);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async (force = false) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai/big4-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variant: 'big4', force })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to generate analysis');
            }

            const data = await res.json();

            if (data.success) {
                setAnalysis(data.analysis);
                setMetadata(data.metadata);
                setCached(data.cached || false);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'Safe': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'Warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'Critical': return <XCircle className="h-5 w-5 text-red-500" />;
            default: return null;
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'Safe': return 'bg-card border-l-green-500 shadow-sm';
            case 'Warning': return 'bg-card border-l-yellow-500 shadow-sm';
            case 'Critical': return 'bg-card border-l-red-500 shadow-sm';
            default: return 'bg-card shadow-sm';
        }
    };

    const submitFeedback = async (rating: number, wasHelpful: boolean) => {
        // Implementation for feedback submission
        console.log('Feedback:', { rating, wasHelpful });
    };

    if (loading && !analysis) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Generating your Big 4 Decision Intelligence...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => fetchAnalysis(true)} className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="container mx-auto p-6">
                <Alert>
                    <AlertDescription>No analysis available. Generate one to get started.</AlertDescription>
                </Alert>
                <Button onClick={() => fetchAnalysis(true)} className="mt-4">
                    Generate Analysis
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        Big 4 Decision Intelligence
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Executive-grade financial analysis powered by AI
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {cached && (
                        <Badge variant="outline" className="gap-1">
                            <Activity className="h-3 w-3" />
                            Cached ({metadata.responseTimeMs}ms)
                        </Badge>
                    )}
                    <Button
                        onClick={() => fetchAnalysis(true)}
                        disabled={loading}
                        variant="outline"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Analysis
                    </Button>
                </div>
            </div>

            {/* Quality Scores */}
            {(metadata.confidenceScore || metadata.specificityScore) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Confidence Score</span>
                                <span className="text-2xl font-bold">{metadata.confidenceScore}%</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Specificity Score</span>
                                <span className="text-2xl font-bold">{metadata.specificityScore}%</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Response Time</span>
                                <span className="text-2xl font-bold">{metadata.responseTimeMs}ms</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                    <TabsTrigger value="recommendations">Actions</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Cashflow Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Cashflow Diagnosis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Net Cashflow</span>
                                    <span className="text-lg font-bold">
                                        ${analysis.cashflowDiagnosis.netCashflowAvg.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Trend</span>
                                    <Badge variant={analysis.cashflowDiagnosis.trend === 'improving' ? 'default' : 'destructive'}>
                                        {analysis.cashflowDiagnosis.trend === 'improving' ? (
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                        )}
                                        {analysis.cashflowDiagnosis.trend}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Variability</span>
                                    <span className="font-medium">{analysis.cashflowDiagnosis.variability}</span>
                                </div>
                                <p className="text-sm text-muted-foreground pt-2 border-t">
                                    {analysis.cashflowDiagnosis.assessment}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Risk Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Risk Projection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {['thirtyDay', 'sixtyDay', 'ninetyDay'].map((period) => {
                                    const key = period as keyof typeof analysis.riskProjection;
                                    const risk = analysis.riskProjection[key];
                                    const label = period === 'thirtyDay' ? '30 Days' : period === 'sixtyDay' ? '60 Days' : '90 Days';

                                    return (
                                        <div key={period} className={`p-4 rounded-xl border border-border border-l-[6px] transition-all hover:shadow-md ${getRiskColor(risk.level)}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {getRiskIcon(risk.level)}
                                                <span className="font-bold text-card-foreground text-base tracking-tight">{label}</span>
                                                <Badge
                                                    variant={risk.level === 'Critical' ? 'destructive' : 'secondary'}
                                                    className="ml-auto font-bold uppercase text-[10px]"
                                                >
                                                    {risk.level}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-card-foreground/80 leading-relaxed">
                                                {risk.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top 3 Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Top 3 Actionable Recommendations
                            </CardTitle>
                            <CardDescription>Specific, measurable actions to improve your financial health</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analysis.recommendations.map((rec, idx) => (
                                <div key={idx} className="p-4 border rounded-lg space-y-2">
                                    <div className="flex items-start gap-3">
                                        <Badge className="mt-1">#{rec.priority}</Badge>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">{rec.action}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                <strong>Impact:</strong> {rec.impact}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Target Metric:</strong> {rec.metric}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Strategic Weak Points */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Strategic Weak Points</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analysis.strategicWeakPoints.structuralIssues.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Structural Issues</h4>
                                    <ul className="space-y-2">
                                        {analysis.strategicWeakPoints.structuralIssues.map((issue, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                                <span className="text-sm">{issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <span className="text-sm text-muted-foreground">Buffer Status</span>
                                    <p className="font-medium">{analysis.strategicWeakPoints.bufferStatus}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Rhythm Balance</span>
                                    <p className="font-medium">{analysis.strategicWeakPoints.rhythmBalance}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Cashflow Tab */}
                <TabsContent value="cashflow" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Cashflow Diagnosis
                            </CardTitle>
                            <CardDescription>Detailed analysis of your cash flow patterns</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <span className="text-sm text-muted-foreground">Net Cashflow</span>
                                    <p className="text-3xl font-bold mt-2">
                                        ${analysis.cashflowDiagnosis.netCashflowAvg.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <span className="text-sm text-muted-foreground">Trend</span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={analysis.cashflowDiagnosis.trend === 'improving' ? 'default' : 'destructive'} className="text-base">
                                            {analysis.cashflowDiagnosis.trend === 'improving' ? (
                                                <TrendingUp className="h-4 w-4 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 mr-1" />
                                            )}
                                            {analysis.cashflowDiagnosis.trend}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <span className="text-sm text-muted-foreground">Variability</span>
                                    <p className="text-2xl font-bold mt-2">{analysis.cashflowDiagnosis.variability}</p>
                                </div>
                            </div>
                            <div className="p-4 border-l-4 border-l-blue-500 bg-card rounded-lg">
                                <h4 className="font-semibold mb-2">Assessment</h4>
                                <p className="text-card-foreground/80">{analysis.cashflowDiagnosis.assessment}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Risks Tab */}
                <TabsContent value="risks" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Risk Projection Detail
                            </CardTitle>
                            <CardDescription>Forward-looking risk analysis across multiple time horizons</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {['thirtyDay', 'sixtyDay', 'ninetyDay'].map((period) => {
                                const key = period as keyof typeof analysis.riskProjection;
                                const risk = analysis.riskProjection[key];
                                const label = period === 'thirtyDay' ? '30-Day Outlook' : period === 'sixtyDay' ? '60-Day Outlook' : '90-Day Outlook';

                                return (
                                    <Card key={period} className={`border-l-[6px] ${getRiskColor(risk.level)}`}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getRiskIcon(risk.level)}
                                                    <span className="text-xl">{label}</span>
                                                </div>
                                                <Badge
                                                    variant={risk.level === 'Critical' ? 'destructive' : risk.level === 'Warning' ? 'secondary' : 'default'}
                                                    className="font-bold uppercase"
                                                >
                                                    {risk.level}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-card-foreground/90 leading-relaxed">{risk.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Action Plan
                            </CardTitle>
                            <CardDescription>Prioritized recommendations to improve your financial health</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analysis.recommendations.map((rec, idx) => (
                                <Card key={idx} className="border-l-4 border-l-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-start gap-3">
                                            <Badge className="text-base px-3 py-1">Priority #{rec.priority}</Badge>
                                            <span className="flex-1">{rec.action}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-semibold text-muted-foreground">Expected Impact</span>
                                                <p className="text-card-foreground/90 mt-1">{rec.impact}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-muted-foreground">Target Metric</span>
                                                <p className="text-card-foreground/90 mt-1">{rec.metric}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
