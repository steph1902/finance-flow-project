"use client";

import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/types";

type TransactionTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                No transactions found for the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const amount = currencyFormatter.format(transaction.amount);
              const formattedDate = format(new Date(transaction.date), "PPP");

              return (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>
                    <span className="font-medium">{transaction.category}</span>
                    <span className="ml-2 rounded-full bg-muted px-2 py-1 text-xs capitalize text-muted-foreground">
                      {transaction.type === "INCOME" ? "Income" : "Expense"}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate" title={transaction.description ?? ""}>
                    {transaction.description ?? "—"}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                    {transaction.type === "EXPENSE" ? `-${amount}` : amount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit transaction</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete transaction</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

