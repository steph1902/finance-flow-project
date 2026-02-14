import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Authentication Error"
      fallbackMessage="There was a problem with the login system. Please refresh and try again."
    >
      <div className="flex min-h-screen items-center justify-center bg-background">
        {children}
      </div>
    </ErrorBoundary>
  );
}
