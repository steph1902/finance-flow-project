import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserReports, generateReport } from "@/lib/services/report-service";
import { z } from "zod";
import { logger } from "@/lib/logger";

const createReportSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["MONTHLY", "YEARLY", "CATEGORY", "TAX", "CUSTOM"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  filters: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const reports = await getUserReports(session.user.id, limit);

    return NextResponse.json({ reports });
  } catch (error) {
    logger.error("Failed to fetch reports", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { type, startDate, endDate, filters } = validation.data;

    const report = await generateReport({
      userId: session.user.id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      ...(filters && { filters }),
      format: "JSON",
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    logger.error("Failed to generate report", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
