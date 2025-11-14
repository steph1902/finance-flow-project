"use client";

import { AlertTriangle, TrendingUp, Lightbulb, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Insight {
  type: "spending_alert" | "trend" | "recommendation" | "achievement";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  category: string | null;
  amount: number | null;
  recommendation: string | null;
}

interface InsightsCardProps {
  insight: Insight;
}

const severityColors = {
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  critical: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const typeIcons = {
  spending_alert: AlertTriangle,
  trend: TrendingUp,
  recommendation: Lightbulb,
  achievement: Trophy,
};

const typeLabels = {
  spending_alert: "Alert",
  trend: "Trend",
  recommendation: "Tip",
  achievement: "Achievement",
};

export function InsightsCard({ insight }: InsightsCardProps) {
  const Icon = typeIcons[insight.type];
  const severityClass = severityColors[insight.severity];

  return (
    <Card className={`${severityClass} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 mt-0.5" />
            <div>
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <CardDescription className="mt-1">
                {insight.message}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="ml-2">
            {typeLabels[insight.type]}
          </Badge>
        </div>
      </CardHeader>
      {insight.recommendation && (
        <CardContent className="pb-4">
          <div className="flex items-start gap-2 text-sm">
            <Lightbulb className="h-4 w-4 mt-0.5 opacity-70" />
            <p className="opacity-80">{insight.recommendation}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
