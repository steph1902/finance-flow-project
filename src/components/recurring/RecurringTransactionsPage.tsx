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
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="h-10 w-80 bg-muted/50 animate-pulse rounded-lg" />
            <div className="h-5 w-64 bg-muted/30 animate-pulse rounded" />
          </div>
          <div className="h-12 w-64 bg-muted/50 animate-pulse rounded-lg" />
        </div>

        {/* Premium Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-border/30 rounded-xl bg-card shadow-card">
              <div className="h-5 w-32 bg-muted/50 animate-pulse rounded mb-4" />
              <div className="h-10 w-28 bg-muted/50 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="h-12 w-full bg-muted/30 animate-pulse rounded-xl" />

        {/* Transaction Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <RecurringTransactionSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50">
              <Repeat className="h-6 w-6 text-primary" />
            </div>
            <h1 className="type-h2 text-foreground">
              Recurring Transactions
            </h1>
          </div>
          <p className="type-body text-muted-foreground max-w-2xl">
            Manage your recurring income and expenses with automated tracking
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          size="lg"
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Recurring Transaction
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="shadow-soft border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="type-body">{error}</AlertDescription>
        </Alert>
      )}

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-border/30 rounded-xl bg-card shadow-card hover:shadow-mist transition-shadow">
          <div className="flex items-center gap-2 type-body text-muted-foreground mb-3">
            <CheckCircle className="h-4 w-4 text-success" />
            Active Recurring
          </div>
          <div className="text-4xl font-bold text-foreground">{activeTransactions.length}</div>
        </div>

        <div className="p-6 border border-green-200 rounded-xl bg-green-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 type-body text-success mb-3">
            <span>Monthly Income</span>
          </div>
          <div className="text-4xl font-bold text-success">
            {formatCurrency(totalMonthlyIncome)}
          </div>
        </div>

        <div className="p-6 border border-red-200 rounded-xl bg-red-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 type-body text-destructive mb-3">
            <span>Monthly Expenses</span>
          </div>
          <div className="text-2xl font-bold text-destructive">
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

        <TabsContent value={selectedTab} className="mt-8">
          {displayedTransactions.length === 0 ? (
            <div className="text-center py-16 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                <Repeat className="h-8 w-8 text-muted-foreground opacity-60" />
              </div>
              <h3 className="type-h3 mb-3">No recurring transactions yet</h3>
              <p className="type-body text-muted-foreground mb-6 max-w-md mx-auto">
                {selectedTab === "all"
                  ? "Create your first recurring transaction to automate your finances"
                  : `No ${selectedTab} recurring transactions`}
              </p>
              {selectedTab === "all" && (
                <Button onClick={() => setIsFormOpen(true)} size="lg" className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Recurring Transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg">
          <DialogHeader className="space-y-3">
            <DialogTitle className="type-h3">Create Recurring Transaction</DialogTitle>
            <DialogDescription className="type-body">
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
