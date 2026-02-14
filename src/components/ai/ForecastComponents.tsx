"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ForecastData {
  month: string;
  actual?: number;
  predicted: number;
  lower: number;
  upper: number;
}

interface ForecastChartProps {
  data: ForecastData[];
  category?: string;
}

export function ForecastChart({ data, category }: ForecastChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="size-5" />
          {category ? `${category} Forecast` : "Spending Forecast"}
        </CardTitle>
        <CardDescription>
          AI-powered prediction for the next 3 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="Actual"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#82ca9d"
              name="Predicted"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="upper"
              stroke="#ffc658"
              name="Upper Bound"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="lower"
              stroke="#ffc658"
              name="Lower Bound"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface Insight {
  type: "warning" | "success" | "info";
  title: string;
  message: string;
}

interface ForecastInsightsProps {
  insights: Insight[];
}

export function ForecastInsights({ insights }: ForecastInsightsProps) {
  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangleIcon className="size-5 text-yellow-500" />;
      case "success":
        return <CheckCircleIcon className="size-5 text-green-500" />;
      default:
        return <TrendingUpIcon className="size-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>
          Recommendations based on your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-lg border">
            <div className="shrink-0 mt-0.5">{getIcon(insight.type)}</div>
            <div>
              <p className="font-medium text-sm">{insight.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {insight.message}
              </p>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No insights available yet. Keep tracking your expenses!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
