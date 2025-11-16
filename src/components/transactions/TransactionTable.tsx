"use client";

import { format } from "date-fns";
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import type { Transaction } from "@/types";
import { motion } from "framer-motion";

type TransactionTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
            <TableHead className="font-semibold text-neutral-900 dark:text-white">Date</TableHead>
            <TableHead className="font-semibold text-neutral-900 dark:text-white">Category</TableHead>
            <TableHead className="font-semibold text-neutral-900 dark:text-white">Description</TableHead>
            <TableHead className="text-right font-semibold text-neutral-900 dark:text-white">Amount</TableHead>
            <TableHead className="w-[120px] text-right font-semibold text-neutral-900 dark:text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-neutral-500">
                  <svg className="h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your filters or add a new transaction</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction, index) => {
              const amount = formatCurrency(transaction.amount);
              const formattedDate = format(new Date(transaction.date), "PPP");

              return (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-200 dark:border-neutral-800 last:border-0"
                >
                  <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">
                    {formattedDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${
                        transaction.type === "INCOME"
                          ? "bg-success-50 dark:bg-success-950/30"
                          : "bg-danger-50 dark:bg-danger-950/30"
                      }`}>
                        {transaction.type === "INCOME" ? (
                          <ArrowUpCircle className="h-4 w-4 text-success-600 dark:text-success-400" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-danger-600 dark:text-danger-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-neutral-900 dark:text-white">{transaction.category}</span>
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {transaction.type === "INCOME" ? "Income" : "Expense"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-60 truncate text-neutral-700 dark:text-neutral-300" title={transaction.description ?? ""}>
                    {transaction.description ?? <span className="text-neutral-400">—</span>}
                  </TableCell>
                  <TableCell className={`text-right font-semibold tabular-nums ${
                    transaction.type === "INCOME"
                      ? "text-success-600 dark:text-success-400"
                      : "text-danger-600 dark:text-danger-400"
                  }`}>
                    {transaction.type === "EXPENSE" ? `-${amount}` : `+${amount}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Edit transaction: ${transaction.description}`}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit transaction</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 hover:bg-danger-50 dark:hover:bg-danger-950/30 hover:text-danger-600 dark:hover:text-danger-400"
                        aria-label={`Delete transaction: ${transaction.description}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete transaction</span>
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

