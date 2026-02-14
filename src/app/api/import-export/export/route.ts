/**
 * Export API Route
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exportTransactionsToCSV } from "@/lib/services/import-export-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/import-export/export
 * Export transactions to CSV
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category");

    const csv = await exportTransactionsToCSV({
      userId: session.user.id,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(category && { categories: [category] }),
    });

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error("Failed to export transactions", error);
    return NextResponse.json(
      { error: "Failed to export transactions" },
      { status: 500 },
    );
  }
}
