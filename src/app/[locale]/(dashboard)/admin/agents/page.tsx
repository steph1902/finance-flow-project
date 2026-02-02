'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Square, RotateCw, Activity, Brain, Clock, TrendingUp } from 'lucide-react';

interface AgentStatus {
    name: string;
    running: boolean;
    intervalMs: number;
}

interface AgentDecision {
    id: string;
    agentType: string;
    reasoning: string;
    insightsCount: number;
    actionsCount: number;
    highSeverityCount: number;
    executionTimeMs: number;
    timestamp: string;
    insights: any[];
    actions: any[];
}

export default function AgentDashboardPage() {
    const [agents, setAgents] = useState<AgentStatus[]>([]);
    const [decisions, setDecisions] = useState<AgentDecision[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
        // Refresh every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const [agentsRes, decisionsRes] = await Promise.all([
                fetch('/api/admin/agents'),
                fetch('/api/admin/agents/decisions?limit=20')
            ]);

            const agentsData = await agentsRes.json();
            const decisionsData = await decisionsRes.json();

            if (agentsData.success) setAgents(agentsData.data.agents);
            if (decisionsData.success) setDecisions(decisionsData.data.decisions);
        } catch (error) {
            console.error('Failed to load agent data:', error);
        } finally {
            setLoading(false);
        }
    };

    const controlAgent = async (action: string, agentName?: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, agentName })
            });

            const data = await res.json();
            if (data.success) {
                setAgents(data.data);
            }
        } catch (error) {
            console.error('Failed to control agent:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const formatInterval = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading agents...</p>
                </div>
            </div>
        );
    }

    const runningCount = agents.filter(a => a.running).length;
    const totalInsights = decisions.reduce((sum, d) => sum + d.insightsCount, 0);
    const totalActions = decisions.reduce((sum, d) => sum + d.actionsCount, 0);
    const avgExecutionTime = decisions.length > 0
        ? Math.round(decisions.reduce((sum, d) => sum + d.executionTimeMs, 0) / decisions.length)
        : 0;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Brain className="h-8 w-8" />
                        Autonomous Agent Monitor
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time monitoring of AI agents with decision logs and performance metrics
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => controlAgent('start')}
                        disabled={actionLoading || runningCount === agents.length}
                        size="sm"
                    >
                        <Play className="h-4 w-4 mr-1" />
                        Start All
                    </Button>
                    <Button
                        onClick={() => controlAgent('stop')}
                        disabled={actionLoading || runningCount === 0}
                        variant="outline"
                        size="sm"
                    >
                        <Square className="h-4 w-4 mr-1" />
                        Stop All
                    </Button>
                    <Button
                        onClick={() => loadData()}
                        disabled={actionLoading}
                        variant="outline"
                        size="sm"
                    >
                        <RotateCw className="h-4 w-4 mr-1" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{runningCount} / {agents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {runningCount === agents.length ? 'All agents running' : `${agents.length - runningCount} stopped`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInsights}</div>
                        <p className="text-xs text-muted-foreground">Last 20 decisions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actions Taken</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalActions}</div>
                        <p className="text-xs text-muted-foreground">Autonomous actions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Execution</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgExecutionTime}ms</div>
                        <p className="text-xs text-muted-foreground">Decision cycle time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="agents" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="agents">Agent Status</TabsTrigger>
                    <TabsTrigger value="decisions">Decision Logs</TabsTrigger>
                </TabsList>

                {/* Agents Tab */}
                <TabsContent value="agents" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {agents.map((agent) => (
                            <Card key={agent.name}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {agent.name}
                                                {agent.running ? (
                                                    <Badge variant="default" className="bg-green-500">
                                                        <Activity className="h-3 w-3 mr-1" />
                                                        Running
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Stopped</Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                Runs every {formatInterval(agent.intervalMs)}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            {!agent.running ? (
                                                <Button
                                                    onClick={() => controlAgent('start', agent.name)}
                                                    disabled={actionLoading}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => controlAgent('stop', agent.name)}
                                                    disabled={actionLoading}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Square className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Type:</span> Autonomous Agent
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Loop:</span> Observe → Analyze → Decide → Act → Learn
                                        </div>
                                        {agent.name === 'BudgetGuardian' && (
                                            <div className="text-sm text-muted-foreground">
                                                Monitors budget health and sends autonomous alerts
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Decisions Tab */}
                <TabsContent value="decisions" className="space-y-4">
                    <div className="space-y-3">
                        {decisions.map((decision) => (
                            <Card key={decision.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-base">{decision.agentType}</CardTitle>
                                                <Badge variant="outline" className="text-xs">
                                                    {decision.insightsCount} insights
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {decision.actionsCount} actions
                                                </Badge>
                                                {decision.highSeverityCount > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {decision.highSeverityCount} high severity
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="text-xs">
                                                {formatTimestamp(decision.timestamp)} • {decision.executionTimeMs}ms execution time
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Reasoning */}
                                    <div>
                                        <div className="text-sm font-medium mb-1">Reasoning:</div>
                                        <div className="text-sm text-muted-foreground">{decision.reasoning}</div>
                                    </div>

                                    {/* Insights */}
                                    {decision.insights && decision.insights.length > 0 && (
                                        <div>
                                            <div className="text-sm font-medium mb-2">Detected Patterns:</div>
                                            <div className="space-y-2">
                                                {decision.insights.map((insight: any, idx: number) => (
                                                    <div key={idx} className="p-3 bg-muted rounded-md text-sm">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <div className="font-medium">{insight.type.replace(/_/g, ' ')}</div>
                                                            <Badge variant={
                                                                insight.severity === 'critical' ? 'destructive' :
                                                                    insight.severity === 'high' ? 'destructive' :
                                                                        insight.severity === 'medium' ? 'default' : 'secondary'
                                                            } className="text-xs">
                                                                {insight.severity}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-muted-foreground">{insight.description}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Confidence: {(insight.confidence * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {decision.actions && decision.actions.length > 0 && (
                                        <div>
                                            <div className="text-sm font-medium mb-2">Actions Taken:</div>
                                            <div className="space-y-2">
                                                {decision.actions.map((action: any, idx: number) => (
                                                    <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md text-sm">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <div className="font-medium">{action.type.replace(/_/g, ' ')}</div>
                                                            <Badge variant="outline" className="text-xs">{action.priority}</Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{action.reasoning}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        {decisions.length === 0 && (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                                    <p className="text-muted-foreground">No decision logs yet. Start an agent to see activity.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
