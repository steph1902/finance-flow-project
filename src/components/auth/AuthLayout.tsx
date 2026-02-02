"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

// Lazy load 3D component for better performance
const CoinBackground = dynamic(() => import("@/components/3d/CoinBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[#FDFCF8] to-[#F5F2EB]" />,
});

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FDFCF8]">
      {/* Fullscreen 3D Background */}
      <CoinBackground />

      {/* Floating Form Container - Right Side */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-end px-6 sm:px-8 lg:px-24 xl:px-32">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
