// src/app/api/health/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/health - Health check endpoint for load testing and monitoring
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
}
