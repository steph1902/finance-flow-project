"use client";

import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Budget } from "@/types";

type BudgetListProps = {
  budgets: Array<Budget & { spent?: number; remaining?: number; progress?: number }>;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export function BudgetList({ budgets, onEdit, onDelete }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No budgets yet</CardTitle>
          <CardDescription>Create a budget to start tracking your spending goals.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {budgets.map((budget) => {
        const spent = budget.spent ?? 0;
        const remaining = budget.remaining ?? Math.max(budget.amount - spent, 0);
        const progress = budget.progress ?? (budget.amount === 0 ? 0 : (spent / budget.amount) * 100);

        const statusColor = progress < 70 ? "text-emerald-600" : progress < 90 ? "text-amber-600" : "text-rose-600";

        return (
          <Card key={budget.id} className="flex flex-col">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{budget.category}</CardTitle>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {new Date(0, budget.month - 1).toLocaleString(undefined, { month: "long" })} {budget.year}
                </span>
              </div>
              <CardDescription>Monthly budget limit</CardDescription>
              <div className="text-2xl font-semibold">{currencyFormatter.format(budget.amount)}</div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className={`font-medium ${statusColor}`}>{currencyFormatter.format(spent)}</span>
              </div>
              <ProgressBar value={progress} />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Remaining</span>
                <span className="font-medium text-foreground">{currencyFormatter.format(remaining)}</span>
              </div>
            </CardContent>

            <CardFooter className="mt-auto flex justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(budget)} aria-label={`Edit budget: ${budget.category}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit budget</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(budget)} aria-label={`Delete budget: ${budget.category}`}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete budget</span>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

