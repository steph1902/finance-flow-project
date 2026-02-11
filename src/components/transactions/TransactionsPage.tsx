"use client";

import { useMemo, useState } from "react";

import { TransactionFilters, FilterState } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { ReceiptScanner } from "@/components/transactions/ReceiptScanner";
import { TransactionsSkeleton } from "@/components/skeletons/TransactionsSkeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import type { Transaction } from "@/types";

const defaultFilters: FilterState = {
  type: "ALL",
  category: undefined,
  search: "",
  startDate: undefined,
  endDate: undefined,
};

export function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const queryFilters = useMemo(() => ({
    ...filters,
    page,
    limit: 10,
  }), [filters, page]);

  const { transactions, meta, isLoading, isError, error, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions({ filters: queryFilters });

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };



  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (values: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    description?: string | undefined;
    notes?: string | undefined;
    date: string;
  }) => {
    setIsSubmitting(true);

    try {
      // Convert undefined to null for API compatibility
      const payload = {
        amount: values.amount,
        type: values.type,
        category: values.category,
        description: values.description ?? null,
        notes: values.notes ?? null,
        date: values.date,
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
        toast.success("Transaction updated successfully", {
          description: `${payload.type === "INCOME" ? "Income" : "Expense"} of $${payload.amount.toFixed(2)} in ${payload.category}`,
          duration: 3000,
        });
      } else {
        await createTransaction(payload);
        toast.success("Transaction created successfully", {
          description: `${payload.type === "INCOME" ? "Income" : "Expense"} of $${payload.amount.toFixed(2)} added to ${payload.category}`,
          duration: 3000,
        });
      }
      handleCloseDialog();
    } catch (submitError) {
      toast.error("Unable to save transaction", {
        description: submitError instanceof Error ? submitError.message : "An error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      await deleteTransaction(transaction.id);
      toast.success("Transaction deleted", {
        description: "The transaction has been permanently removed",
        duration: 3000,
      });
    } catch (deleteError) {
      toast.error("Unable to delete transaction", {
        description: deleteError instanceof Error ? deleteError.message : "An error occurred",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="type-h2 text-foreground">Transactions</h1>
          <p className="type-body text-muted-foreground max-w-2xl">
            Manage your income and expenses across all categories.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => (!open ? handleCloseDialog() : handleOpenCreate())}>
          <DialogTrigger asChild>
            <Button className="shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
              Add transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="type-h4">
                {editingTransaction ? "Edit transaction" : "Add transaction"}
              </DialogTitle>
            </DialogHeader>
            <TransactionForm
              transaction={editingTransaction ?? undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              onDelete={editingTransaction ? () => handleDelete(editingTransaction) : undefined}
              isSubmitting={isSubmitting}
              submitLabel={editingTransaction ? "Update" : "Create"}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Receipt Scanner */}
      <ReceiptScanner
        onTransactionCreated={() => {
          // Refresh transactions list
          window.location.reload();
        }}
      />

      <TransactionFilters
        value={filters}
        onChange={(nextFilters) => {
          setFilters(nextFilters);
          setPage(1);
        }}
        onReset={() => {
          setFilters(defaultFilters);
          setPage(1);
        }}
      />

      {isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive shadow-soft">
          <p className="font-medium mb-1">Failed to load transactions</p>
          <p className="text-destructive/80">{error?.message}</p>
        </div>
      ) : null}

      {isLoading ? (
        <TransactionsSkeleton />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card shadow-card overflow-hidden">
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {meta ? (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border/30 bg-card/50 p-6 shadow-soft text-sm md:flex-row">
          <p className="type-body text-muted-foreground">
            Page <span className="font-medium text-foreground">{meta.page}</span> of{" "}
            <span className="font-medium text-foreground">{meta.totalPages}</span> ·{" "}
            <span className="font-medium text-foreground">{meta.total.toLocaleString()}</span> transactions total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={meta.page <= 1}
              className="transition-all hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
              disabled={meta.page >= meta.totalPages}
              className="transition-all hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

