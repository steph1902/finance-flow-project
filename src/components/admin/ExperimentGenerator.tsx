'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TestTube, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export function ExperimentGenerator() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generateDemoExperiment = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Import dynamically to avoid build issues
            const { generateExperimentAction } = await import('@/app/[locale]/(dashboard)/admin/demo-data/actions');

            const result = await generateExperimentAction();

            if (!result.success) {
                throw new Error(result.error || 'Failed to create experiment');
            }

            setSuccess(result.message || 'Success');
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
                    <TestTube className="h-5 w-5" />
                    Generate Demo Experiment
                </CardTitle>
                <CardDescription>
                    Creates a sample A/B test with results
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
                    <div className="text-sm">
                        <strong>Expected Results:</strong>
                        <br />
                        Control: 18.3% action rate
                        <br />
                        Variant B: 24.1% action rate
                        <br />
                        <Badge variant="outline" className="mt-2">
                            Statistically Significant (p &lt; 0.01)
                        </Badge>
                    </div>
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
    );
}
