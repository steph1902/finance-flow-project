'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Sparkles, TestTube, Zap } from 'lucide-react';

import { TransactionGenerator } from '@/components/admin/TransactionGenerator';
import { ExperimentGenerator } from '@/components/admin/ExperimentGenerator';
import { QualityAggregationRunner } from '@/components/admin/QualityAggregationRunner';

export default function DemoDataPage() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracted Components */}
                <TransactionGenerator />
                <ExperimentGenerator />
                <QualityAggregationRunner />

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
