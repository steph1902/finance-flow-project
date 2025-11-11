"use client";

import { ReactNode } from "react";

// Temporary: AuthProvider disabled while migrating away from NextAuth v4
// NextAuth v4 is not compatible with Next.js 16
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
