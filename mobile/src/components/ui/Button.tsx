/**
 * Button Component
 * Reusable button with variants, loading state, and disabled handling
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string }
> = {
  primary: {
    container: "bg-blue-600 active:bg-blue-700",
    text: "text-white",
  },
  secondary: {
    container: "bg-gray-200 active:bg-gray-300",
    text: "text-gray-800",
  },
  outline: {
    container: "bg-transparent border-2 border-blue-600 active:bg-blue-50",
    text: "text-blue-600",
  },
  danger: {
    container: "bg-red-600 active:bg-red-700",
    text: "text-white",
  },
  ghost: {
    container: "bg-transparent active:bg-gray-100",
    text: "text-blue-600",
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-3 py-2",
    text: "text-sm",
  },
  md: {
    container: "px-5 py-3",
    text: "text-base",
  },
  lg: {
    container: "px-6 py-4",
    text: "text-lg",
  },
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}: ButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      className={`
        flex-row items-center justify-center rounded-xl
        ${variantStyle.container}
        ${sizeStyle.container}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50" : ""}
      `}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={style}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "danger" ? "#fff" : "#3b82f6"
          }
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            className={`
              font-semibold
              ${variantStyle.text}
              ${sizeStyle.text}
              ${leftIcon ? "ml-2" : ""}
              ${rightIcon ? "mr-2" : ""}
            `}
            style={textStyle}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

export default Button;
