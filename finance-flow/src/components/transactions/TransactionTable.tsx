"use client";

import { memo } from "react";
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
import { getStaggerDelay } from "@/config/animations";

/**
 * TransactionTable Component
 * 
 * Displays transactions in a table format with edit/delete actions.
 * 
 * **Performance Note**: This component is optimized for paginated data.
 * It's recommended to pass no more than 50 transactions at a time for optimal
 * animation performance. Use server-side pagination or virtual scrolling for
 * larger datasets.
 * 
 * Current implementation includes:
 * - Stagger animations with max delay cap (0.3s)
 * - Memoization to prevent unnecessary re-renders
 * - Responsive design with mobile support
 */

type TransactionTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

const TransactionTableComponent = ({ transactions, onEdit, onDelete }: TransactionTableProps) => {
  // Performance warning for developers
  if (process.env.NODE_ENV === 'development' && transactions.length > 100) {
    console.warn(
      `TransactionTable: Rendering ${transactions.length} transactions may impact performance. ` +
      `Consider implementing pagination or virtual scrolling for better UX.`
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
            <TableHead className="font-semibold text-foreground">Date</TableHead>
            <TableHead className="font-semibold text-foreground">Category</TableHead>
            <TableHead className="font-semibold text-foreground">Description</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
            <TableHead className="w-[120px] text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <svg className="h-16 w-16 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your filters or add a new transaction</p>
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
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: getStaggerDelay(index), duration: 0.2 }}
                  className="group hover:bg-accent/50 transition-all duration-200 border-b border-border last:border-0 cursor-pointer active:scale-[0.99]"
                >
                  <TableCell className="font-medium text-foreground">
                    {formattedDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full transition-transform group-hover:scale-110 ${
                        transaction.type === "INCOME"
                          ? "bg-success/10"
                          : "bg-destructive/10"
                      }`}>
                        {transaction.type === "INCOME" ? (
                          <ArrowUpCircle className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{transaction.category}</span>
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                          {transaction.type === "INCOME" ? "Income" : "Expense"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-60 truncate text-muted-foreground" title={transaction.description ?? ""}>
                    {transaction.description ?? <span className="text-muted-foreground/50">—</span>}
                  </TableCell>
                  <TableCell className={`text-right font-semibold tabular-nums ${
                    transaction.type === "INCOME"
                      ? "text-success"
                      : "text-destructive"
                  }`}>
                    {transaction.type === "EXPENSE" ? `-${amount}` : `+${amount}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                        aria-label={`Edit transaction: ${transaction.description}`}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit transaction</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95"
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
};

// Memoize to prevent unnecessary re-renders
export const TransactionTable = memo(TransactionTableComponent, (prevProps, nextProps) => {
  // Re-render only if transactions array changes or callbacks change
  return (
    prevProps.transactions.length === nextProps.transactions.length &&
    JSON.stringify(prevProps.transactions) === JSON.stringify(nextProps.transactions) &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
});

TransactionTable.displayName = 'TransactionTable';

