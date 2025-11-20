"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Settings, HelpCircle, Search, TrendingUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-6 lg:ml-64 z-50 shadow-sm">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 lg:hidden hover:bg-primary-50 dark:hover:bg-primary-950/30">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-64 bg-linear-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
          <nav className="grid gap-2 text-base font-medium mt-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-lg font-semibold mb-6 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <TrendingUp className="h-7 w-7 text-primary-600 dark:text-primary-400 relative z-10" />
              </div>
              <span className="bg-linear-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
                FinanceFlow
              </span>
            </Link>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Search Bar - Hidden on small screens */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-primary-50 dark:hover:bg-primary-950/30"
              aria-label="Open user menu"
            >
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm shadow-lg">
                D
              </div>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Demo User</p>
                <p className="text-xs leading-none text-neutral-500">demo@financeflow.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800" />
            <DropdownMenuItem className="hover:bg-primary-50 dark:hover:bg-primary-950/30 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary-50 dark:hover:bg-primary-950/30 cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="hover:bg-danger-50 dark:hover:bg-danger-950/30 text-danger-600 dark:text-danger-400 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
