import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

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
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) {
        notFound();
    }

    // Import messages directly - this ensures we use the correct locale
    const messages = (await import(`@/i18n/locales/${locale}.json`)).default;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
