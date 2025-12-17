/**
 * Dashboard Screen
 * Financial overview with balance, recent transactions, and budget progress
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, LoadingSpinner, ErrorView } from '@/components/ui';
import { financeApi } from '@/services/api';
import { getCategoryIcon } from '@/services/mockData';
import { getErrorMessage } from '@/utils/errorHandler';
import type { FinancialSummary, Transaction, BudgetProgress } from '@/types';
import type { DashboardScreenProps } from '@/types/navigation';

export default function DashboardScreen({ navigation }: DashboardScreenProps): React.JSX.Element {
    const [summary, setSummary] = useState<FinancialSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (showLoading = true): Promise<void> => {
        try {
            if (showLoading) setIsLoading(true);
            setError(null);

            const data = await financeApi.getFinancialSummary();
            setSummary(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = useCallback((): void => {
        setIsRefreshing(true);
        fetchData(false);
    }, [fetchData]);

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading your finances..." />;
    }

    if (error) {
        return (
            <ErrorView
                fullScreen
                message={error}
                onRetry={() => fetchData()}
            />
        );
    }

    if (!summary) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView
                className="flex-1"
                contentContainerClassName="pb-6"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#3b82f6"
                    />
                }
            >
                {/* Header */}
                <View className="px-5 pt-4 pb-2">
                    <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
                    <Text className="text-gray-500 mt-1">Your financial overview</Text>
                </View>

                {/* Balance Card */}
                <View className="px-5 mt-4">
                    <Card variant="elevated" padding="lg">
                        <Text className="text-gray-500 text-sm mb-1">Total Balance</Text>
                        <Text className="text-4xl font-bold text-gray-900">
                            ${summary.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Text>

                        {/* Income/Expense Summary */}
                        <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                            <View className="flex-1">
                                <Text className="text-gray-500 text-xs">Income</Text>
                                <Text className="text-green-600 font-semibold text-lg">
                                    +${summary.monthlyIncome.toLocaleString()}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 text-xs">Expenses</Text>
                                <Text className="text-red-500 font-semibold text-lg">
                                    -${summary.monthlyExpenses.toLocaleString()}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 text-xs">Savings Rate</Text>
                                <Text className="text-blue-600 font-semibold text-lg">
                                    {summary.savingsRate}%
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Budget Progress */}
                <View className="px-5 mt-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Budget Progress</Text>
                    <Card variant="elevated" padding="md">
                        {summary.budgetProgress.map((budget, index) => (
                            <BudgetProgressItem
                                key={budget.category}
                                budget={budget}
                                isLast={index === summary.budgetProgress.length - 1}
                            />
                        ))}
                    </Card>
                </View>

                {/* Recent Transactions */}
                <View className="px-5 mt-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-semibold text-gray-900">Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                            <Text className="text-blue-600 font-medium">See All</Text>
                        </TouchableOpacity>
                    </View>
                    <Card variant="elevated" padding="none">
                        {summary.recentTransactions.map((transaction, index) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                isLast={index === summary.recentTransactions.length - 1}
                            />
                        ))}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ============================================================================
// Sub-components
// ============================================================================

interface BudgetProgressItemProps {
    budget: BudgetProgress;
    isLast: boolean;
}

function BudgetProgressItem({ budget, isLast }: BudgetProgressItemProps): React.JSX.Element {
    const progressColor = budget.percentage >= 90
        ? 'bg-red-500'
        : budget.percentage >= 70
            ? 'bg-yellow-500'
            : 'bg-green-500';

    return (
        <View className={`py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <Text className="text-lg mr-2">{getCategoryIcon(budget.category)}</Text>
                    <Text className="text-gray-900 font-medium capitalize">{budget.category}</Text>
                </View>
                <Text className="text-gray-500 text-sm">
                    ${budget.spent.toFixed(0)} / ${budget.budgeted}
                </Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                    className={`h-full ${progressColor} rounded-full`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
            </View>
        </View>
    );
}

interface TransactionItemProps {
    transaction: Transaction;
    isLast: boolean;
}

function TransactionItem({ transaction, isLast }: TransactionItemProps): React.JSX.Element {
    const isIncome = transaction.type === 'income';
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <View className={`flex-row items-center p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <Text className="text-lg">{getCategoryIcon(transaction.category)}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-gray-900 font-medium" numberOfLines={1}>
                    {transaction.description}
                </Text>
                <Text className="text-gray-500 text-sm">{formattedDate}</Text>
            </View>
            <Text className={`font-semibold ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
            </Text>
        </View>
    );
}
