"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown, Lightbulb, Check } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";

interface BudgetSuggestion {
  fromCategory: string;
  toCategory: string;
  amount: number;
  reason: string;
  impact: string;
  priority: "high" | "medium" | "low";
}

interface VarianceItem {
  category: string;
  budget: number;
  actual: number;
  variance?: number;
}

interface OptimizationData {
  suggestions: BudgetSuggestion[];
  totalSavings: number;
  confidence: number;
  analysis: {
    overBudget: VarianceItem[];
    underBudget: VarianceItem[];
    balanced: VarianceItem[];
  };
  insights: string[];
  generatedAt: string;
}

export function BudgetOptimizer() {
  const [optimization, setOptimization] = useState<OptimizationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());

  const loadOptimization = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/ai/optimize-budgets?months=3");

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }
        throw new Error("Failed to load optimization");
      }

      const data = await res.json();
      setOptimization(data.data);

      // Select all suggestions by default
      const allIndices = new Set<number>(data.data.suggestions.map((_: unknown, idx: number) => idx));
      setSelectedSuggestions(allIndices);

      toast.success("Budget optimization analysis complete!");
    } catch (error) {
      console.error("Optimization error:", error);
      toast.error("Failed to analyze budgets");
    } finally {
      setLoading(false);
    }
  };

  const applyOptimizations = async () => {
    if (!optimization || selectedSuggestions.size === 0) return;

    setApplying(true);

    try {
      const suggestionsToApply = optimization.suggestions.filter((_, idx) =>
        selectedSuggestions.has(idx)
      );

      const res = await fetch("/api/ai/optimize-budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestions: suggestionsToApply }),
      });

      if (!res.ok) {
        throw new Error("Failed to apply optimizations");
      }

      toast.success(`Applied ${suggestionsToApply.length} budget optimizations!`);

      // Refresh page to show updated budgets
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Apply error:", error);
      toast.error("Failed to apply optimizations");
    } finally {
      setApplying(false);
    }
  };

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSuggestions(newSelected);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Budget Optimizer
            </CardTitle>
            <CardDescription>
              Optimize your budgets based on actual spending patterns
            </CardDescription>
          </div>

          <Button
            onClick={loadOptimization}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Budgets"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Analyzing your budget variance...</span>
          </div>
        )}

        {!loading && !optimization && (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Get AI-powered suggestions to optimize your budget allocation
            </p>
            <Button onClick={loadOptimization}>
              Analyze My Budgets
            </Button>
          </div>
        )}

        {!loading && optimization && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {optimization.suggestions.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Optimization Suggestions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(optimization.totalSavings)}
                  </div>
                  <p className="text-xs text-muted-foreground">To Reallocate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {Math.round(optimization.confidence * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </CardContent>
              </Card>
            </div>

            {/* Variance Analysis */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Over Budget */}
              {optimization.analysis.overBudget.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <h3 className="font-semibold text-sm">Over Budget</h3>
                  </div>
                  <div className="space-y-2">
                    {optimization.analysis.overBudget.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium">{item.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Under Budget */}
              {optimization.analysis.underBudget.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-sm">Under Budget</h3>
                  </div>
                  <div className="space-y-2">
                    {optimization.analysis.underBudget.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium">{item.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Balanced */}
              {optimization.analysis.balanced.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-sm">Well Balanced</h3>
                  </div>
                  <div className="space-y-2">
                    {optimization.analysis.balanced.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium">{item.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {optimization.suggestions.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Optimization Suggestions</h3>
                  <Button
                    onClick={applyOptimizations}
                    disabled={applying || selectedSuggestions.size === 0}
                    size="sm"
                  >
                    {applying ? "Applying..." : `Apply ${selectedSuggestions.size} Selected`}
                  </Button>
                </div>

                <div className="space-y-3">
                  {optimization.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedSuggestions.has(idx)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                        }`}
                      onClick={() => toggleSuggestion(idx)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(suggestion.priority)}`} />
                          <div>
                            <div className="flex items-center gap-2 font-semibold">
                              <span>{suggestion.fromCategory}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span>{suggestion.toCategory}</span>
                            </div>
                            <div className="text-xl font-bold text-primary mt-1">
                              {formatCurrency(suggestion.amount)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={selectedSuggestions.has(idx) ? "default" : "outline"}>
                            {suggestion.priority}
                          </Badge>
                          {selectedSuggestions.has(idx) ? (
                            <Check className="h-5 w-5 text-primary" />
                          ) : (
                            <div className="h-5 w-5 border-2 rounded" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Reason: </span>
                          {suggestion.reason}
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Impact: </span>
                          {suggestion.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="font-semibold text-green-900">
                  Your budgets are well-optimized!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  No significant reallocations needed at this time.
                </p>
              </div>
            )}

            {/* Insights */}
            {optimization.insights.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">AI Insights</h3>
                <div className="space-y-2">
                  {optimization.insights.map((insight, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
