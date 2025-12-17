/**
 * App Navigator
 * Complete navigation structure with auth flow and tab navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import {
    LoginScreen,
    DashboardScreen,
    TransactionsScreen,
    ProfileScreen,
    AddTransactionScreen,
} from '@/screens';

import type { RootStackParamList, MainTabParamList } from '@/types/navigation';

// Create navigators with proper typing
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// ============================================================================
// Tab Navigator (Main App)
// ============================================================================

function MainTabNavigator(): React.JSX.Element {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 60,
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={TransactionsScreen}
                options={{
                    tabBarLabel: 'Transactions',
                    tabBarIcon: ({ color }) => <TabIcon icon="💳" color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

// Tab icon component
function TabIcon({ icon }: { icon: string; color: string }): React.JSX.Element {
    return (
        <Text style={{ fontSize: 22 }}>{icon}</Text>
    );
}

// ============================================================================
// Loading Screen
// ============================================================================

function LoadingScreen(): React.JSX.Element {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-4xl mb-4">💰</Text>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-4">Loading FinanceFlow...</Text>
        </View>
    );
}

// ============================================================================
// Root Stack Navigator
// ============================================================================

export default function AppNavigator(): React.JSX.Element {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                        <Stack.Screen
                            name="AddTransaction"
                            component={AddTransactionScreen}
                            options={{
                                headerShown: true,
                                title: 'Add Transaction',
                                presentation: 'modal',
                                headerStyle: { backgroundColor: '#ffffff' },
                                headerTitleStyle: { fontWeight: '600' },
                            }}
                        />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
