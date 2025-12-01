"use client";

import { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    MoreHorizontal,
    Play,
    Plus,
    Search,
    Settings,
    TrendingUp,
    User,
    ArrowRight,
    Wallet,
    Target,
    FileText,
    Sparkles,
    X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/formatters";
import { SpendingLineChart } from "@/components/dashboard/SpendingLineChart";
import { EmptyTransactions } from "@/components/dashboard/EmptyTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
    calculateSavingsRate,
    filterDataByDays,
    sumFromDataPoints,
    calculateBudgetUsage,
    calculateProjectedSavings,
    getDaysElapsedInMonth,
    getTotalDaysInMonth
} from "@/lib/dashboard-utils";

// Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 }
};

export function DashboardOverview() {
    const { data, isLoading } = useDashboard();
    const [showAiTip, setShowAiTip] = useState(true);
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');

    // Filter data based on period
    const filteredData = useMemo(() => {
        if (!data?.dailyTrend || data.dailyTrend.length === 0) {
            // Mock Chart Data if empty
            return [
                { date: "2024-01-01", income: 4000, expenses: 2400 },
                { date: "2024-01-02", income: 3000, expenses: 1398 },
                { date: "2024-01-03", income: 2000, expenses: 9800 },
                { date: "2024-01-04", income: 2780, expenses: 3908 },
                { date: "2024-01-05", income: 1890, expenses: 4800 },
                { date: "2024-01-06", income: 2390, expenses: 3800 },
                { date: "2024-01-07", income: 3490, expenses: 4300 },
            ];
        }
        return period === 'weekly'
            ? filterDataByDays(data.dailyTrend, 7)
            : filterDataByDays(data.dailyTrend, 30);
    }, [data?.dailyTrend, period]);

    // Calculate dynamic stats
    const periodIncome = useMemo(() => sumFromDataPoints(filteredData, 'income'), [filteredData]);
    const periodExpenses = useMemo(() => sumFromDataPoints(filteredData, 'expenses'), [filteredData]);
    const savingsRate = useMemo(() => calculateSavingsRate(periodIncome, periodExpenses), [periodIncome, periodExpenses]);

    // Calculate budget usage (assuming total budget is 1.2x of current expenses)
    const estimatedBudget = (data?.summary.totalExpenses || 0) * 1.2;
    const budgetUsage = useMemo(() => calculateBudgetUsage(data?.summary.totalExpenses || 0, estimatedBudget), [data?.summary.totalExpenses, estimatedBudget]);

    // Calculate projected savings
    const projectedSavings = useMemo(() => {
        const daysElapsed = getDaysElapsedInMonth();
        const totalDays = getTotalDaysInMonth();
        return calculateProjectedSavings(
            data?.summary.totalIncome || 0,
            data?.summary.totalExpenses || 0,
            daysElapsed,
            totalDays
        );
    }, [data?.summary]);

    const stats = useMemo(() => [
        { label: "Transactions", value: data?.summary.transactionCount || 0 },
        { label: "Savings Rate", value: savingsRate },
        { label: "Net Worth", value: formatCurrency(data?.summary.totalBalance || 0) },
    ], [data?.summary, savingsRate]);

    return (
        <motion.div
            className="space-y-12 font-sans text-neutral-800 pb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
                        Welcome back, <span className="font-medium">Demo User</span>
                    </h1>
                    <div className="flex gap-10 mt-8 text-sm font-medium text-neutral-500">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col group cursor-default">
                                <span className="text-neutral-400 text-xs uppercase tracking-wider group-hover:text-neutral-600 transition-colors">{stat.label}</span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl text-neutral-900 group-hover:scale-105 transition-transform origin-left">{stat.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                    <Button asChild variant="outline" className="h-12 px-6 rounded-full border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 gap-2 text-base">
                        <Link href="/budgets">
                            <Wallet className="w-5 h-5" />
                            Add Budget
                        </Link>
                    </Button>
                    <Button asChild className="h-12 px-6 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 gap-2 shadow-lg shadow-neutral-900/20 text-base">
                        <Link href="/transactions">
                            <Plus className="w-5 h-5" />
                            New Transaction
                        </Link>
                    </Button>
                </div>
            </motion.div>

            {/* AI Insight Tip - Dismissible */}
            {showAiTip && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-6 flex items-start gap-5 relative"
                >
                    <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600 mt-1">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-indigo-900 text-base">AI Insight</h4>
                        <p className="text-indigo-700/80 text-base mt-1 leading-relaxed">
                            Your spending on <strong>Dining Out</strong> is 15% higher than last month. Consider setting a stricter budget for next week to stay on track.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAiTip(false)}
                        className="text-indigo-400 hover:text-indigo-600 p-2 hover:bg-indigo-100 rounded-full transition-colors"
                        aria-label="Dismiss AI insight"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">

                {/* Column 1: Profile & Quick Stats (4 cols) */}
                <div className="md:col-span-4 flex flex-col gap-8 h-full">
                    {/* Profile Card */}
                    <motion.div variants={itemVariants} whileHover={hoverScale} className="flex-1">
                        <Link href="/settings">
                            <Card className="h-full bg-gradient-to-br from-[#E8E6E1] to-[#DCD6CC] border-none shadow-soft relative overflow-hidden p-8 flex flex-col justify-end group cursor-pointer rounded-[32px]">
                                <div className="absolute top-8 right-8 z-20">
                                    <div className="bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 text-white">
                                        Pro Member
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-[url('/assets/profile-dashboard.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                                <div className="relative z-10 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                                    <h3 className="text-4xl font-medium tracking-tight mb-1">Demo User</h3>
                                    <p className="text-white/70 text-base font-light">Premium Account</p>
                                    <div className="mt-8 inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-colors">
                                        <span className="text-sm font-medium uppercase tracking-wide text-white/80">Balance</span>
                                        <span className="font-semibold text-xl">{formatCurrency(data?.summary.totalBalance || 0)}</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>

                    {/* Mini Stats Row */}
                    <div className="h-1/3 grid grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} whileHover={hoverScale} className="h-full">
                            <Card className="h-full bg-white border-none shadow-soft p-6 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all rounded-[28px]">
                                {isLoading ? (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-8 w-24 mb-4" />
                                            <Skeleton className="h-2 w-full" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <span className="text-base text-neutral-500 font-medium">Income</span>
                                            <div className="p-2 rounded-full bg-neutral-50 group-hover:bg-yellow-100 transition-colors">
                                                <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-yellow-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-medium tracking-tight text-neutral-900">{formatCurrency(data?.summary.totalIncome || 0)}</div>
                                            <Progress value={65} className="h-2 mt-4 bg-neutral-100" indicatorClassName="bg-yellow-400" />
                                        </div>
                                    </>
                                )}
                            </Card>
                        </motion.div>
                        <motion.div variants={itemVariants} whileHover={hoverScale} className="h-full">
                            <Card className="h-full bg-white border-none shadow-soft p-6 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all rounded-[28px]">
                                {isLoading ? (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <Skeleton className="h-5 w-20" />
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-8 w-24 mb-4" />
                                            <Skeleton className="h-2 w-full" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <span className="text-base text-neutral-500 font-medium">Expenses</span>
                                            <div className="p-2 rounded-full bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                                                <TrendingUp className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-medium tracking-tight text-neutral-900">{formatCurrency(data?.summary.totalExpenses || 0)}</div>
                                            <Progress value={42} className="h-2 mt-4 bg-neutral-100" indicatorClassName="bg-neutral-800" />
                                        </div>
                                    </>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Column 2: Main Content (Expanded to 8 cols) */}
                <div className="md:col-span-8 flex flex-col gap-8 h-full">
                    {/* Time Tracker / Chart */}
                    <motion.div variants={itemVariants} whileHover={hoverScale} className="flex-1">
                        <Card className="h-full bg-white border-none shadow-soft p-8 relative flex flex-col rounded-[32px]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-medium text-xl">Spending Overview</h3>
                                <div className="flex gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPeriod('weekly')}
                                        className={`text-sm px-4 ${period === 'weekly' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                                    >
                                        Weekly
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPeriod('monthly')}
                                        className={`text-sm px-4 ${period === 'monthly' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                                    >
                                        Monthly
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 w-full min-h-0">
                                <SpendingLineChart data={filteredData} isLoading={isLoading} />
                            </div>

                            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-neutral-100">
                                <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-base shadow-inner">
                                    {budgetUsage}%
                                </div>
                                <div>
                                    <div className="text-base font-medium">Budget Usage</div>
                                    <div className="text-sm text-neutral-400">
                                        {budgetUsage < 80 ? 'You are on track' : budgetUsage < 100 ? 'Close to limit' : 'Over budget'}
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-neutral-400">Projected Savings</div>
                                        <div className={`font-medium text-lg ${projectedSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {projectedSavings > 0 ? '+' : ''}{formatCurrency(projectedSavings)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Calendar / Schedule */}
                    <motion.div variants={itemVariants} whileHover={hoverScale} className="h-1/3 grid grid-cols-2 gap-8">
                        <Link href="/recurring">
                            <Card className="h-full bg-[#F5F2EB] border-none shadow-none p-8 flex items-center justify-between group cursor-pointer rounded-[28px]">
                                <div className="flex gap-6 items-center">
                                    <div className="bg-white p-5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-8 h-8 text-neutral-800" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-xl">Upcoming Bills</div>
                                        <div className="text-base text-neutral-500 mt-1">3 payments scheduled</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link href="/goals">
                            <Card className="h-full bg-white border-none shadow-soft p-8 flex items-center justify-between group cursor-pointer rounded-[28px]">
                                <div className="flex gap-6 items-center">
                                    <div className="bg-indigo-50 p-5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <Target className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-xl">Goals</div>
                                        <div className="text-base text-neutral-500 mt-1">2 goals on track</div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                </div>

            </div>

            {/* Full Width Recent Activity Table */}
            <motion.div variants={itemVariants} className="pt-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-light tracking-tight">Recent Transactions</h3>
                    <Link href="/transactions">
                        <Button variant="ghost" className="hover:bg-neutral-100 text-base px-6 h-12">View All</Button>
                    </Link>
                </div>

                <Card className="bg-white border-none shadow-soft overflow-hidden rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                                <tr>
                                    <th scope="col" className="px-8 py-5 text-base font-normal">Transaction</th>
                                    <th scope="col" className="px-8 py-5 text-base font-normal">Category</th>
                                    <th scope="col" className="px-8 py-5 text-base font-normal">Date</th>
                                    <th scope="col" className="px-8 py-5 text-right text-base font-normal">Amount</th>
                                    <th scope="col" className="px-8 py-5 text-center text-base font-normal">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {isLoading ? (
                                    // Loading state
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="w-10 h-10 rounded-full" />
                                                    <Skeleton className="h-5 w-40" />
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                            </td>
                                            <td className="px-8 py-5">
                                                <Skeleton className="h-5 w-24" />
                                            </td>
                                            <td className="px-8 py-5">
                                                <Skeleton className="h-5 w-20 ml-auto" />
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex justify-center">
                                                    <Skeleton className="h-6 w-24 rounded-full" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (data?.recentTransactions || []).length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-0">
                                            <EmptyTransactions />
                                        </td>
                                    </tr>
                                ) : (
                                    (data?.recentTransactions || []).slice(0, 5).map((t, i) => (
                                        <tr key={i} className="group hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                        {t.amount < 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5 rotate-180" />}
                                                    </div>
                                                    <span className="font-medium text-base text-neutral-900">{t.description || "Unknown Transaction"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-base text-neutral-500">
                                                {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className={`px-8 py-5 text-right font-medium text-base ${t.amount > 0 ? 'text-green-600' : 'text-neutral-900'}`}>
                                                {formatCurrency(t.amount)}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    Completed
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
