import { ReactNode } from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20 p-4">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Branding - Top Left */}
      <Link 
        href="/" 
        className="fixed top-4 left-4 flex items-center gap-2 group z-50"
        aria-label="Go to home page"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" aria-hidden="true"></div>
          <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 relative z-10" aria-hidden="true" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
          FinanceFlow
        </span>
      </Link>

      {/* Content */}
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
