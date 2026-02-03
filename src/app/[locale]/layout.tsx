import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, defaultLocale, type Locale } from '@/i18n/config';

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

    // DEFENSIVE: Validate locale
    if (!rawLocale || !isValidLocale(rawLocale)) {
        console.error(`[LocaleLayout] Invalid locale "${rawLocale}", returning 404`);
        notFound();
    }

    const locale = rawLocale as Locale;

    // DEFENSIVE: Direct import with validated locale (most reliable approach)
    let messages;
    try {
        messages = (await import(`@/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        console.error(`[LocaleLayout] Failed to load ${locale}:`, error);
        // Fallback to English
        if (locale !== defaultLocale) {
            messages = (await import(`@/i18n/locales/${defaultLocale}.json`)).default;
        } else {
            notFound();
        }
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
}
