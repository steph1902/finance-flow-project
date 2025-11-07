import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ToasterProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
