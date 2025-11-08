"use client";

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpendingByCategory } from "@/types";

const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#14b8a6", "#facc15"];

type SpendingPieChartProps = {
  data: SpendingByCategory[];
  isLoading?: boolean;
};

export function SpendingPieChart({ data, isLoading = false }: SpendingPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>Distribution of expenses for the selected period</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">No expense data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 grid gap-2 text-sm">
          {data.map((item, index) => {
            const percentage = total === 0 ? 0 : Math.round((item.amount / total) * 100);
            return (
              <div key={item.category} className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  aria-hidden
                />
                <span className="flex-1">{item.category}</span>
                <span className="font-medium">${item.amount.toLocaleString()}</span>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

