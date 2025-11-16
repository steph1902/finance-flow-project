import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallbackTitle="Dashboard Error" fallbackMessage="The dashboard encountered an error. Please try again.">
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 lg:ml-64">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
