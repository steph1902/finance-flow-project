import type { Metadata } from "next";
import "@/app/globals.css";
import AuthProvider from "@/providers/AuthProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { ErrorBoundary, FullPageErrorFallback } from "@/components/errors/ErrorBoundary";
import { fontInter, fontShippori } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "FinanceFlow",
  description: "Personal Finance Management Application",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params Promise (Next.js 15+)
  const { locale } = await params;

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
