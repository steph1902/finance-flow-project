import { ReactNode } from "react";
import { AuthBackground } from "./AuthBackground";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream font-sans text-sumi">
      {/* Geometric Background */}
      <AuthBackground />

      {/* Main Container - Centered */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Brand Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-sumi mb-2">
              FinanceFlow
            </h1>
            <div className="h-1 w-12 bg-apricot mx-auto rounded-full"></div>
          </div>

          {/* Content Card (Forms) */}
          <div className="relative">{children}</div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-sumi-500">
            <p>
              &copy; {new Date().getFullYear()} FinanceFlow. Secure & Private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
