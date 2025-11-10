"use client";

import { useState } from "react";

import { BudgetForm, BudgetFormValues } from "@/components/budgets/BudgetForm";
import { BudgetList } from "@/components/budgets/BudgetList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useBudgets } from "@/hooks/useBudgets";
import type { Budget } from "@/types";

const now = new Date();
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const yearOptions = Array.from({ length: 5 }, (_, index) => now.getFullYear() - 2 + index);

export function BudgetsPage() {
  const [filters, setFilters] = useState<{ month?: number; year?: number }>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { budgets, period, isLoading, isError, error, createBudget, updateBudget, deleteBudget } = useBudgets(filters);
  const { toast } = useToast();

  const handleOpen = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (values: BudgetFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, values);
        toast.success("Budget updated");
      } else {
        await createBudget(values);
        toast.success("Budget created");
      }
      handleClose();
    } catch (submitError: any) {
      toast.error("Unable to save budget", {
        description: submitError.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (budget: Budget) => {
    const confirmed = window.confirm("Delete this budget?");
    if (!confirmed) return;

    try {
      await deleteBudget(budget.id);
      toast.success("Budget deleted");
    } catch (deleteError: any) {
      toast.error("Unable to delete budget", {
        description: deleteError.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
          <p className="text-sm text-muted-foreground">Plan your spending and stay on track with monthly budgets.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => (!open ? handleClose() : setIsDialogOpen(true))}>
          <DialogTrigger asChild>
            <Button onClick={handleOpen}>Add budget</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit budget" : "Create budget"}</DialogTitle>
            </DialogHeader>
            <BudgetForm
              budget={editingBudget ?? undefined}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              onDelete={editingBudget ? () => handleDelete(editingBudget) : undefined}
              isSubmitting={isSubmitting}
              submitLabel={editingBudget ? "Update" : "Create"}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Month</Label>
            <Select
              value={String(filters.month ?? "")}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, month: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {new Date(0, month - 1).toLocaleString(undefined, { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Year</Label>
            <Select
              value={String(filters.year ?? "")}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, year: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Total budgets</Label>
            <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
              Track budgets for each expense category to keep spending on target.
            </div>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/5 p-3 text-sm text-destructive">
          Failed to load budgets: {error?.message}
        </div>
      ) : null}

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">Loading budgets...</div>
        ) : (
          <BudgetList budgets={budgets} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      {period ? (
        <p className="text-sm text-muted-foreground">
          Showing budgets for {new Date(period.start).toLocaleString(undefined, { month: "long", year: "numeric" })}
        </p>
      ) : null}
    </div>
  );
}

