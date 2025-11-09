"use client";

import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentTransaction } from "@/types";

type RecentTransactionsProps = {
  transactions: RecentTransaction[];
  isLoading?: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function RecentTransactions({ transactions, isLoading = false }: RecentTransactionsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest transactions across all accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No recent transactions yet
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.description ?? transaction.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category} · {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                  </p>
                </div>
                <div className={`text-sm font-semibold ${transaction.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                  {transaction.type === "EXPENSE" ? "-" : "+"}
                  {currencyFormatter.format(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

