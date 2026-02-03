'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';

interface AnalysisStep {
    id: string;
    label: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
    duration?: number;
}

interface AnalysisProgressProps {
    isAnalyzing: boolean;
    onComplete?: () => void;
}

const ANALYSIS_STEPS: AnalysisStep[] = [
    { id: 'fetch', label: 'Fetching your transactions', status: 'pending' },
    { id: 'aggregate', label: 'Aggregating financial data', status: 'pending' },
    { id: 'cashflow', label: 'Analyzing cashflow patterns', status: 'pending' },
    { id: 'risk', label: 'Calculating risk projections', status: 'pending' },
    { id: 'weak', label: 'Identifying strategic weaknesses', status: 'pending' },
    { id: 'recommend', label: 'Generating personalized recommendations', status: 'pending' },
    { id: 'quality', label: 'Running quality checks', status: 'pending' },
];

export function AnalysisProgress({ isAnalyzing, onComplete }: AnalysisProgressProps) {
    const [steps, setSteps] = useState<AnalysisStep[]>(ANALYSIS_STEPS);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (!isAnalyzing) {
            // Reset on mount or when not analyzing
            setSteps(ANALYSIS_STEPS);
            setCurrentStepIndex(0);
            setStartTime(null);
            setElapsedTime(0);
            return;
        }

        // Start timer
        const start = Date.now();
        setStartTime(start);

        // Simulate step progression
        const stepDurations = [800, 600, 1200, 1000, 900, 1100, 500]; // ms for each step
        let accumulatedTime = 0;

        const timeouts: NodeJS.Timeout[] = [];

        steps.forEach((_, index) => {
            accumulatedTime += stepDurations[index];

            const timeout = setTimeout(() => {
                setSteps((prev) => {
                    const updated = [...prev];
                    // Mark previous as completed
                    if (index > 0) {
                        updated[index - 1] = {
                            ...updated[index - 1],
                            status: 'completed',
                            duration: stepDurations[index - 1],
                        };
                    }
                    // Mark current as in-progress
                    updated[index] = { ...updated[index], status: 'in-progress' };
                    return updated;
                });
                setCurrentStepIndex(index);
            }, accumulatedTime);

            timeouts.push(timeout);
        });

        // Mark last step as completed and call onComplete
        const finalTimeout = setTimeout(() => {
            setSteps((prev) => {
                const updated = [...prev];
                updated[steps.length - 1] = {
                    ...updated[steps.length - 1],
                    status: 'completed',
                    duration: stepDurations[steps.length - 1],
                };
                return updated;
            });
            onComplete?.();
        }, accumulatedTime + stepDurations[steps.length - 1]);

        timeouts.push(finalTimeout);

        // Update elapsed time every 100ms
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - start);
        }, 100);

        return () => {
            timeouts.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [isAnalyzing]);

    if (!isAnalyzing) return null;

    const completedSteps = steps.filter((s) => s.status === 'completed').length;
    const progress = (completedSteps / steps.length) * 100;

    return (
        <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="pt-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Generating Your Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                            Please wait while we analyze your financial data...
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{(elapsedTime / 1000).toFixed(1)}s</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">
                            {completedSteps} / {steps.length} steps
                        </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${step.status === 'in-progress'
                                    ? 'bg-primary/5 border border-primary/20'
                                    : step.status === 'completed'
                                        ? 'bg-muted/30'
                                        : 'opacity-50'
                                }`}
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {step.status === 'completed' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : step.status === 'in-progress' ? (
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                                )}
                            </div>

                            {/* Label */}
                            <div className="flex-1">
                                <p
                                    className={`text-sm font-medium ${step.status === 'pending' ? 'text-muted-foreground' : ''
                                        }`}
                                >
                                    {step.label}
                                </p>
                            </div>

                            {/* Duration */}
                            {step.duration && (
                                <span className="text-xs text-muted-foreground">
                                    {step.duration}ms
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Estimated time */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-center text-muted-foreground">
                        Estimated time remaining: ~{Math.max(0, 6 - Math.floor(elapsedTime / 1000))}s
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
