"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { RecentTransaction } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";

type RecentTransactionsProps = {
  transactions: RecentTransaction[];
  isLoading?: boolean;
};

export function RecentTransactions({ transactions, isLoading = false }: RecentTransactionsProps) {
  return (
    <Card className="h-full border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Latest transactions across all accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-neutral-500">
            <svg className="h-12 w-12 mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No recent transactions yet</p>
            <p className="text-xs text-neutral-400 mt-1">Add a transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
              >
                <div className={`p-2 rounded-full ${
                  transaction.type === "INCOME"
                    ? "bg-success-50 dark:bg-success-950/30"
                    : "bg-danger-50 dark:bg-danger-950/30"
                }`}>
                  {transaction.type === "INCOME" ? (
                    <ArrowUpCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {transaction.description ?? transaction.category}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-medium">
                      {transaction.category}
                    </span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className={`text-sm font-semibold tabular-nums ${
                  transaction.type === "INCOME"
                    ? "text-success-600 dark:text-success-400"
                    : "text-danger-600 dark:text-danger-400"
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

