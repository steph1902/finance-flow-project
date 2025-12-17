/**
 * Input Component
 * Text input with label, error handling, icon support, and validation states
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    type TextInputProps,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<ViewStyle>;
    secureTextEntry?: boolean;
    showPasswordToggle?: boolean;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    inputStyle,
    secureTextEntry = false,
    showPasswordToggle = false,
    ...props
}: InputProps): React.JSX.Element {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isSecure = secureTextEntry && !isPasswordVisible;
    const hasError = Boolean(error);

    const getBorderColor = (): string => {
        if (hasError) return 'border-red-500';
        if (isFocused) return 'border-blue-500';
        return 'border-gray-300';
    };

    return (
        <View className="mb-4" style={containerStyle}>
            {label && (
                <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
            )}

            <View
                className={`
          flex-row items-center
          bg-white rounded-xl
          border-2 ${getBorderColor()}
          px-4 py-3
        `}
            >
                {leftIcon && <View className="mr-3">{leftIcon}</View>}

                <TextInput
                    className="flex-1 text-base text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={isSecure}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    style={inputStyle}
                    {...props}
                />

                {showPasswordToggle && secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="ml-3 p-1"
                    >
                        <Text className="text-sm text-blue-600 font-medium">
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>
                )}

                {rightIcon && !showPasswordToggle && <View className="ml-3">{rightIcon}</View>}
            </View>

            {error && (
                <Text className="text-sm text-red-500 mt-1.5">{error}</Text>
            )}

            {hint && !error && (
                <Text className="text-sm text-gray-500 mt-1.5">{hint}</Text>
            )}
        </View>
    );
}

export default Input;
