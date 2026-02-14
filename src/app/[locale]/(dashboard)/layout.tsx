import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Dashboard Error"
      fallbackMessage="The dashboard encountered an error. Please try again."
    >
      <div className="flex min-h-screen flex-col">
        {/* Desktop Header - Hidden on mobile since Sidebar has mobile header */}
        <div className="hidden lg:block">
          <Header />
        </div>
        <div className="flex flex-1">
          <Sidebar />
          {/* Main content with proper mobile spacing (account for 60px mobile header) */}
          <main className="flex-1 p-4 md:p-6 lg:ml-64 pt-[76px] lg:pt-4">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
