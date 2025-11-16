"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { InsightsCard, Insight } from "./InsightsCard";
import { AILoading } from "./AILoading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logError } from "@/lib/logger";

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/insights?period=${period}`);

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      logError("Insights fetch error", err, { period });
      setError("Failed to load insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>AI Financial Insights</CardTitle>
              <CardDescription>
                Personalized recommendations based on your spending
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchInsights}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="py-8">
            <AILoading message="Analyzing your spending patterns..." />
          </div>
        )}

        {error && !isLoading && (
          <div className="py-8 text-center">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchInsights} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && insights.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No insights available yet.</p>
            <p className="text-xs mt-1">Add some transactions to get personalized insights!</p>
          </div>
        )}

        {!isLoading && !error && insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightsCard key={index} insight={insight} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
