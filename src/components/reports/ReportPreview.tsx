"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  FileTextIcon,
  CalendarIcon,
  TrendingUpIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportData {
  id: string;
  type: string;
  title: string;
  generatedAt: string;
  dateRange: {
    from: string;
    to: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    transactionCount: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  topExpenses?: Array<{
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

interface ReportPreviewProps {
  report: ReportData;
  onDownload?: (format: "pdf" | "csv") => void;
}

const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export function ReportPreview({ report, onDownload }: ReportPreviewProps) {
  const dateRange = `${new Date(report.dateRange.from).toLocaleDateString()} - ${new Date(report.dateRange.to).toLocaleDateString()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileTextIcon className="size-5 text-primary" />
                <CardTitle>{report.title}</CardTitle>
              </div>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-3" />
                  {dateRange}
                </span>
                <Badge variant="outline">{report.type}</Badge>
              </CardDescription>
            </div>
            {onDownload && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload("pdf")}
                >
                  <DownloadIcon className="size-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload("csv")}
                >
                  <DownloadIcon className="size-4 mr-2" />
                  CSV
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(report.summary.totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(report.summary.totalExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Savings</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${report.summary.netSavings >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(report.summary.netSavings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {report.summary.transactionCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Breakdown - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) =>
                    `${entry.name} (${Math.round((entry.percent || 0) * 100)}%)`
                  }
                >
                  {report.categoryBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 font-medium">
                    Transactions
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.categoryBreakdown.map((category) => (
                  <tr
                    key={category.category}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">{category.category}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(category.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">{category.count}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="outline">{category.percentage}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Expenses */}
      {report.topExpenses && report.topExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUpIcon className="size-5" />
              Top Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.topExpenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
