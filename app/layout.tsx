import type { Metadata } from "next";
import "@/app/globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";
import { ErrorBoundary, FullPageErrorFallback } from "@/components/errors/ErrorBoundary";
import { fontInter, fontShippori } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "FinanceFlow",
  description: "Personal Finance Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontInter.variable} ${fontShippori.variable} font-sans antialiased`}>
        <ErrorBoundary fallback={<FullPageErrorFallback />}>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <ToasterProvider />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
