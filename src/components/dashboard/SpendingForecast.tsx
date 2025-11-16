"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Info } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";

interface CategoryForecast {
  category: string;
  type: "INCOME" | "EXPENSE";
  projected: number;
  historical: number;
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  explanation: string;
}

interface MonthlyForecast {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categories: CategoryForecast[];
}

interface ForecastData {
  months: MonthlyForecast[];
  totalProjected: number;
  totalIncome: number;
  totalExpense: number;
  confidence: number;
  methodology: string;
  insights: string[];
  generatedAt: string;
}

export function SpendingForecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(3);

  const loadForecast = async (months: number) => {
    setLoading(true);
    setSelectedMonths(months);

    try {
      const res = await fetch(`/api/ai/forecast?months=${months}`);
      
      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }
        throw new Error("Failed to load forecast");
      }

      const data = await res.json();
      setForecast(data.data);
      toast.success(`${months}-month forecast generated!`);
    } catch (error) {
      console.error("Forecast error:", error);
      toast.error("Failed to generate forecast");
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing": return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMonthName = (month: number) => {
    return new Date(2024, month - 1, 1).toLocaleString("default", { month: "long" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              AI Spending Forecast
            </CardTitle>
            <CardDescription>
              Predict your future spending based on historical patterns
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedMonths === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => loadForecast(1)}
              disabled={loading}
            >
              1 Month
            </Button>
            <Button
              variant={selectedMonths === 3 ? "default" : "outline"}
              size="sm"
              onClick={() => loadForecast(3)}
              disabled={loading}
            >
              3 Months
            </Button>
            <Button
              variant={selectedMonths === 6 ? "default" : "outline"}
              size="sm"
              onClick={() => loadForecast(6)}
              disabled={loading}
            >
              6 Months
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Analyzing your spending patterns...</span>
          </div>
        )}

        {!loading && !forecast && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Select a time period to generate your spending forecast
            </p>
            <Button onClick={() => loadForecast(3)}>
              Generate 3-Month Forecast
            </Button>
          </div>
        )}

        {!loading && forecast && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(forecast.totalExpense)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Projected Expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(forecast.totalIncome)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Projected Income</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {Math.round(forecast.confidence * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Forecast Confidence</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Breakdown */}
            <div>
              <h3 className="font-semibold mb-3">Monthly Breakdown</h3>
              <Tabs defaultValue="month-1">
                <TabsList>
                  {forecast.months.map((month, idx) => (
                    <TabsTrigger key={idx} value={`month-${idx + 1}`}>
                      {getMonthName(month.month)} {month.year}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {forecast.months.map((month, idx) => (
                  <TabsContent key={idx} value={`month-${idx + 1}`} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Income</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(month.totalIncome)}
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">Expenses</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(month.totalExpense)}
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-medium">Net Balance</span>
                        </div>
                        <div className={`text-2xl font-bold ${month.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(month.netBalance)}
                        </div>
                      </div>
                    </div>

                    {/* Category Forecasts */}
                    <div>
                      <h4 className="font-medium mb-3">Category Breakdown</h4>
                      <div className="space-y-2">
                        {month.categories
                          .filter(c => c.type === "EXPENSE")
                          .sort((a, b) => b.projected - a.projected)
                          .slice(0, 8) // Show top 8 categories
                          .map((category, catIdx) => (
                            <div key={catIdx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-3">
                                {getTrendIcon(category.trend)}
                                <div>
                                  <div className="font-medium">{category.category}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {category.explanation}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatCurrency(category.projected)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {Math.round(category.confidence * 100)}% confidence
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Insights */}
            {forecast.insights.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  AI Insights
                </h3>
                <div className="space-y-2">
                  {forecast.insights.map((insight, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Methodology */}
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Methodology:</strong> {forecast.methodology}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
