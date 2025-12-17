/**
 * ErrorView Component
 * Error state display with retry functionality
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface ErrorViewProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    fullScreen?: boolean;
}

export function ErrorView({
    title = 'Something went wrong',
    message,
    onRetry,
    fullScreen = false,
}: ErrorViewProps): React.JSX.Element {
    const content = (
        <>
            {/* Error Icon */}
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
                <Text className="text-3xl">⚠️</Text>
            </View>

            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                {title}
            </Text>

            <Text className="text-gray-600 text-center mb-6 px-4">
                {message}
            </Text>

            {onRetry && (
                <Button
                    title="Try Again"
                    variant="primary"
                    onPress={onRetry}
                />
            )}
        </>
    );

    if (fullScreen) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                {content}
            </View>
        );
    }

    return (
        <View className="items-center py-8 px-6">
            {content}
        </View>
    );
}

export default ErrorView;
