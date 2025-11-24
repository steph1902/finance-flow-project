"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthNavbarProps {
  currentPage: "login" | "signup";
}

export default function AuthNavbar({ currentPage }: AuthNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm transition-all duration-medium group-hover:shadow-md group-hover:scale-105">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              FinanceFlow
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {currentPage === "login" ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Don&apos;t have an account?</span>
                <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Already have an account?</span>
                <Button variant="ghost" asChild className="hover:bg-accent">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
