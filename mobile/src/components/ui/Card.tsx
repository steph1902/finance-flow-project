/**
 * Card Component
 * Container component with consistent styling and shadow support
 */

import React from "react";
import {
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
  Platform,
} from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "md",
  children,
  style,
  ...props
}: CardProps): React.JSX.Element {
  const getVariantClasses = (): string => {
    switch (variant) {
      case "elevated":
        return "bg-white";
      case "outlined":
        return "bg-white border border-gray-200";
      default:
        return "bg-white";
    }
  };

  // Platform-specific shadow styles
  const shadowStyle: ViewStyle =
    variant === "elevated"
      ? (Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
          default: {},
        }) ?? {})
      : {};

  return (
    <View
      className={`
        rounded-2xl
        ${getVariantClasses()}
        ${paddingStyles[padding]}
      `}
      style={[shadowStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export default Card;
