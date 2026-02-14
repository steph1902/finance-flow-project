/**
 * Transactions Screen
 * Full transaction list with pull-to-refresh and empty state handling
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, LoadingSpinner, ErrorView, EmptyState } from "@/components/ui";
import { financeApi } from "@/services/api";
import { getCategoryIcon } from "@/services/mockData";
import { getErrorMessage } from "@/utils/errorHandler";
import type { Transaction } from "@/types";
import type { TransactionsScreenProps } from "@/types/navigation";

export default function TransactionsScreen({
  navigation,
}: TransactionsScreenProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(
    async (showLoading = true): Promise<void> => {
      try {
        if (showLoading) setIsLoading(true);
        setError(null);

        const data = await financeApi.getTransactions();
        setTransactions(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = useCallback((): void => {
    setIsRefreshing(true);
    fetchTransactions(false);
  }, [fetchTransactions]);

  const handleAddTransaction = useCallback((): void => {
    navigation.navigate("AddTransaction");
  }, [navigation]);

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }): React.JSX.Element => {
      return <TransactionCard transaction={item} />;
    },
    [],
  );

  const keyExtractor = useCallback((item: Transaction): string => item.id, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading transactions..." />;
  }

  if (error) {
    return (
      <ErrorView
        fullScreen
        message={error}
        onRetry={() => fetchTransactions()}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Transactions</Text>
          <Text className="text-gray-500 mt-1">
            {transactions.length} transactions
          </Text>
        </View>
        <TouchableOpacity
          className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center"
          onPress={handleAddTransaction}
          activeOpacity={0.8}
        >
          <Text className="text-white text-2xl font-light">+</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No transactions yet"
            message="Add your first transaction to start tracking your finances"
            actionLabel="Add Transaction"
            onAction={handleAddTransaction}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// Transaction Card Component
// ============================================================================

interface TransactionCardProps {
  transaction: Transaction;
}

function TransactionCard({
  transaction,
}: TransactionCardProps): React.JSX.Element {
  const isIncome = transaction.type === "income";
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Card variant="elevated" padding="md">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
          <Text className="text-xl">
            {getCategoryIcon(transaction.category)}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className="text-gray-900 font-semibold text-base"
            numberOfLines={1}
          >
            {transaction.description}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 text-sm capitalize">
              {transaction.category}
            </Text>
            <Text className="text-gray-300 mx-2">•</Text>
            <Text className="text-gray-500 text-sm">{formattedDate}</Text>
          </View>
          {transaction.merchantName && (
            <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
              {transaction.merchantName}
            </Text>
          )}
        </View>

        <View className="items-end">
          <Text
            className={`font-bold text-lg ${isIncome ? "text-green-600" : "text-gray-900"}`}
          >
            {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
          </Text>
          <View
            className={`mt-1 px-2 py-0.5 rounded-full ${
              isIncome ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isIncome ? "text-green-700" : "text-red-700"
              }`}
            >
              {isIncome ? "Income" : "Expense"}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
