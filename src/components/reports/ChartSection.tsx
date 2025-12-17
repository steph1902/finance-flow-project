"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/formatters"

interface ChartData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

interface ChartSectionProps {
  title: string;
  description?: string;
  type: 'line' | 'area' | 'bar';
  data: ChartData[];
  showIncome?: boolean;
  showExpenses?: boolean;
  showBalance?: boolean;
  height?: number;
}

export function ChartSection({
  title,
  description,
  type,
  data,
  showIncome = true,
  showExpenses = true,
  showBalance = false,
  height = 300,
}: ChartSectionProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            {showIncome && (
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
                name="Income"
              />
            )}
            {showExpenses && (
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444' }}
                name="Expenses"
              />
            )}
            {showBalance && (
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5' }}
                name="Balance"
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            {showIncome && (
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Income"
              />
            )}
            {showExpenses && (
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
                name="Expenses"
              />
            )}
            {showBalance && (
              <Area
                type="monotone"
                dataKey="balance"
                stackId="3"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.6}
                name="Balance"
              />
            )}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            {showIncome && <Bar dataKey="income" fill="#10B981" name="Income" />}
            {showExpenses && <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />}
            {showBalance && <Bar dataKey="balance" fill="#4F46E5" name="Balance" />}
          </BarChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="capitalize">
              {type} Chart
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          {showIncome && (
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500" />
              <span>Income</span>
            </div>
          )}
          {showExpenses && (
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500" />
              <span>Expenses</span>
            </div>
          )}
          {showBalance && (
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary" />
              <span>Balance</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
