import type { Metadata } from "next";
import "@/app/globals.css";
import AuthProvider from "@/providers/AuthProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { ErrorBoundary, FullPageErrorFallback } from "@/components/errors/ErrorBoundary";
import { fontInter, fontShippori } from "@/lib/fonts";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "FinanceFlow",
  description: "Personal Finance Management Application",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  // Await params Promise (Next.js 15+)
  const resolvedParams = await params;

  // Get locale with fallback to default
  const locale = resolvedParams?.locale && routing.locales.includes(resolvedParams.locale as any)
    ? resolvedParams.locale
    : routing.defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontInter.variable} ${fontShippori.variable} font-sans antialiased`}>
        <ErrorBoundary fallback={<FullPageErrorFallback />}>
          <AuthProvider>
            {children}
            <ToasterProvider />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
