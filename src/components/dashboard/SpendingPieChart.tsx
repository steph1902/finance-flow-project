"use client";

import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpendingByCategory } from "@/types";
import { motion } from "framer-motion";

const COLORS = [
  "#3B82F6", // primary-500
  "#10B981", // success-500
  "#F59E0B", // warning-500
  "#EF4444", // danger-500
  "#8B5CF6", // purple-500
  "#14B8A6", // teal-500
  "#F97316", // orange-500
  "#EC4899", // pink-500
];

type SpendingPieChartProps = {
  data: SpendingByCategory[];
  isLoading?: boolean;
};

export function SpendingPieChart({ data, isLoading = false }: SpendingPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="h-full border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white">Spending by Category</CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Distribution of expenses for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-neutral-500">
            <svg className="h-16 w-16 mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">No expense data yet</p>
            <p className="text-xs text-neutral-400 mt-1">Add transactions to see spending breakdown</p>
          </div>
        ) : (
          <>
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
                      fill={COLORS[index % COLORS.length]}
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
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {data.map((item, index) => {
                const percentage = total === 0 ? 0 : Math.round((item.amount / total) * 100);
                const isActive = activeIndex === index;
                
                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      isActive ? 'bg-primary-50 dark:bg-primary-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      aria-hidden
                    />
                    <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      ${item.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 min-w-12 text-right">
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
}

