"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  Repeat,
  Calendar,
  Pause,
  Play,
  Trash2,
  Edit,
  Clock,
  TrendingUp,
  TrendingDown,
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
import { logError } from "@/lib/logger";

interface RecurringTransactionCardProps {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  frequency:
    | "DAILY"
    | "WEEKLY"
    | "BIWEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "YEARLY";
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
      logError("Failed to toggle active status", error, { id });
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(id);
    } catch (error) {
      logError("Failed to delete recurring transaction", error, { id });
      setIsDeleting(false);
    }
  };

  const isOverdue = nextDate <= new Date() && isActive;
  const hasEnded = endDate ? endDate < new Date() : false;

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7)
      return `${Math.abs(diffDays)} days ago`;
    return formatDate(date);
  };

  return (
    <Card
      className={`relative transition-all hover:shadow-mist ${!isActive ? "opacity-60" : ""} ${isOverdue ? "border-orange-500/50 shadow-sm shadow-orange-500/20" : "shadow-card"}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <CardTitle className="type-h4 truncate">
                {description || category}
              </CardTitle>
              <Badge
                variant={type === "INCOME" ? "default" : "secondary"}
                className="shrink-0 font-medium"
              >
                {category}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 type-small">
              <Repeat className="h-3.5 w-3.5" />
              {FREQUENCY_LABELS[frequency]}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {type === "INCOME" ? (
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-red-50">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            )}
            <div
              className={`text-2xl font-bold ${type === "INCOME" ? "text-success" : "text-destructive"}`}
            >
              {type === "INCOME" ? "+" : "-"}
              {formatCurrency(amount)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {isActive ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 font-medium"
            >
              <Play className="h-3 w-3 mr-1.5" />
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground border-border/50 font-medium"
            >
              <Pause className="h-3 w-3 mr-1.5" />
              Paused
            </Badge>
          )}

          {isOverdue && (
            <Badge
              variant="outline"
              className="bg-orange-500/10 text-orange-600 border-orange-500/30 font-medium"
            >
              <Clock className="h-3 w-3 mr-1.5" />
              Due
            </Badge>
          )}

          {hasEnded && (
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground border-border/50 font-medium"
            >
              Ended
            </Badge>
          )}
        </div>

        {/* Next Occurrence */}
        <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Next occurrence:</span>
          </div>
          <div
            className={`font-semibold ${isOverdue ? "text-orange-600" : "text-foreground"}`}
          >
            {formatRelativeDate(nextDate)}
          </div>
        </div>

        {/* Last Generated */}
        {lastGenerated && (
          <div className="flex items-center justify-between type-small">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last generated:</span>
            </div>
            <div className="text-muted-foreground font-medium">
              {formatDate(lastGenerated)}
            </div>
          </div>
        )}

        {/* End Date */}
        {endDate && (
          <div className="flex items-center justify-between type-small">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Ends on:</span>
            </div>
            <div className="text-muted-foreground font-medium">
              {formatDate(endDate)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-border/50">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(id)}
              className="flex-1 font-medium transition-all hover:shadow-soft"
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
            className="flex-1 font-medium transition-all hover:shadow-soft"
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
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:shadow-soft"
                aria-label={`Delete recurring transaction: ${description}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl shadow-lg">
              <AlertDialogHeader className="space-y-3">
                <AlertDialogTitle className="type-h3">
                  Delete Recurring Transaction?
                </AlertDialogTitle>
                <AlertDialogDescription className="type-body">
                  This will permanently delete this recurring transaction. Any
                  transactions already created from this pattern will remain in
                  your history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-medium">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium shadow-sm"
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
