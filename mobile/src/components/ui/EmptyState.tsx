/**
 * EmptyState Component
 * Placeholder for empty lists and data states
 */

import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "📭",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Text className="text-5xl mb-4">{icon}</Text>

      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </Text>

      <Text className="text-gray-600 text-center mb-6">{message}</Text>

      {actionLabel && onAction && (
        <Button title={actionLabel} variant="primary" onPress={onAction} />
      )}
    </View>
  );
}

export default EmptyState;
