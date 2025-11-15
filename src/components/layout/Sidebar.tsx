"use client";

import Link from "next/link";
import { TrendingUp, Home, DollarSign, Wallet, Settings, MessageSquare, Repeat, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transactions", icon: DollarSign },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20 lg:flex">
      <div className="flex h-16 items-center border-b border-neutral-200 dark:border-neutral-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" aria-hidden="true"></div>
            <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 relative z-10" aria-hidden="true" />
          </div>
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
            FinanceFlow
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
