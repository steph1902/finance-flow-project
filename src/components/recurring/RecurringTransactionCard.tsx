"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Repeat, 
  Calendar, 
  Pause, 
  Play, 
  Trash2, 
  Edit,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RecurringTransactionCardProps {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  nextDate: Date;
  isActive: boolean;
  lastGenerated?: Date | null;
  endDate?: Date | null;
  onToggleActive: (id: string, isActive: boolean) => Promise<void | boolean>;
  onDelete: (id: string) => Promise<void | boolean>;
  onEdit?: (id: string) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BIWEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

export function RecurringTransactionCard({
  id,
  amount,
  type,
  category,
  description,
  frequency,
  nextDate,
  isActive,
  lastGenerated,
  endDate,
  onToggleActive,
  onDelete,
  onEdit,
}: RecurringTransactionCardProps) {
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = async () => {
    try {
      setIsTogglingActive(true);
      await onToggleActive(id, !isActive);
    } catch (error) {
      console.error("Failed to toggle active status:", error);
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(id);
    } catch (error) {
      console.error("Failed to delete recurring transaction:", error);
      setIsDeleting(false);
    }
  };

  const isOverdue = nextDate <= new Date() && isActive;
  const hasEnded = endDate ? endDate < new Date() : false;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    return formatDate(date);
  };

  return (
    <Card className={`relative ${!isActive ? "opacity-60" : ""} ${isOverdue ? "border-orange-500" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-base truncate">
                {description || category}
              </CardTitle>
              <Badge variant={type === "INCOME" ? "default" : "secondary"} className="shrink-0">
                {category}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Repeat className="h-3 w-3" />
              {FREQUENCY_LABELS[frequency]}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {type === "INCOME" ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <div className={`text-lg font-semibold ${type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
              {type === "INCOME" ? "+" : "-"}{formatCurrency(amount)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {isActive ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400">
              <Play className="h-3 w-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900 dark:text-gray-400">
              <Pause className="h-3 w-3 mr-1" />
              Paused
            </Badge>
          )}

          {isOverdue && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400">
              <Clock className="h-3 w-3 mr-1" />
              Due
            </Badge>
          )}

          {hasEnded && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
              Ended
            </Badge>
          )}
        </div>

        {/* Next Occurrence */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next occurrence:</span>
          </div>
          <div className={`font-medium ${isOverdue ? "text-orange-600" : ""}`}>
            {formatRelativeDate(nextDate)}
          </div>
        </div>

        {/* Last Generated */}
        {lastGenerated && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last generated:</span>
            </div>
            <div className="text-muted-foreground">
              {formatDate(lastGenerated)}
            </div>
          </div>
        )}

        {/* End Date */}
        {endDate && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Ends on:</span>
            </div>
            <div className="text-muted-foreground">
              {formatDate(endDate)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(id)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleActive}
            disabled={isTogglingActive || hasEnded}
            className="flex-1"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                {isTogglingActive ? "Pausing..." : "Pause"}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {isTogglingActive ? "Resuming..." : "Resume"}
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Recurring Transaction?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this recurring transaction. Any transactions already
                  created from this pattern will remain in your history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
