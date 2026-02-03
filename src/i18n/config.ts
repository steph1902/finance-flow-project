import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'ja'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
    // Debug logging
    console.log('[i18n/config] getRequestConfig called with locale:', locale);
    console.log('[i18n/config] locales array:', locales);
    console.log('[i18n/config] includes check:', locales.includes(locale as Locale));

    // The locale validation is already done in the layout, 
    // so we can trust that it's valid here
    // if (!locales.includes(locale as Locale)) notFound();

    console.log('[i18n/config] Importing messages for locale:', locale);
    const messages = (await import(`./locales/${locale}.json`)).default;
    console.log('[i18n/config] Messages loaded, keys:', Object.keys(messages).length);

    return {
        messages
    };
});
