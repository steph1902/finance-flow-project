import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:ml-64" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
