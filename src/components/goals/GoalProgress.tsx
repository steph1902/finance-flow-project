"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import {
  TrendingUpIcon,
  TargetIcon,
  CalendarIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GoalProgressProps {
  goal: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    status: string;
    createdAt: string;
  };
  compact?: boolean;
}

export function GoalProgress({ goal, compact = false }: GoalProgressProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysUntilTarget = useMemo(() => {
    const now = new Date();
    return Math.ceil(
      (new Date(goal.targetDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }, [goal.targetDate]);
  const isPastDue = daysUntilTarget < 0;
  const isCompleted = goal.status === "COMPLETED";

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{goal.name}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2Icon className="size-5 text-green-500" />
              ) : (
                <TargetIcon className="size-5 text-primary" />
              )}
              {goal.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {goal.status}
              </Badge>
              {!isCompleted && (
                <Badge variant={isPastDue ? "destructive" : "outline"}>
                  <CalendarIcon className="size-3 mr-1" />
                  {isPastDue
                    ? `${Math.abs(daysUntilTarget)} days overdue`
                    : `${daysUntilTarget} days left`}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{Math.round(progress)}%</p>
            <p className="text-xs text-muted-foreground">complete</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {formatCurrency(goal.currentAmount)} of{" "}
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <Progress
            value={Math.min(progress, 100)}
            className={`h-3 ${
              isCompleted
                ? "[&>div]:bg-green-500"
                : progress >= 75
                  ? "[&>div]:bg-primary"
                  : progress >= 50
                    ? "[&>div]:bg-blue-500"
                    : "[&>div]:bg-orange-500"
            }`}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Saved</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-lg font-semibold text-orange-600">
              {formatCurrency(Math.max(0, remaining))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-lg font-semibold">
              {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUpIcon className="size-4" />
            <span>
              Started{" "}
              {formatDistanceToNow(new Date(goal.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {!isCompleted && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              <span>Due {new Date(goal.targetDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
