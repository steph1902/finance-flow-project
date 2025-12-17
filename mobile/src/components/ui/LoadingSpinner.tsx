/**
 * LoadingSpinner Component
 * Centralized loading indicator with full-screen and inline variants
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    fullScreen?: boolean;
    message?: string;
}

export function LoadingSpinner({
    size = 'large',
    color = '#3b82f6',
    fullScreen = false,
    message,
}: LoadingSpinnerProps): React.JSX.Element {
    if (fullScreen) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size={size} color={color} />
                {message && (
                    <Text className="text-gray-600 mt-4 text-base">{message}</Text>
                )}
            </View>
        );
    }

    return (
        <View className="items-center justify-center py-8">
            <ActivityIndicator size={size} color={color} />
            {message && (
                <Text className="text-gray-600 mt-3 text-sm">{message}</Text>
            )}
        </View>
    );
}

export default LoadingSpinner;
