"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Activity,
  Database,
  TestTube2,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

export default function DocsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary" />
          AI Features Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to FinanceFlow's enterprise-grade AI and MLOps
          capabilities
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="big4">Big 4 Insights</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="quality">AI Quality</TabsTrigger>
          <TabsTrigger value="demo">Demo Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                What are AI Features?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-card-foreground/90">
                FinanceFlow includes production-grade AI and MLOps (Machine
                Learning Operations) features designed for enterprise
                deployments. These tools help you generate intelligent financial
                insights, validate AI effectiveness, and monitor model
                performance over time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      Big 4 Decision Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-card-foreground/80">
                      AI-powered financial analysis using Google's Gemini 3
                      Flash. Provides executive-grade insights on cashflow,
                      risk, weak points, and action recommendations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TestTube2 className="h-5 w-5 text-purple-500" />
                      A/B Testing Experiments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-card-foreground/80">
                      Scientific validation of AI improvements. Compare
                      different model variants, prompts, or parameters to
                      measure real-world impact on user outcomes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      AI Quality Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-card-foreground/80">
                      Continuous monitoring dashboard. Tracks performance, cost,
                      drift detection, and quality degradation to ensure
                      production reliability.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-orange-500" />
                      Demo Data Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-card-foreground/80">
                      Populate realistic financial data for testing. Generates
                      transactions, experiments, and triggers aggregation for
                      all AI features.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Who Should Use These Features?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="default">Product Teams</Badge>
                <p className="text-sm text-card-foreground/80">
                  Use Big 4 Insights to deliver value to end users with
                  AI-powered financial advice
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary">ML Engineers</Badge>
                <p className="text-sm text-card-foreground/80">
                  Run A/B experiments to validate model improvements and track
                  quality metrics
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline">DevOps/SRE</Badge>
                <p className="text-sm text-card-foreground/80">
                  Monitor AI system reliability, detect drift, and ensure
                  production SLAs
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Big 4 Tab */}
        <TabsContent value="big4" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Big 4 Decision Intelligence Engine
              </CardTitle>
              <CardDescription>
                Executive-grade financial analysis powered by Google Gemini 3
                Flash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Location:</strong> AI → Big 4 Insights (Dashboard →
                  Insights)
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What It Does</h3>
                  <p className="text-card-foreground/80 mb-3">
                    The Big 4 Engine analyzes your financial data and generates
                    a comprehensive report with four critical sections:
                  </p>
                  <div className="grid gap-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">1. Cashflow Diagnosis</h4>
                      <p className="text-sm text-card-foreground/70">
                        Net cashflow trends, variability analysis, and health
                        assessment
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">2. Risk Projection</h4>
                      <p className="text-sm text-card-foreground/70">
                        30/60/90-day forward-looking risk analysis with severity
                        levels
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">
                        3. Strategic Weak Points
                      </h4>
                      <p className="text-sm text-card-foreground/70">
                        Structural issues, buffer status, and spending rhythm
                        imbalances
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">
                        4. Actionable Recommendations
                      </h4>
                      <p className="text-sm text-card-foreground/70">
                        Top 3 prioritized actions with expected impact and
                        target metrics
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">How to Use</h3>
                  <ol className="list-decimal list-inside space-y-2 text-card-foreground/80">
                    <li>
                      Navigate to <strong>AI → Big 4 Insights</strong>
                    </li>
                    <li>
                      Click <strong>Refresh Analysis</strong> to generate a new
                      report
                    </li>
                    <li>Review the four sections in the Overview tab</li>
                    <li>
                      Dive deeper using the Cashflow, Risks, and Actions tabs
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Technical Details
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-card-foreground/70">
                    <li>
                      <strong>Model:</strong> Gemini 3 Flash Preview (frontier
                      intelligence)
                    </li>
                    <li>
                      <strong>Performance:</strong> ~22 seconds response time,
                      Pro-level reasoning
                    </li>
                    <li>
                      <strong>Caching:</strong> Results cached for 24 hours to
                      reduce API costs
                    </li>
                    <li>
                      <strong>Quality Scores:</strong> Confidence and
                      Specificity metrics calculated
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experiments Tab */}
        <TabsContent value="experiments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube2 className="h-5 w-5" />
                A/B Testing Experiments
              </CardTitle>
              <CardDescription>
                Scientific validation of AI model improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Location:</strong> AI → Experiments
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Why Use Experiments?
                  </h3>
                  <p className="text-card-foreground/80 mb-3">
                    Before deploying a new AI prompt, model, or parameter change
                    to all users, you need to validate that it actually improves
                    outcomes. A/B testing provides scientific proof of impact.
                  </p>
                  <div className="p-4 border-l-4 border-l-yellow-500 bg-card rounded">
                    <p className="text-sm font-semibold mb-2">
                      Example Scenario:
                    </p>
                    <p className="text-sm text-card-foreground/70">
                      You update the Big 4 prompt to be "more specific." Instead
                      of deploying it blindly, you run an experiment: 50% of
                      users get the new prompt ("big4"), 50% get the old prompt
                      ("baseline"). After 100 analyses, you compare user
                      ratings, response times, and action rates to determine if
                      the change was actually beneficial.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                  <ol className="list-decimal list-inside space-y-2 text-card-foreground/80">
                    <li>Define two variants (e.g., "big4" vs "baseline")</li>
                    <li>Users are randomly assigned to one variant</li>
                    <li>System tracks performance metrics for each group</li>
                    <li>
                      After reaching statistical significance, compare results
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Tracked Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded">
                      <p className="font-semibold text-sm">Performance</p>
                      <p className="text-xs text-card-foreground/70">
                        Response time, error rate
                      </p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="font-semibold text-sm">Quality</p>
                      <p className="text-xs text-card-foreground/70">
                        Confidence, specificity scores
                      </p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="font-semibold text-sm">User Feedback</p>
                      <p className="text-xs text-card-foreground/70">
                        Ratings, helpfulness, action rate
                      </p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="font-semibold text-sm">Cost</p>
                      <p className="text-xs text-card-foreground/70">
                        Token usage, API costs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                AI Quality Metrics & Monitoring
              </CardTitle>
              <CardDescription>
                Production MLOps dashboard for drift detection and performance
                monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Location:</strong> AI → AI Quality
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    What Is Drift Detection?
                  </h3>
                  <p className="text-card-foreground/80 mb-3">
                    AI models can degrade over time due to changing data
                    patterns, API updates, or real-world shifts. "Drift" refers
                    to performance degradation that happens gradually and
                    silently.
                  </p>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Example:</strong> Your AI model's average response
                      time increases from 2s to 6s over 30 days, or user ratings
                      drop from 4.5★ to 3.2★. The Quality dashboard detects
                      these trends and alerts you before users complain.
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Monitored Metrics
                  </h3>
                  <div className="grid gap-3">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-card-foreground/70">
                        <ul className="list-disc list-inside">
                          <li>Average response time</li>
                          <li>P95 response time (95th percentile)</li>
                          <li>Total requests and error count</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Quality Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-card-foreground/70">
                        <ul className="list-disc list-inside">
                          <li>Average user rating (1-5 stars)</li>
                          <li>
                            Action taken rate (% of users who act on advice)
                          </li>
                          <li>Confidence and specificity scores</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Cost Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-card-foreground/70">
                        <ul className="list-disc list-inside">
                          <li>Average prompt tokens</li>
                          <li>Average completion tokens</li>
                          <li>Total token consumption</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">How to Use</h3>
                  <ol className="list-decimal list-inside space-y-2 text-card-foreground/80">
                    <li>
                      After generating Big 4 analyses, click{" "}
                      <strong>Run Aggregation</strong>
                    </li>
                    <li>
                      The system processes all historical data and populates
                      metrics
                    </li>
                    <li>
                      View trends over 7/14/30/60 days using the time range
                      selector
                    </li>
                    <li>Monitor the "Drift Status" cards for anomalies</li>
                    <li>
                      Set up alerts (future) when metrics exceed thresholds
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Data Tab */}
        <TabsContent value="demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Demo Data Generator
              </CardTitle>
              <CardDescription>
                Populate realistic test data for all AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Location:</strong> AI → Demo Data
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  What You Can Generate
                </h3>
                <div className="grid gap-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-semibold">📊 Transactions</h4>
                    <p className="text-sm text-card-foreground/70">
                      Creates 90 days of realistic income and expenses across
                      multiple categories
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-semibold">🧪 Experiments</h4>
                    <p className="text-sm text-card-foreground/70">
                      Generates simulated A/B test data comparing "big4" vs
                      "baseline" variants
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-semibold">📈 Quality Metrics</h4>
                    <p className="text-sm text-card-foreground/70">
                      Triggers aggregation to populate the AI Quality dashboard
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Quick Start Guide
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-card-foreground/80">
                  <li>
                    Go to <strong>AI → Demo Data</strong>
                  </li>
                  <li>
                    Click <strong>Generate Transactions</strong> (100-500
                    recommended)
                  </li>
                  <li>
                    Navigate to <strong>Big 4 Insights</strong> and generate an
                    analysis
                  </li>
                  <li>
                    Return to Demo Data and click{" "}
                    <strong>Run Aggregation</strong>
                  </li>
                  <li>
                    Check <strong>AI Quality</strong> to see populated metrics
                  </li>
                </ol>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Demo data is tied to your user account.
                  It won't affect other users in a production deployment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
