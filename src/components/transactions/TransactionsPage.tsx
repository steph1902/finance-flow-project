"use client";

import { useMemo, useState } from "react";

import { TransactionFilters, FilterState } from "@/components/transactions/TransactionFilters";
import { TransactionForm, TransactionFormValues } from "@/components/transactions/TransactionForm";
import { TransactionTable } from "@/components/transactions/TransactionTable";
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

  const handleSubmit = async (values: TransactionFormValues) => {
    setIsSubmitting(true);

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          ...values,
          date: values.date,
        });
        toast({ title: "Transaction updated" });
      } else {
        await createTransaction({
          ...values,
          date: values.date,
        });
        toast({ title: "Transaction created" });
      }
      handleCloseDialog();
    } catch (submitError: any) {
      toast({
        title: "Unable to save transaction",
        description: submitError.message,
        variant: "destructive",
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
      toast({ title: "Transaction deleted" });
    } catch (deleteError: any) {
      toast({
        title: "Unable to delete transaction",
        description: deleteError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">Manage your income and expenses across all categories.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => (!open ? handleCloseDialog() : setIsDialogOpen(true))}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>Add transaction</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? "Edit transaction" : "Add transaction"}</DialogTitle>
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
        <div className="rounded-lg border border-destructive bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load transactions: {error?.message}
        </div>
      ) : null}

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">Loading transactions...</div>
        ) : (
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {meta ? (
        <div className="flex flex-col items-center justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm text-sm md:flex-row">
          <p className="text-muted-foreground">
            Showing page {meta.page} of {meta.totalPages} · {meta.total.toLocaleString()} transactions total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={meta.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
              disabled={meta.page >= meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

