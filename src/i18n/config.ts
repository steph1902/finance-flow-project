import { getRequestConfig } from 'next-intl/server';

// Locale configuration
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

// Minimal config to satisfy next-intl's requirement
// We don't actually use this - we load messages directly in the layout
// But next-intl requires this file to exist
export default getRequestConfig(async ({ locale }) => {
    // Validate and fallback
    const validLocale = getValidatedLocale(locale);

    // Return minimal config
    // The actual messages are loaded in [locale]/layout.tsx
    return {
        messages: {},
        timeZone: 'Asia/Tokyo',
        now: new Date()
    };
});
