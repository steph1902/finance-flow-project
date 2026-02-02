'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export function QualityAggregationRunner() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runDailyAggregation = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { runAggregationAction } = await import('@/app/(dashboard)/admin/demo-data/actions');
            const result = await runAggregationAction();

            if (!result.success) {
                throw new Error(result.error || 'Failed to trigger aggregation');
            }

            setSuccess(result.message || 'Daily aggregation completed successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
}
