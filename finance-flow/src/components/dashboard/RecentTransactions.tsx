"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { RecentTransaction } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { STAGGER_DELAY } from "@/config/animations";

type RecentTransactionsProps = {
  transactions: RecentTransaction[];
  isLoading?: boolean;
};

export function RecentTransactions({ transactions, isLoading = false }: RecentTransactionsProps) {
  return (
    <Card className="h-full border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Latest transactions across all accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
            <svg className="h-12 w-12 mb-3 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No recent transactions yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add a transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * STAGGER_DELAY.medium, duration: 0.3 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group cursor-pointer active:scale-[0.98]"
              >
                <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${
                  transaction.type === "INCOME"
                    ? "bg-success/10"
                    : "bg-destructive/10"
                }`}>
                  {transaction.type === "INCOME" ? (
                    <ArrowUpCircle className="h-5 w-5 text-success" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {transaction.description ?? transaction.category}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-muted font-medium">
                      {transaction.category}
                    </span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className={`text-sm font-semibold tabular-nums ${
                  transaction.type === "INCOME"
                    ? "text-success"
                    : "text-destructive"
                }`}>
                  {transaction.type === "EXPENSE" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

