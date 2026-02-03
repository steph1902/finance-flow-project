import { getRequestConfig } from 'next-intl/server';

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

// NOTE: This config is used by next-intl internally
// We also load messages directly in the layout for more control
export default getRequestConfig(async ({ locale }) => {
    // DEFENSIVE: Validate locale and provide fallback
    const validatedLocale = getValidatedLocale(locale);

    try {
        // Import messages with validated locale
        const messages = (await import(`./locales/${validatedLocale}.json`)).default;

        return {
            messages,
            timeZone: 'Asia/Tokyo',
            now: new Date()
        };
    } catch (error) {
        console.error(`[i18n/config] Failed to load messages for locale "${validatedLocale}":`, error);

        // Ultimate fallback: return English messages
        if (validatedLocale !== defaultLocale) {
            const fallbackMessages = (await import(`./locales/${defaultLocale}.json`)).default;
            return {
                messages: fallbackMessages,
                timeZone: 'Asia/Tokyo',
                now: new Date()
            };
        }

        // If even English fails, return empty object to prevent crash
        return {
            messages: {},
            timeZone: 'Asia/Tokyo',
            now: new Date()
        };
    }
});
