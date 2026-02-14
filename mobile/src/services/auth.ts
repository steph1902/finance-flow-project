/**
 * Authentication Service
 * Handles login, logout, and token management with secure storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import type { User, AuthTokens, LoginCredentials } from "@/types";
import { StorageKeys, env } from "@/config/env";

interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

interface StoredAuth {
  user: User;
  tokens: AuthTokens;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

class AuthService {
  /**
   * Login with email and password
   * Calls the real backend API
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // Validate credentials format
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error("Please enter a valid email address");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    try {
      // Call real API endpoint
      const response = await axios.post<LoginResponse>(
        `${env.apiUrl}/auth/signin`,
        credentials,
      );

      const { user, accessToken, refreshToken, expiresIn } = response.data;

      // Parse expires in to calculate expiration timestamp
      const expiresInMs = this.parseExpiresIn(expiresIn);

      const result: AuthResult = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresInMs,
        },
      };

      // Store auth data
      await this.storeAuth(result);

      return result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Invalid credentials";
        throw new Error(message);
      }
      throw new Error("Network error. Please check your connection.");
    }
  }

  /**
   * Parse expires in string to milliseconds
   */
  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([hmd])$/);
    if (!match) {
      return 60 * 60 * 1000; // Default 1 hour
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      case "m":
        return value * 60 * 1000;
      default:
        return 60 * 60 * 1000;
    }
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
      console.error("Error during logout:", error);
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

      const tokens = tokensJson[1]
        ? (JSON.parse(tokensJson[1]) as AuthTokens)
        : null;
      const user = userJson[1] ? (JSON.parse(userJson[1]) as User) : null;

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
}

export const authService = new AuthService();
export default authService;
