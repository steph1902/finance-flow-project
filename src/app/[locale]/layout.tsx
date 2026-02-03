import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, getValidatedLocale, defaultLocale, type Locale } from '@/i18n/config';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Await params Promise (Next.js 15+)
    const { locale: rawLocale } = await params;

    // DEFENSIVE: Validate locale with proper error handling
    if (!rawLocale) {
        console.error('[LocaleLayout] No locale in params, using default');
        // Redirect to default locale instead of showing error
        return notFound();
    }

    // Validate locale is one of our supported locales
    if (!isValidLocale(rawLocale)) {
        console.error(`[LocaleLayout] Invalid locale "${rawLocale}", returning 404`);
        notFound();
    }

    const locale = rawLocale as Locale;

    try {
        // Import messages directly with validated locale
        const messages = (await import(`@/i18n/locales/${locale}.json`)).default;

        // DEFENSIVE: Verify messages were loaded
        if (!messages || typeof messages !== 'object') {
            console.error(`[LocaleLayout] Invalid messages structure for locale "${locale}"`);
            throw new Error('Invalid messages');
        }

        return (
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
                timeZone="Asia/Tokyo"
            >
                {children}
            </NextIntlClientProvider>
        );
    } catch (error) {
        console.error(`[LocaleLayout] Failed to load messages for locale "${locale}":`, error);

        // Fallback to English if not already English
        if (locale !== defaultLocale) {
            console.warn(`[LocaleLayout] Attempting fallback to ${defaultLocale}`);
            try {
                const fallbackMessages = (await import(`@/i18n/locales/${defaultLocale}.json`)).default;
                return (
                    <NextIntlClientProvider
                        locale={defaultLocale}
                        messages={fallbackMessages}
                        timeZone="Asia/Tokyo"
                    >
                        {children}
                    </NextIntlClientProvider>
                );
            } catch (fallbackError) {
                console.error('[LocaleLayout] Fallback also failed:', fallbackError);
            }
        }

        // Ultimate fallback: return 404
        notFound();
    }
}
