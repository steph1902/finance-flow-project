"use client";

import { CheckCircle2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  date: string;
  amount: string;
  type: string;
  category: string;
  description?: string;
}

interface ImportPreviewProps {
  transactions: Transaction[];
  maxRows?: number;
}

export function ImportPreview({
  transactions,
  maxRows = 10,
}: ImportPreviewProps) {
  if (transactions.length === 0) return null;

  const displayTransactions = transactions.slice(0, maxRows);
  const hasMore = transactions.length > maxRows;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2Icon className="size-5 text-green-500" />
          <div>
            <CardTitle className="text-green-700">
              Valid Transactions ({transactions.length})
            </CardTitle>
            <CardDescription>
              Preview of transactions to be imported
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Type
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map((tx, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2 px-3 font-mono text-xs">{tx.date}</td>
                  <td className="py-2 px-3 text-right font-mono">
                    ${parseFloat(tx.amount).toFixed(2)}
                  </td>
                  <td className="py-2 px-3">
                    <Badge
                      variant={tx.type === "INCOME" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="py-2 px-3">
                    <Badge variant="outline" className="text-xs">
                      {tx.category}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground max-w-xs truncate">
                    {tx.description || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Showing {maxRows} of {transactions.length} transactions
          </p>
        )}
      </CardContent>
    </Card>
  );
}
