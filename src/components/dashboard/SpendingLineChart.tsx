"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyTrendPoint } from "@/types";
import { motion } from "framer-motion";

type SpendingLineChartProps = {
  data: DailyTrendPoint[];
  isLoading?: boolean;
};

export function SpendingLineChart({ data, isLoading = false }: SpendingLineChartProps) {
  const [activeChart, setActiveChart] = useState<'line' | 'area'>('area');

  return (
    <Card className="h-full border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-neutral-900 dark:text-white">Income vs. Expenses</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Track how your spending compares to income over time
            </CardDescription>
          </div>
          <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveChart('area')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                activeChart === 'area'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setActiveChart('line')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                activeChart === 'line'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-neutral-500">
            <svg className="h-16 w-16 mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-sm">Not enough data yet</p>
            <p className="text-xs text-neutral-400 mt-1">Add more transactions to see trends</p>
          </div>
        ) : (
          <motion.div
            key={activeChart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'area' ? (
                <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    }}
                    stroke="#64748B"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                    stroke="#64748B"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '14px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={2.5} 
                    fill="url(#incomeGradient)" 
                    name="Income"
                    dot={{ fill: '#10B981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={2.5} 
                    fill="url(#expensesGradient)" 
                    name="Expenses"
                    dot={{ fill: '#EF4444', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    }}
                    stroke="#64748B"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                    stroke="#64748B"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '14px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#10B981', r: 4 }} 
                    activeDot={{ r: 6 }}
                    name="Income" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#EF4444', r: 4 }} 
                    activeDot={{ r: 6 }}
                    name="Expenses" 
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

