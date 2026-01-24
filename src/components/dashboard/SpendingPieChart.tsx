"use client";

import { useState, memo } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpendingByCategory } from "@/types";
import { motion } from "framer-motion";
import { getChartColor } from "@/config/charts";
import { STAGGER_DELAY } from "@/config/animations";

type SpendingPieChartProps = {
  data: SpendingByCategory[];
  isLoading?: boolean;
};

const SpendingPieChartComponent = ({ data, isLoading = false }: SpendingPieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Generate accessible description for screen readers
  const chartDescription = data.length > 0
    ? `Spending distribution across ${data.length} categories. ${data.slice(0, 3).map(item => `${item.category}: $${item.amount.toLocaleString()}`).join(", ")}`
    : "No spending data available";

  return (
    <Card className="h-full border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">Spending by Category</CardTitle>
        <CardDescription className="text-muted-foreground">
          Distribution of expenses for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            {/* Circular skeleton for pie chart */}
            <div className="relative h-48 w-48">
              <Skeleton className="h-full w-full rounded-full" />
              <div className="absolute inset-8">
                <Skeleton className="h-full w-full rounded-full bg-background" />
              </div>
            </div>
            {/* Legend skeleton */}
            <div className="w-full max-w-xs space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <svg className="h-16 w-16 mb-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium">No expense data yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add transactions to see spending breakdown</p>
          </div>
        ) : (
          <>
            {/* Accessible chart with ARIA label */}
            <div role="img" aria-label={chartDescription}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={3}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={getChartColor(index)}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                        style={{
                          cursor: 'pointer',
                          transition: 'opacity 0.2s ease',
                          filter: activeIndex === index ? 'brightness(1.1)' : 'none'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible data table alternative (visually hidden) */}
            <table className="sr-only" aria-label="Spending by category data table">
              <caption>Detailed spending breakdown by category</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const percentage = total === 0 ? 0 : Math.round((item.amount / total) * 100);
                  return (
                    <tr key={item.category}>
                      <th scope="row">{item.category}</th>
                      <td>${item.amount.toLocaleString()}</td>
                      <td>{percentage}%</td>
                    </tr>
                  );
                })}
                <tr>
                  <th scope="row">Total</th>
                  <td>${total.toLocaleString()}</td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {data.map((item, index) => {
                const percentage = total === 0 ? 0 : Math.round((item.amount / total) * 100);
                const isActive = activeIndex === index;

                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * STAGGER_DELAY.medium }}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isActive ? 'bg-primary-50' : 'hover:bg-neutral-50'
                      }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: getChartColor(index) }}
                      aria-hidden
                    />
                    <span className="flex-1 text-sm text-neutral-700 font-medium">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      ${item.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500 min-w-12 text-right">
                      {percentage}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Memoize to prevent unnecessary re-renders when parent state changes
export const SpendingPieChart = memo(SpendingPieChartComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if data or loading state actually changed
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.data.length === nextProps.data.length &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});

SpendingPieChart.displayName = 'SpendingPieChart';

