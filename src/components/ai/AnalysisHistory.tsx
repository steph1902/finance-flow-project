'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Eye,
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

interface AnalysisRecord {
    id: string;
    timestamp: string;
    analysis: Big4Analysis;
    metadata: {
        responseTimeMs?: number;
        confidenceScore?: number;
        specificityScore?: number;
    };
}

interface AnalysisHistoryProps {
    records: AnalysisRecord[];
    onViewDetails: (record: AnalysisRecord) => void;
}

export function AnalysisHistory({ records, onViewDetails }: AnalysisHistoryProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (!records || records.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No analysis history yet</p>
                        <p className="text-sm text-muted-foreground">
                            Run your first Big 4 analysis to see it here
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'Safe':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'Critical':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days === 0) {
            if (hours === 0) return 'Just now';
            return `${hours}h ago`;
        }
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Analyses</span>
                            <span className="text-2xl font-bold">{records.length}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Latest</span>
                            <span className="text-sm text-muted-foreground">
                                {formatDate(records[0].timestamp)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Avg Confidence</span>
                            <span className="text-2xl font-bold">
                                {Math.round(
                                    records.reduce((acc, r) => acc + (r.metadata.confidenceScore || 0), 0) /
                                    records.length
                                )}
                                %
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* History List */}
            <Card>
                <CardHeader>
                    <CardTitle>Analysis History</CardTitle>
                    <CardDescription>View and compare your past financial analyses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {records.map((record) => {
                            const isSelected = selectedId === record.id;
                            const { analysis, metadata } = record;

                            return (
                                <div
                                    key={record.id}
                                    className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${isSelected ? 'border-primary bg-primary/5' : ''
                                        }`}
                                    onClick={() => setSelectedId(isSelected ? null : record.id)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">
                                                    {new Date(record.timestamp).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(record.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {metadata.confidenceScore && (
                                                <Badge variant="secondary">{metadata.confidenceScore}% confidence</Badge>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewDetails(record);
                                                }}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Full
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {isSelected && (
                                        <div className="pt-3 border-t space-y-3">
                                            {/* Cashflow */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Net Cashflow:</span>
                                                    <p className="font-semibold">
                                                        ${analysis.cashflowDiagnosis.netCashflowAvg.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Trend:</span>
                                                    <div className="flex items-center gap-1">
                                                        {analysis.cashflowDiagnosis.trend === 'improving' ? (
                                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <span className="font-semibold capitalize">
                                                            {analysis.cashflowDiagnosis.trend}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Risk Summary */}
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Risk Levels:</p>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        {getRiskIcon(analysis.riskProjection.thirtyDay.level)}
                                                        <span>30d</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        {getRiskIcon(analysis.riskProjection.sixtyDay.level)}
                                                        <span>60d</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        {getRiskIcon(analysis.riskProjection.ninetyDay.level)}
                                                        <span>90d</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Top Recommendation */}
                                            {analysis.recommendations[0] && (
                                                <div className="bg-muted/50 p-3 rounded-lg">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        Top Recommendation:
                                                    </p>
                                                    <p className="text-sm font-medium">{analysis.recommendations[0].action}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
