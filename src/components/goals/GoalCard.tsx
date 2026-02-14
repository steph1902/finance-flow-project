"use client";

import {
  MoreVerticalIcon,
  TrophyIcon,
  CalendarIcon,
  TargetIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/formatters";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    description: string | null;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date | null;
    category: string;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";
    priority: number;
    createdAt: Date;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onAddContribution?: () => void;
  onPause?: () => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddContribution,
  onPause,
}: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.status === "COMPLETED" || progress >= 100;
  const isPaused = goal.status === "PAUSED";
  const isCancelled = goal.status === "CANCELLED";

  const daysRemaining = goal.targetDate
    ? Math.ceil(
        (new Date(goal.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const priorityColors = {
    0: "bg-gray-500",
    1: "bg-blue-500",
    2: "bg-red-500",
  };

  const statusVariant = {
    ACTIVE: "default",
    COMPLETED: "success",
    CANCELLED: "destructive",
    PAUSED: "warning",
  } as const;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        isPaused && "opacity-70",
        isCancelled && "opacity-50",
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-primary/10 text-primary",
            )}
          >
            {isCompleted ? (
              <TrophyIcon className="size-6" />
            ) : (
              <TargetIcon className="size-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{goal.name}</CardTitle>
            {goal.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {goal.description}
              </CardDescription>
            )}
          </div>
        </div>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCompleted && !isCancelled && (
                <>
                  <DropdownMenuItem onClick={onAddContribution}>
                    Add Contribution
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    Edit Goal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onPause}>
                    {isPaused ? "Resume" : "Pause"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {Math.min(progress, 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={Math.min(progress, 100)} />
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(goal.currentAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              of {formatCurrency(goal.targetAmount)}
            </p>
          </div>
          {goal.targetDate && daysRemaining !== null && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>
                  {daysRemaining > 0
                    ? `${daysRemaining} days left`
                    : daysRemaining === 0
                      ? "Due today"
                      : `${Math.abs(daysRemaining)} days overdue`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Milestones */}
        {progress >= 25 && (
          <div className="flex gap-2 flex-wrap">
            {progress >= 25 && (
              <Badge variant={progress >= 25 ? "success" : "outline"}>
                🎯 25%
              </Badge>
            )}
            {progress >= 50 && (
              <Badge variant={progress >= 50 ? "success" : "outline"}>
                🚀 50%
              </Badge>
            )}
            {progress >= 75 && (
              <Badge variant={progress >= 75 ? "success" : "outline"}>
                ⭐ 75%
              </Badge>
            )}
            {progress >= 100 && <Badge variant="success">🏆 Complete!</Badge>}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        <Badge variant={statusVariant[goal.status]}>{goal.status}</Badge>
        <div className="flex items-center gap-2">
          {goal.category && (
            <Badge variant="outline" className="text-xs">
              {goal.category}
            </Badge>
          )}
          <div
            className={cn(
              "size-2 rounded-full",
              priorityColors[goal.priority as keyof typeof priorityColors],
            )}
            title={`Priority: ${goal.priority === 0 ? "Low" : goal.priority === 1 ? "Medium" : "High"}`}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
