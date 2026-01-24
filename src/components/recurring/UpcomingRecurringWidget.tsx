"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { Repeat, Calendar, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { logError } from "@/lib/logger";

interface RecurringTransactionResponse {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string | null;
  frequency: string;
  nextDate: string;
  isActive: boolean;
}

interface UpcomingRecurring {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  frequency: string;
  nextDate: Date;
}

export function UpcomingRecurringWidget() {
  const [upcomingTransactions, setUpcomingTransactions] = useState<UpcomingRecurring[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingRecurring();
  }, []);

  const fetchUpcomingRecurring = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/recurring-transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch recurring transactions");
      }

      const data = await response.json();

      // Filter for active transactions coming up in the next 7 days
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcoming: UpcomingRecurring[] = data.recurringTransactions
        .filter((t: RecurringTransactionResponse) => {
          const nextDate = new Date(t.nextDate);
          return t.isActive && nextDate <= sevenDaysFromNow;
        })
        .map((t: RecurringTransactionResponse) => ({
          id: t.id,
          amount: parseFloat(t.amount),
          type: t.type,
          category: t.category,
          description: t.description ?? undefined,
          frequency: t.frequency,
          nextDate: new Date(t.nextDate),
        }))
        .sort((a: UpcomingRecurring, b: UpcomingRecurring) => a.nextDate.getTime() - b.nextDate.getTime())
        .slice(0, 5); // Show only the next 5

      setUpcomingTransactions(upcoming);
    } catch (err) {
      logError("Fetch upcoming recurring error", err);
      setError("Failed to load upcoming transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0) return "Overdue";
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Upcoming Recurring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Upcoming Recurring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Upcoming Recurring
          </CardTitle>
          <Link href="/recurring">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
        <CardDescription>Transactions scheduled in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingTransactions.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming recurring transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium truncate">
                      {transaction.description || transaction.category}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {transaction.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeDate(transaction.nextDate)}
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold shrink-0 ml-3 ${transaction.type === "INCOME" ? "text-success" : "text-destructive"
                    }`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
