import type { DailyTrendPoint } from "@/types";

/**
 * Calculate savings rate as a percentage
 */
export function calculateSavingsRate(income: number, expenses: number): string {
  if (income === 0) return "0%";
  const rate = ((income - expenses) / income) * 100;
  return `${Math.max(0, Math.round(rate))}%`;
}

/**
 * Calculate trend percentage between current and previous values
 */
export function calculateTrend(current: number, previous: number): string {
  if (previous === 0) return "+0%";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${Math.round(change)}%`;
}

/**
 * Calculate budget usage percentage
 */
export function calculateBudgetUsage(expenses: number, budget: number): number {
  if (budget === 0) return 0;
  return Math.min(100, Math.round((expenses / budget) * 100));
}

/**
 * Calculate projected savings based on current rate and remaining days
 */
export function calculateProjectedSavings(
  currentIncome: number,
  currentExpenses: number,
  daysElapsed: number,
  totalDaysInMonth: number,
): number {
  if (daysElapsed === 0) return 0;

  const dailyIncome = currentIncome / daysElapsed;
  const dailyExpenses = currentExpenses / daysElapsed;
  const remainingDays = totalDaysInMonth - daysElapsed;

  const projectedTotalIncome = currentIncome + dailyIncome * remainingDays;
  const projectedTotalExpenses =
    currentExpenses + dailyExpenses * remainingDays;

  return Math.max(0, projectedTotalIncome - projectedTotalExpenses);
}

/**
 * Filter data for the last N days
 */
export function filterDataByDays(
  data: DailyTrendPoint[],
  days: number,
): DailyTrendPoint[] {
  if (!data || data.length === 0) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return data.filter((point) => new Date(point.date) >= cutoffDate);
}

/**
 * Sum income/expenses from data points
 */
export function sumFromDataPoints(
  data: DailyTrendPoint[],
  field: "income" | "expenses",
): number {
  return data.reduce((sum, point) => sum + (point[field] || 0), 0);
}

/**
 * Get the number of days elapsed in current month
 */
export function getDaysElapsedInMonth(): number {
  const now = new Date();
  return now.getDate();
}

/**
 * Get total days in current month
 */
export function getTotalDaysInMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
