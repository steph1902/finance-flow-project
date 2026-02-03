// Locale configuration - can be imported from anywhere
export const locales = ['en', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Type guard for locale validation
export function isValidLocale(locale: unknown): locale is Locale {
    return typeof locale === 'string' && locales.includes(locale as Locale);
}

// Get validated locale with fallback
export function getValidatedLocale(locale: unknown): Locale {
    if (isValidLocale(locale)) {
        return locale;
    }
    console.warn(`[i18n] Invalid locale received: ${locale}, falling back to ${defaultLocale}`);
    return defaultLocale;
}

// NOTE: We don't use getRequestConfig - we load messages directly in the layout
// This is more reliable with Next.js 15's async params and avoids
// "No locale was returned from getRequestConfig" errors
