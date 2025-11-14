"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DollarSign, Wallet, Settings, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: DollarSign,
  },
  {
    href: "/budgets",
    label: "Budgets",
    icon: Wallet,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-linear-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20 border-r border-neutral-200 dark:border-neutral-800 lg:flex backdrop-blur-xl">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-neutral-200 dark:border-neutral-800 px-6">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 font-semibold text-neutral-900 dark:text-white group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <TrendingUp className="h-7 w-7 text-primary-600 dark:text-primary-400 relative z-10" />
          </div>
          <span className="text-lg bg-linear-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
            FinanceFlow
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-linear-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-500 rounded-lg shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-white"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                  <span>{item.label}</span>
                  {!isActive && (
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 bg-linear-to-r from-primary-500/5 to-transparent transition-opacity duration-200" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
        <div className="rounded-lg bg-linear-to-br from-primary-500 to-primary-600 p-4 text-white shadow-lg">
          <h4 className="text-sm font-semibold mb-1">Need Help?</h4>
          <p className="text-xs text-primary-100 mb-3">Check our documentation</p>
          <Link
            href="/docs"
            className="inline-flex items-center text-xs font-medium hover:underline"
          >
            View Docs →
          </Link>
        </div>
      </div>
    </div>
  );
}
