/**
 * Profile Screen
 * User profile display with settings and logout functionality
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import type { ProfileScreenProps } from '@/types/navigation';

export default function ProfileScreen({ }: ProfileScreenProps): React.JSX.Element {
    const { user, logout } = useAuth();

    const handleLogout = (): void => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                },
            ]
        );
    };

    const menuItems: { icon: string; label: string; onPress: () => void }[] = [
        { icon: '👤', label: 'Edit Profile', onPress: () => { } },
        { icon: '🔔', label: 'Notifications', onPress: () => { } },
        { icon: '🔒', label: 'Privacy & Security', onPress: () => { } },
        { icon: '💳', label: 'Connected Accounts', onPress: () => { } },
        { icon: '🎨', label: 'Appearance', onPress: () => { } },
        { icon: '❓', label: 'Help & Support', onPress: () => { } },
        { icon: '📄', label: 'Terms of Service', onPress: () => { } },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView className="flex-1" contentContainerClassName="pb-6">
                {/* Header */}
                <View className="px-5 pt-4 pb-2">
                    <Text className="text-2xl font-bold text-gray-900">Profile</Text>
                </View>

                {/* User Info Card */}
                <View className="px-5 mt-4">
                    <Card variant="elevated" padding="lg">
                        <View className="items-center">
                            {/* Avatar */}
                            <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-3">
                                <Text className="text-3xl">
                                    {user?.name?.charAt(0).toUpperCase() || '👤'}
                                </Text>
                            </View>

                            <Text className="text-xl font-bold text-gray-900">
                                {user?.name || 'User'}
                            </Text>
                            <Text className="text-gray-500 mt-1">
                                {user?.email || 'user@example.com'}
                            </Text>

                            {/* Stats */}
                            <View className="flex-row mt-5 pt-5 border-t border-gray-100 w-full">
                                <View className="flex-1 items-center">
                                    <Text className="text-2xl font-bold text-gray-900">12</Text>
                                    <Text className="text-gray-500 text-xs mt-1">Months Active</Text>
                                </View>
                                <View className="flex-1 items-center border-x border-gray-100">
                                    <Text className="text-2xl font-bold text-gray-900">156</Text>
                                    <Text className="text-gray-500 text-xs mt-1">Transactions</Text>
                                </View>
                                <View className="flex-1 items-center">
                                    <Text className="text-2xl font-bold text-green-600">24%</Text>
                                    <Text className="text-gray-500 text-xs mt-1">Avg Savings</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Menu Items */}
                <View className="px-5 mt-6">
                    <Text className="text-sm font-semibold text-gray-500 mb-3 ml-1">SETTINGS</Text>
                    <Card variant="elevated" padding="none">
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                onPress={item.onPress}
                                activeOpacity={0.7}
                            >
                                <Text className="text-lg mr-3">{item.icon}</Text>
                                <Text className="flex-1 text-gray-900 font-medium">{item.label}</Text>
                                <Text className="text-gray-400">›</Text>
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>

                {/* Logout Button */}
                <View className="px-5 mt-6">
                    <Button
                        title="Sign Out"
                        variant="danger"
                        onPress={handleLogout}
                        fullWidth
                    />
                </View>

                {/* Version */}
                <View className="items-center mt-6">
                    <Text className="text-gray-400 text-sm">FinanceFlow v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
