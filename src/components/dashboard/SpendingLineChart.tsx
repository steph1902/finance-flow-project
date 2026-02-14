"use client";

import { useState, memo } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DailyTrendPoint } from "@/types";
import { motion } from "framer-motion";
import { CHART_COLORS } from "@/config/charts";

type SpendingLineChartProps = {
  data: DailyTrendPoint[];
  isLoading?: boolean;
};

const SpendingLineChartComponent = ({
  data,
  isLoading = false,
}: SpendingLineChartProps) => {
  const [activeChart, setActiveChart] = useState<"line" | "area">("area");

  return (
    <Card className="h-full border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">
              Income vs. Expenses
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Track how your spending compares to income over time
            </CardDescription>
          </div>
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveChart("area")}
              className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
                activeChart === "area"
                  ? "bg-background text-primary shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setActiveChart("line")}
              className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
                activeChart === "line"
                  ? "bg-background text-primary shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="flex h-full flex-col gap-4 p-4">
            {/* Chart area skeleton */}
            <div className="flex-1 flex flex-col justify-end gap-2">
              {/* Bar chart skeleton representation */}
              <div className="flex items-end justify-between gap-2 h-48">
                {[40, 65, 45, 80, 55, 70, 50, 75, 60, 85].map((height, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              {/* X-axis skeleton */}
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Skeleton key={i} className="h-3 flex-1" />
                ))}
              </div>
            </div>
            {/* Legend skeleton */}
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-8 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-8 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <svg
              className="h-16 w-16 mb-4 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p className="text-sm">Not enough data yet</p>
            <p className="text-xs text-neutral-400 mt-1">
              Add more transactions to see trends
            </p>
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
              {activeChart === "area" ? (
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="incomeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS[1]}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS[1]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expensesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS[3]}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS[3]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.2}
                    stroke="#94A3B8"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    stroke="#64748B"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                    stroke="#64748B"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    }
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "14px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2.5}
                    fill="url(#incomeGradient)"
                    name="Income"
                    dot={{ fill: CHART_COLORS[1], r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke={CHART_COLORS[3]}
                    strokeWidth={2.5}
                    fill="url(#expensesGradient)"
                    name="Expenses"
                    dot={{ fill: CHART_COLORS[3], r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.2}
                    stroke="#94A3B8"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    stroke="#64748B"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                    stroke="#64748B"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    }
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "14px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10B981", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    dot={{ fill: "#EF4444", r: 4 }}
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
};

// Memoize to prevent unnecessary re-renders
export const SpendingLineChart = memo(
  SpendingLineChartComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.data.length === nextProps.data.length &&
      JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    );
  },
);

SpendingLineChart.displayName = "SpendingLineChart";
