/**
 * Environment Variable Validation (Runtime-Only)
 *
 * ⚠️ VERCEL BUILD FIX:
 * This module now validates env vars ONLY at runtime, not at build time.
 * This prevents Vercel build failures when env vars are missing during "next build".
 *
 * Variables are lazily evaluated when accessed, not when the module loads.
 * This allows the build to complete even without production env vars.
 */

/**
 * Checks if code is running during Next.js build phase
 */
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Gets a required environment variable (runtime-only validation).
 * During build time, returns empty string to prevent crashes.
 *
 * @param key - The environment variable name
 * @returns The environment variable value
 * @throws Error at runtime if the variable is missing
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];

  // During build: return empty string (prevents build crash)
  if (isBuildTime) {
    return "";
  }

  // Runtime validation: throw if missing
  if (!value || value.trim() === "") {
    throw new Error(
      `❌ RUNTIME ERROR: Missing required environment variable: ${key}\n` +
        `Please set ${key} in your Vercel environment variables.\n` +
        `See .env.example for reference.`,
    );
  }

  return value;
}

/**
 * Gets an optional environment variable with a default value.
 *
 * @param key - The environment variable name
 * @param defaultValue - The default value if not set
 * @returns The environment variable value or default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Environment variables (safe for build-time)
 *
 * ⚠️ IMPORTANT: These values are evaluated lazily via getters.
 * Required vars will only throw errors at RUNTIME, not during build.
 */
export const ENV = {
  // Authentication
  get NEXTAUTH_SECRET() {
    return getRequiredEnv("NEXTAUTH_SECRET");
  },
  get NEXTAUTH_URL() {
    return getOptionalEnv("NEXTAUTH_URL", "http://localhost:3000");
  },

  // Database
  get DATABASE_URL() {
    return getRequiredEnv("DATABASE_URL");
  },

  // AI Services (lazy evaluation prevents build crashes)
  get GEMINI_API_KEY() {
    return getRequiredEnv("GEMINI_API_KEY");
  },
  get AI_MODEL_VERSION() {
    return getOptionalEnv("AI_MODEL_VERSION", "gemini-3-flash-preview");
  },
  get AI_TEMPERATURE() {
    return getOptionalEnv("AI_TEMPERATURE", "0.7");
  },
  get AI_MAX_TOKENS() {
    return getOptionalEnv("AI_MAX_TOKENS", "2048");
  },
  get AI_AUTO_ACCEPT_THRESHOLD() {
    return getOptionalEnv("AI_AUTO_ACCEPT_THRESHOLD", "0");
  },

  // Google Cloud Services (optional)
  get GOOGLE_CLOUD_API_KEY() {
    return getOptionalEnv("GOOGLE_CLOUD_API_KEY", "");
  },

  // OAuth (optional)
  get GOOGLE_CLIENT_ID() {
    return getOptionalEnv("GOOGLE_CLIENT_ID", "");
  },
  get GOOGLE_CLIENT_SECRET() {
    return getOptionalEnv("GOOGLE_CLIENT_SECRET", "");
  },

  // Stripe (optional)
  get STRIPE_SECRET_KEY() {
    return getOptionalEnv("STRIPE_SECRET_KEY", "");
  },
  get STRIPE_PUBLISHABLE_KEY() {
    return getOptionalEnv("STRIPE_PUBLISHABLE_KEY", "");
  },
  get STRIPE_WEBHOOK_SECRET() {
    return getOptionalEnv("STRIPE_WEBHOOK_SECRET", "");
  },
  get STRIPE_PRICE_BASIC() {
    return getOptionalEnv("STRIPE_PRICE_BASIC", "");
  },
  get STRIPE_PRICE_PREMIUM() {
    return getOptionalEnv("STRIPE_PRICE_PREMIUM", "");
  },
  get STRIPE_PRICE_ENTERPRISE() {
    return getOptionalEnv("STRIPE_PRICE_ENTERPRISE", "");
  },

  // Resend (optional)
  get RESEND_API_KEY() {
    return getOptionalEnv("RESEND_API_KEY", "");
  },
  get RESEND_FROM_EMAIL() {
    return getOptionalEnv("RESEND_FROM_EMAIL", "noreply@financeflow.app");
  },

  // Currency API (optional)
  get FIXER_API_KEY() {
    return getOptionalEnv("FIXER_API_KEY", "");
  },

  // Plaid (optional)
  get PLAID_CLIENT_ID() {
    return getOptionalEnv("PLAID_CLIENT_ID", "");
  },
  get PLAID_SECRET() {
    return getOptionalEnv("PLAID_SECRET", "");
  },
  get PLAID_ENV() {
    return getOptionalEnv("PLAID_ENV", "sandbox");
  },

  // Vercel KV / Redis (optional)
  get KV_URL() {
    return getOptionalEnv("KV_URL", "");
  },
  get KV_REST_API_URL() {
    return getOptionalEnv("KV_REST_API_URL", "");
  },
  get KV_REST_API_TOKEN() {
    return getOptionalEnv("KV_REST_API_TOKEN", "");
  },
  get KV_REST_API_READ_ONLY_TOKEN() {
    return getOptionalEnv("KV_REST_API_READ_ONLY_TOKEN", "");
  },

  // Runtime
  get NODE_ENV() {
    return getOptionalEnv("NODE_ENV", "development");
  },
} as const;

/**
 * Type-safe environment variable access
 */
export type Environment = typeof ENV;

/**
 * Safely check if running in production (build-safe)
 */
export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Safely check if running in development (build-safe)
 */
export const isDevelopment = () => process.env.NODE_ENV === "development";

/**
 * Safely check if running in test (build-safe)
 */
export const isTest = () => process.env.NODE_ENV === "test";

/**
 * Utility: Check if a required env var exists (for runtime validation)
 */
export function validateEnvVars(): { valid: boolean; missing: string[] } {
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET", "GEMINI_API_KEY"];

  const missing = required.filter((key) => !process.env[key]);

  return {
    valid: missing.length === 0,
    missing,
  };
}
