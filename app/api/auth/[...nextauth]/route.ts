import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// NextAuth v4 compatibility wrapper for Next.js 16
export async function GET(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler(req as any, context as any);
}

export async function POST(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler(req as any, context as any);
}
