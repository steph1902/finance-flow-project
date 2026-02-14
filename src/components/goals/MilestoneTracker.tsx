"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2Icon,
  TrophyIcon,
  StarIcon,
  RocketIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface Milestone {
  id: string;
  amount: number;
  description?: string;
  achievedAt?: string;
}

interface MilestoneTrackerProps {
  goalId: string;
  targetAmount: number;
  currentAmount: number;
  milestones?: Milestone[];
}

const DEFAULT_MILESTONES = [
  {
    percentage: 25,
    label: "Great Start!",
    icon: StarIcon,
    color: "text-blue-500",
  },
  {
    percentage: 50,
    label: "Halfway There!",
    icon: RocketIcon,
    color: "text-purple-500",
  },
  {
    percentage: 75,
    label: "Almost Done!",
    icon: TrophyIcon,
    color: "text-orange-500",
  },
  {
    percentage: 100,
    label: "Goal Achieved!",
    icon: CheckCircle2Icon,
    color: "text-green-500",
  },
];

export function MilestoneTracker({
  targetAmount,
  currentAmount,
  milestones = [],
}: MilestoneTrackerProps) {
  const progress = (currentAmount / targetAmount) * 100;

  // Generate milestone data
  const milestoneData = DEFAULT_MILESTONES.map((milestone) => {
    const milestoneAmount = targetAmount * (milestone.percentage / 100);
    const isAchieved = currentAmount >= milestoneAmount;
    const isCurrent = !isAchieved && progress >= milestone.percentage - 25;

    return {
      ...milestone,
      amount: milestoneAmount,
      isAchieved,
      isCurrent,
    };
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-4">
            🏆 Milestones
          </h3>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted">
              <div
                className="bg-primary transition-all duration-500"
                style={{
                  height: `${Math.min(progress, 100)}%`,
                  width: "100%",
                }}
              />
            </div>

            {/* Milestone Items */}
            <div className="space-y-6">
              {milestoneData.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-4 relative transition-opacity ${
                      milestone.isAchieved || milestone.isCurrent
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex items-center justify-center size-12 rounded-full border-2 ${
                        milestone.isAchieved
                          ? "bg-primary border-primary text-primary-foreground"
                          : milestone.isCurrent
                            ? "bg-background border-primary text-primary animate-pulse"
                            : "bg-background border-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{milestone.label}</p>
                        <Badge
                          variant={milestone.isAchieved ? "default" : "outline"}
                          className="ml-2"
                        >
                          {milestone.percentage}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(milestone.amount)}
                        {milestone.isAchieved && (
                          <span className="ml-2 text-green-600 font-medium">
                            ✓ Achieved
                          </span>
                        )}
                        {milestone.isCurrent && !milestone.isAchieved && (
                          <span className="ml-2 text-primary font-medium">
                            → Current Goal
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Milestones */}
          {milestones.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-xs font-semibold text-muted-foreground mb-3">
                Custom Milestones
              </h4>
              <div className="space-y-2">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {milestone.achievedAt ? (
                        <CheckCircle2Icon className="size-4 text-green-500" />
                      ) : (
                        <div className="size-4 rounded-full border-2 border-muted" />
                      )}
                      <span>{milestone.description || "Milestone"}</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(milestone.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
