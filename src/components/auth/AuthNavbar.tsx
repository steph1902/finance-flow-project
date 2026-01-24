import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet } from "lucide-react";

interface AuthNavbarProps {
  showSignIn?: boolean;
  showGetStarted?: boolean;
  hideGetStarted?: boolean;
  ctaText?: string;
  currentPage?: "login" | "signup";
}

export default function AuthNavbar({
  showSignIn = true,
  showGetStarted = true,
  hideGetStarted = false,
  ctaText = "Get Started",
}: AuthNavbarProps) {
  const isAuthPage = typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/register');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <Wallet className="h-6 w-6" />
          <span>FinanceFlow</span>
        </Link>

        <nav className="flex items-center gap-3">
          {showSignIn && (
            <Button asChild variant="ghost" className="transition-all hover:shadow-sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          {showGetStarted && !hideGetStarted && (
            <div className="flex gap-2">
              {isAuthPage && (
                <Button asChild variant="ghost" className="transition-all hover:shadow-sm">
                  <Link href="/">Back to home</Link>
                </Button>
              )}

              <Button asChild className="bg-primary hover:bg-primary-600 shadow-sm hover:shadow-md transition-all">
                <Link href="/register">{ctaText}</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
