import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20 p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500 rounded-lg blur-xl opacity-50" aria-hidden="true"></div>
            <TrendingUp className="h-12 w-12 text-primary-600 dark:text-primary-400 relative z-10" aria-hidden="true" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
            FinanceFlow
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Your personal finance management solution. Track your income, expenses, and achieve your financial goals with intelligent insights.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12 mb-8">
          <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <p className="font-semibold text-primary-600 dark:text-primary-400">AI-Powered</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Smart categorization & insights</p>
          </div>
          <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <p className="font-semibold text-primary-600 dark:text-primary-400">Easy Tracking</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Transactions & budgets made simple</p>
          </div>
          <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <p className="font-semibold text-primary-600 dark:text-primary-400">Visual Analytics</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Beautiful charts & reports</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="min-w-[180px] shadow-lg group">
            <Link href="/login" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[180px]">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-8">
          No credit card required • Free to start
        </p>
      </div>
    </div>
  );
}
