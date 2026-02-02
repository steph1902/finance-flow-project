'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Database,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    TestTube,
    Zap
} from 'lucide-react';

export default function DemoDataPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [transactionCount, setTransactionCount] = useState(100);

    const generateDemoTransactions = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/admin/demo-data/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count: transactionCount })
            });

            if (!res.ok) {
                throw new Error('Failed to generate transactions');
            }

            const data = await res.json();
            setSuccess(`Generated ${data.count} transactions successfully!`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateDemoExperiment = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/admin/demo-data/experiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                throw new Error('Failed to create experiment');
            }

            const data = await res.json();
            setSuccess(`Created experiment "${data.experiment.name}" with demo results!`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const runDailyAggregation = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/admin/ai-quality/aggregate', {
                method: 'POST'
            });

            if (!res.ok) {
                throw new Error('Failed to run aggregation');
            }

            setSuccess('Daily aggregation completed successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Database className="h-8 w-8 text-primary" />
                    Demo Data Generator
                </h1>
                <p className="text-muted-foreground mt-1">
                    Quickly generate demo data to test Phase 4 features
                </p>
            </div>

            {/* Status Messages */}
            {success && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900 dark:text-green-100">
                        {success}
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Generate Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Generate Demo Transactions
                        </CardTitle>
                        <CardDescription>
                            Creates realistic transaction data for Big 4 analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="count">Number of Transactions</Label>
                            <Input
                                id="count"
                                type="number"
                                min="10"
                                max="1000"
                                value={transactionCount}
                                onChange={(e) => setTransactionCount(parseInt(e.target.value) || 100)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Recommended: 100+ for accurate Big 4 analysis
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">What gets created:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Income transactions (salary, freelance)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Fixed expenses (rent, utilities)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Discretionary spending (dining, shopping)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    90-day historical data
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={generateDemoTransactions}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Transactions
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Generate Experiment */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5" />
                            Generate Demo Experiment
                        </CardTitle>
                        <CardDescription>
                            Creates a sample A/B test with results
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">What gets created:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    "Big 4 vs Baseline" experiment
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    500+ sample results per variant
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Realistic metrics (ratings, actions)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Statistical significance achieved
                                </li>
                            </ul>
                        </div>

                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                                <strong>Expected Results:</strong>
                                <br />
                                Control: 18.3% action rate
                                <br />
                                Variant: 43.1% action rate
                                <br />
                                <Badge variant="outline" className="mt-2">p = 0.0023 (99.77% confidence)</Badge>
                            </p>
                        </div>

                        <Button
                            onClick={generateDemoExperiment}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <TestTube className="h-4 w-4 mr-2" />
                                    Create Experiment
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Run Aggregation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Run MLOps Aggregation
                        </CardTitle>
                        <CardDescription>
                            Manually trigger quality metrics aggregation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">What this does:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Aggregates yesterday's AI analyses
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Calculates daily quality metrics
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Enables drift detection
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    Updates AI quality dashboard
                                </li>
                            </ul>
                        </div>

                        <Alert>
                            <AlertDescription className="text-sm">
                                This runs automatically daily. Manual trigger is for testing or backfilling.
                            </AlertDescription>
                        </Alert>

                        <Button
                            onClick={runDailyAggregation}
                            disabled={loading}
                            className="w-full"
                            variant="outline"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4 mr-2" />
                                    Run Aggregation
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                        <CardDescription>Jump to Phase 4 dashboards</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => window.location.href = '/dashboard/insights'}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Big 4 Insights Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => window.location.href = '/admin/experiments'}
                        >
                            <TestTube className="h-4 w-4 mr-2" />
                            A/B Testing Experiments
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => window.location.href = '/admin/ai-quality'}
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            AI Quality Metrics
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>Follow these steps to test Phase 4 features</CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                            <Badge>1</Badge>
                            <div>
                                <strong>Generate Transactions</strong>
                                <p className="text-muted-foreground">Create 100+ demo transactions to have enough data for analysis</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <Badge>2</Badge>
                            <div>
                                <strong>Test Big 4 Insights</strong>
                                <p className="text-muted-foreground">Go to /dashboard/insights and click "Refresh Analysis"</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <Badge>3</Badge>
                            <div>
                                <strong>Create Experiment (Optional)</strong>
                                <p className="text-muted-foreground">Generate a demo experiment to see A/B testing in action</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <Badge>4</Badge>
                            <div>
                                <strong>Run Aggregation (Optional)</strong>
                                <p className="text-muted-foreground">Trigger quality metrics aggregation to populate AI quality dashboard</p>
                            </div>
                        </li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
