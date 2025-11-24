"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Settings, HelpCircle, Search, TrendingUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    <header className="sticky top-0 flex h-16 items-center gap-4 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 md:px-6 lg:ml-64 z-50 shadow-sm transition-colors duration-300">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 lg:hidden hover:bg-accent transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-64 bg-linear-to-br from-background via-muted/30 to-primary/5 dark:from-background dark:via-muted/20 dark:to-primary/10">
          <nav className="grid gap-2 text-base font-medium mt-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-lg font-semibold mb-6 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <TrendingUp className="h-7 w-7 text-primary relative z-10" />
              </div>
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
                    "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
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
              className="rounded-full hover:bg-accent transition-colors duration-200"
              aria-label="Open user menu"
            >
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium text-sm shadow-sm transition-shadow hover:shadow-md">
                D
              </div>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Demo User</p>
                <p className="text-xs leading-none text-muted-foreground">demo@financeflow.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="hover:bg-accent cursor-pointer transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent cursor-pointer transition-colors">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="hover:bg-destructive/10 text-destructive cursor-pointer transition-colors"
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
