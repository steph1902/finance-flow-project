/**
 * Authentication Service
 * Handles login, logout, and token management with secure storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthTokens, LoginCredentials } from '@/types';
import { StorageKeys } from '@/config/env';
import { mockAuthData } from './mockData';

interface AuthResult {
    user: User;
    tokens: AuthTokens;
}

interface StoredAuth {
    user: User;
    tokens: AuthTokens;
}

class AuthService {
    /**
     * Login with email and password
     * In production, this would call the actual API
     */
    async login(credentials: LoginCredentials): Promise<AuthResult> {
        // Validate credentials format
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        if (!this.isValidEmail(credentials.email)) {
            throw new Error('Please enter a valid email address');
        }

        if (credentials.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Simulate API call delay
        await this.simulateNetworkDelay();

        // For demo: accept any valid-looking credentials
        // In production, this would call the actual backend API
        const result = mockAuthData.getLoginResponse(credentials.email);

        // Store auth data
        await this.storeAuth(result);

        return result;
    }

    /**
     * Logout and clear stored auth data
     */
    async logout(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                StorageKeys.AUTH_TOKENS,
                StorageKeys.USER_DATA,
            ]);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    /**
     * Get stored authentication data
     */
    async getStoredAuth(): Promise<StoredAuth | null> {
        try {
            const [tokensJson, userJson] = await AsyncStorage.multiGet([
                StorageKeys.AUTH_TOKENS,
                StorageKeys.USER_DATA,
            ]);

            const tokens = tokensJson[1] ? JSON.parse(tokensJson[1]) as AuthTokens : null;
            const user = userJson[1] ? JSON.parse(userJson[1]) as User : null;

            if (!tokens || !user) {
                return null;
            }

            // Check if token is expired
            if (tokens.expiresAt < Date.now()) {
                await this.logout();
                return null;
            }

            return { user, tokens };
        } catch {
            return null;
        }
    }

    /**
     * Get the current access token
     */
    async getAccessToken(): Promise<string | null> {
        const auth = await this.getStoredAuth();
        return auth?.tokens.accessToken ?? null;
    }

    /**
     * Store auth data securely
     */
    private async storeAuth(auth: AuthResult): Promise<void> {
        await AsyncStorage.multiSet([
            [StorageKeys.AUTH_TOKENS, JSON.stringify(auth.tokens)],
            [StorageKeys.USER_DATA, JSON.stringify(auth.user)],
        ]);
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simulate network delay for demo purposes
     */
    private simulateNetworkDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 800));
    }
}

export const authService = new AuthService();
export default authService;
