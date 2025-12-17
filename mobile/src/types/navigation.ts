/**
 * Navigation Type Definitions
 * Provides full type safety for React Navigation
 */

import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { Transaction } from './index';

// ============================================================================
// Root Stack (Auth Flow)
// ============================================================================

export type RootStackParamList = {
    Login: undefined;
    Main: NavigatorScreenParams<MainTabParamList>;
    AddTransaction: { editTransaction?: Transaction } | undefined;
    TransactionDetail: { transactionId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

// ============================================================================
// Main Tab Navigator
// ============================================================================

export type MainTabParamList = {
    Dashboard: undefined;
    Transactions: undefined;
    Profile: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

export type MainTabNavigationProp<T extends keyof MainTabParamList> =
    CompositeNavigationProp<
        BottomTabNavigationProp<MainTabParamList, T>,
        RootStackNavigationProp<keyof RootStackParamList>
    >;

// ============================================================================
// Convenience Types for Screens
// ============================================================================

export type LoginScreenProps = RootStackScreenProps<'Login'>;
export type AddTransactionScreenProps = RootStackScreenProps<'AddTransaction'>;
export type TransactionDetailScreenProps = RootStackScreenProps<'TransactionDetail'>;
export type DashboardScreenProps = MainTabScreenProps<'Dashboard'>;
export type TransactionsScreenProps = MainTabScreenProps<'Transactions'>;
export type ProfileScreenProps = MainTabScreenProps<'Profile'>;

// ============================================================================
// Global Navigation Type Declaration
// ============================================================================

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
