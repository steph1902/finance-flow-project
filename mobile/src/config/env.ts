/**
 * Environment Configuration
 * Centralized configuration with platform-aware defaults
 */

import { Platform } from "react-native";

interface Environment {
  apiUrl: string;
  isDevelopment: boolean;
  appName: string;
  version: string;
}

const getApiUrl = (): string => {
  // In development:
  // - Android Emulator uses 10.0.2.2 to access host machine's localhost
  // - iOS Simulator can use localhost directly
  // In production, this should be your actual API URL

  if (__DEV__) {
    return Platform.select({
      android: "http://10.0.2.2:3000/api",
      ios: "http://localhost:3000/api",
      default: "http://localhost:3000/api",
    }) as string;
  }

  // Production URL - replace with actual backend URL
  return "https://api.financeflow.app/api";
};

export const env: Environment = {
  apiUrl: getApiUrl(),
  isDevelopment: __DEV__,
  appName: "FinanceFlow",
  version: "1.0.0",
};

// Storage keys - centralized to avoid typos
export const StorageKeys = {
  AUTH_TOKENS: "@financeflow/auth_tokens",
  USER_DATA: "@financeflow/user_data",
  THEME_PREFERENCE: "@financeflow/theme",
  ONBOARDING_COMPLETE: "@financeflow/onboarding_complete",
} as const;

export default env;
