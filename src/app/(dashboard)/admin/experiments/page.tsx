'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    BeakerIcon,
    PlayIcon,
    PauseIcon,
    TrophyIcon,
    RefreshCw,
    TrendingUp,
    Users,
    Target
} from 'lucide-react';

interface Experiment {
    id: string;
    name: string;
    status: string;
    _count: { results: number };
}

interface ExperimentResults {
    experimentId: string;
    name: string;
    status: string;
    control: {
        name: string;
        samples: number;
        avgRating: number;
        helpfulRate: number;
        actionRate: number;
        avgResponseTime: number;
    };
    variant: {
        name: string;
        samples: number;
        avgRating: number;
        helpfulRate: number;
        actionRate: number;
        avgResponseTime: number;
    };
    significance: {
        pValue: number;
        isSignificant: boolean;
        winner: 'control' | 'variant' | 'no_difference' | null;
        confidence: number;
    };
    metrics: {
        ratingImprovement: number;
        helpfulImprovement: number;
        actionImprovement: number;
    };
}

export default function ExperimentsPage() {
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
    const [results, setResults] = useState<ExperimentResults | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExperiments();
    }, []);

    useEffect(() => {
        if (selectedExperiment) {
            fetchResults(selectedExperiment);
        }
    }, [selectedExperiment]);

    const fetchExperiments = async () => {
        try {
            const res = await fetch('/api/admin/experiments');
            const data = await res.json();
            if (data.success) {
                setExperiments(data.experiments);
                if (data.experiments.length > 0 && !selectedExperiment) {
                    setSelectedExperiment(data.experiments[0].id);
                }
            }
        } catch (err) {
            console.error('Failed to fetch experiments:', err);
        }
    };

    const fetchResults = async (experimentId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/experiments/${experimentId}`);
            const data = await res.json();
            if (data.success) {
                setResults(data.results);
            }
        } catch (err) {
            console.error('Failed to fetch results:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateExperimentStatus = async (experimentId: string, action: string) => {
        try {
            const res = await fetch(`/api/admin/experiments/${experimentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                fetchExperiments();
                if (selectedExperiment === experimentId) {
                    fetchResults(experimentId);
                }
            }
        } catch (err) {
            console.error('Failed to update experiment:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            'RUNNING': 'default',
            'PAUSED': 'secondary',
            'COMPLETED': 'outline'
        };
        return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
    };

    const getImprovementColor = (value: number) => {
        if (value > 20) return 'text-green-600 dark:text-green-400';
        if (value > 0) return 'text-green-500';
        if (value < -10) return 'text-red-600 dark:text-red-400';
        return 'text-yellow-600';
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BeakerIcon className="h-8 w-8 text-primary" />
                        A/B Testing Experiments
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Scientific validation of AI effectiveness
                    </p>
                </div>
                <Button onClick={fetchExperiments} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Experiments List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Experiments</CardTitle>
                        <CardDescription>{experiments.length} total</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {experiments.map((exp) => (
                            <div
                                key={exp.id}
                                onClick={() => setSelectedExperiment(exp.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedExperiment === exp.id
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="font-medium text-sm mb-1">{exp.name}</div>
                                <div className="flex items-center justify-between">
                                    {getStatusBadge(exp.status)}
                                    <span className="text-xs text-muted-foreground">
                                        {exp._count.results} samples
                                    </span>
                                </div>
                            </div>
                        ))}
                        {experiments.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No experiments yet
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Results Panel */}
                <div className="lg:col-span-3 space-y-4">
                    {loading && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center py-8">
                                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!loading && results && (
                        <>
                            {/* Experiment Controls */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>{results.name}</CardTitle>
                                            <CardDescription>Experiment ID: {results.experimentId}</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(results.status)}
                                            {results.status === 'RUNNING' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateExperimentStatus(results.experimentId, 'pause')}
                                                >
                                                    <PauseIcon className="h-4 w-4 mr-1" />
                                                    Pause
                                                </Button>
                                            )}
                                            {results.status === 'PAUSED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateExperimentStatus(results.experimentId, 'resume')}
                                                >
                                                    <PlayIcon className="h-4 w-4 mr-1" />
                                                    Resume
                                                </Button>
                                            )}
                                            {results.significance.isSignificant && results.status === 'RUNNING' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateExperimentStatus(results.experimentId, 'declare_winner')}
                                                >
                                                    <TrophyIcon className="h-4 w-4 mr-1" />
                                                    Declare Winner
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Statistical Significance */}
                            {results.significance.isSignificant && (
                                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                    <TrophyIcon className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-900 dark:text-green-100">
                                        <strong>Statistically Significant!</strong> Winner: {results.significance.winner}
                                        ({results.significance.confidence.toFixed(2)}% confidence, p={results.significance.pValue.toFixed(4)})
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Comparison Table */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Control Group */}
                                <Card className={results.significance.winner === 'control' ? 'border-green-500' : ''}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            {results.control.name}
                                            {results.significance.winner === 'control' && (
                                                <TrophyIcon className="h-5 w-5 text-yellow-500 ml-auto" />
                                            )}
                                        </CardTitle>
                                        <CardDescription>{results.control.samples} samples</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <MetricRow
                                            label="Avg Rating"
                                            value={results.control.avgRating.toFixed(2)}
                                            unit="/5"
                                        />
                                        <MetricRow
                                            label="Helpful Rate"
                                            value={results.control.helpfulRate.toFixed(1)}
                                            unit="%"
                                        />
                                        <MetricRow
                                            label="Action Rate"
                                            value={results.control.actionRate.toFixed(1)}
                                            unit="%"
                                        />
                                        <MetricRow
                                            label="Response Time"
                                            value={results.control.avgResponseTime.toFixed(0)}
                                            unit="ms"
                                        />
                                    </CardContent>
                                </Card>

                                {/* Variant Group */}
                                <Card className={results.significance.winner === 'variant' ? 'border-green-500' : ''}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="h-5 w-5" />
                                            {results.variant.name}
                                            {results.significance.winner === 'variant' && (
                                                <TrophyIcon className="h-5 w-5 text-yellow-500 ml-auto" />
                                            )}
                                        </CardTitle>
                                        <CardDescription>{results.variant.samples} samples</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <MetricRow
                                            label="Avg Rating"
                                            value={results.variant.avgRating.toFixed(2)}
                                            unit="/5"
                                            improvement={results.metrics.ratingImprovement}
                                        />
                                        <MetricRow
                                            label="Helpful Rate"
                                            value={results.variant.helpfulRate.toFixed(1)}
                                            unit="%"
                                            improvement={results.metrics.helpfulImprovement}
                                        />
                                        <MetricRow
                                            label="Action Rate"
                                            value={results.variant.actionRate.toFixed(1)}
                                            unit="%"
                                            improvement={results.metrics.actionImprovement}
                                        />
                                        <MetricRow
                                            label="Response Time"
                                            value={results.variant.avgResponseTime.toFixed(0)}
                                            unit="ms"
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Improvement Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Improvement Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground mb-1">Rating</div>
                                            <div className={`text-2xl font-bold ${getImprovementColor(results.metrics.ratingImprovement)}`}>
                                                {results.metrics.ratingImprovement > 0 ? '+' : ''}
                                                {results.metrics.ratingImprovement.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground mb-1">Helpful Rate</div>
                                            <div className={`text-2xl font-bold ${getImprovementColor(results.metrics.helpfulImprovement)}`}>
                                                {results.metrics.helpfulImprovement > 0 ? '+' : ''}
                                                {results.metrics.helpfulImprovement.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground mb-1">Action Rate</div>
                                            <div className={`text-2xl font-bold ${getImprovementColor(results.metrics.actionImprovement)}`}>
                                                {results.metrics.actionImprovement > 0 ? '+' : ''}
                                                {results.metrics.actionImprovement.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {!loading && !results && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground py-8">
                                    Select an experiment to view results
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricRow({ label, value, unit, improvement }: {
    label: string;
    value: string;
    unit: string;
    improvement?: number
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-semibold">{value}{unit}</span>
                {improvement !== undefined && improvement !== 0 && (
                    <Badge
                        variant={improvement > 0 ? 'default' : 'destructive'}
                        className="text-xs"
                    >
                        {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                    </Badge>
                )}
            </div>
        </div>
    );
}
