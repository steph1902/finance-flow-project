"use client";

import { useState } from "react";
import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";
import { RecurringTransactionForm } from "./RecurringTransactionForm";
import { RecurringTransactionCard } from "./RecurringTransactionCard";
import { RecurringTransactionSkeleton } from "./RecurringTransactionSkeleton";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Repeat, AlertCircle, CheckCircle, Clock, PauseCircle } from "lucide-react";

export function RecurringTransactionsPage() {
  const {
    recurringTransactions,
    isLoading,
    error,
    refresh,
    deleteRecurringTransaction,
    toggleActive,
  } = useRecurringTransactions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  // Filter transactions by status
  const activeTransactions = recurringTransactions.filter((t) => t.isActive);
  const pausedTransactions = recurringTransactions.filter((t) => !t.isActive);
  const upcomingTransactions = recurringTransactions.filter((t) => {
    const daysUntilNext = Math.ceil(
      (t.nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return t.isActive && daysUntilNext >= 0 && daysUntilNext <= 7;
  });
  const overdueTransactions = recurringTransactions.filter((t) => {
    return t.isActive && t.nextDate <= new Date();
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refresh();
  };

  const getTransactionsForTab = () => {
    switch (selectedTab) {
      case "active":
        return activeTransactions;
      case "paused":
        return pausedTransactions;
      case "upcoming":
        return upcomingTransactions;
      case "overdue":
        return overdueTransactions;
      default:
        return recurringTransactions;
    }
  };

  const displayedTransactions = getTransactionsForTab();

  // Calculate stats
  const totalMonthlyIncome = recurringTransactions
    .filter((t) => t.type === "INCOME" && t.isActive)
    .reduce((sum, t) => {
      let monthlyAmount = t.amount;
      switch (t.frequency) {
        case "DAILY":
          monthlyAmount = t.amount * 30;
          break;
        case "WEEKLY":
          monthlyAmount = t.amount * 4;
          break;
        case "BIWEEKLY":
          monthlyAmount = t.amount * 2;
          break;
        case "QUARTERLY":
          monthlyAmount = t.amount / 3;
          break;
        case "YEARLY":
          monthlyAmount = t.amount / 12;
          break;
      }
      return sum + monthlyAmount;
    }, 0);

  const totalMonthlyExpenses = recurringTransactions
    .filter((t) => t.type === "EXPENSE" && t.isActive)
    .reduce((sum, t) => {
      let monthlyAmount = t.amount;
      switch (t.frequency) {
        case "DAILY":
          monthlyAmount = t.amount * 30;
          break;
        case "WEEKLY":
          monthlyAmount = t.amount * 4;
          break;
        case "BIWEEKLY":
          monthlyAmount = t.amount * 2;
          break;
        case "QUARTERLY":
          monthlyAmount = t.amount / 3;
          break;
        case "YEARLY":
          monthlyAmount = t.amount / 12;
          break;
      }
      return sum + monthlyAmount;
    }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-5 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-56 bg-muted animate-pulse rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="h-10 w-full bg-muted animate-pulse rounded" />

        {/* Transaction Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <RecurringTransactionSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Repeat className="h-8 w-8 text-primary" />
            Recurring Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your recurring income and expenses
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          New Recurring Transaction
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <CheckCircle className="h-4 w-4" />
            Active Recurring
          </div>
          <div className="text-2xl font-bold">{activeTransactions.length}</div>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-1">
            <span>Monthly Income</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalMonthlyIncome)}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mb-1">
            <span>Monthly Expenses</span>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalMonthlyExpenses)}
          </div>
        </div>
      </div>

      {/* Tabs and Transactions List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 text-xs opacity-60">({recurringTransactions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <span className="ml-1.5 text-xs opacity-60">({activeTransactions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
            <span className="ml-1.5 text-xs opacity-60">({upcomingTransactions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="overdue">
            <AlertCircle className="h-3 w-3 mr-1" />
            Due
            <span className="ml-1.5 text-xs opacity-60">({overdueTransactions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="paused">
            <PauseCircle className="h-3 w-3 mr-1" />
            Paused
            <span className="ml-1.5 text-xs opacity-60">({pausedTransactions.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {displayedTransactions.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <Repeat className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No recurring transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                {selectedTab === "all"
                  ? "Create your first recurring transaction to get started"
                  : `No ${selectedTab} recurring transactions`}
              </p>
              {selectedTab === "all" && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Recurring Transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {displayedTransactions.map((transaction) => (
                <RecurringTransactionCard
                  key={transaction.id}
                  id={transaction.id}
                  amount={transaction.amount}
                  type={transaction.type}
                  category={transaction.category}
                  {...(transaction.description && { description: transaction.description })}
                  frequency={transaction.frequency}
                  nextDate={transaction.nextDate}
                  isActive={transaction.isActive}
                  {...(transaction.lastGenerated && { lastGenerated: transaction.lastGenerated })}
                  {...(transaction.endDate && { endDate: transaction.endDate })}
                  onToggleActive={toggleActive}
                  onDelete={deleteRecurringTransaction}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Recurring Transaction</DialogTitle>
            <DialogDescription>
              Set up a transaction that repeats automatically on a schedule.
            </DialogDescription>
          </DialogHeader>
          <RecurringTransactionForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
