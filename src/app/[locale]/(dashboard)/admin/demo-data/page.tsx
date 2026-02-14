"use client";

import { useSession, signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Sparkles, TestTube, Zap, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { TransactionGenerator } from "@/components/admin/TransactionGenerator";
import { ExperimentGenerator } from "@/components/admin/ExperimentGenerator";
import { QualityAggregationRunner } from "@/components/admin/QualityAggregationRunner";

export default function DemoDataPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8 text-center">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Lock className="h-6 w-6" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              You must be logged in to generate demo data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                Administrative tools are protected. Please log in to continue.
              </AlertDescription>
            </Alert>
            <Button onClick={() => signIn()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8 text-primary" />
          Demo Data Generator
        </h1>
        <p className="text-muted-foreground mt-1">
          Quickly populate your account with realistic data to test Phase 4
          Decision Intelligence features.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Big 4 Insights</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Executive-grade analysis diagnosing cashflow, projecting 90-day
              risks, and providing actionable strategic recommendations.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <TestTube className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Experiments</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scientific A/B testing of AI prompts. Compare Big 4 models against
              baselines to verify accuracy and advice quality.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">AI Quality</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              MLOps monitoring for AI performance. Tracks response times,
              satisfaction scores, and detects model "drift" in real-time.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Demo Data</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Populate thousands of transactions instantly to see high-density
              visualizations and complex AI insights in action.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Badge variant="outline">Logged in as {session?.user?.email}</Badge>
        </div>
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
              onClick={() => (window.location.href = "/dashboard/insights")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Big 4 Insights Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/admin/experiments")}
            >
              <TestTube className="h-4 w-4 mr-2" />
              A/B Testing Experiments
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/admin/ai-quality")}
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
          <CardDescription>
            Follow these steps to test Phase 4 features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <Badge>1</Badge>
              <div>
                <strong>Generate Transactions</strong>
                <p className="text-muted-foreground">
                  Create 100+ demo transactions to have enough data for analysis
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge>2</Badge>
              <div>
                <strong>Test Big 4 Insights</strong>
                <p className="text-muted-foreground">
                  Go to /dashboard/insights and click "Refresh Analysis"
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge>3</Badge>
              <div>
                <strong>Create Experiment (Optional)</strong>
                <p className="text-muted-foreground">
                  Generate a demo experiment to see A/B testing in action
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge>4</Badge>
              <div>
                <strong>Run Aggregation (Optional)</strong>
                <p className="text-muted-foreground">
                  Trigger quality metrics aggregation to populate AI quality
                  dashboard
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
