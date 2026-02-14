/**
 * Plaid Sync API
 * POST /api/plaid/sync - Sync transactions from connected banks
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncTransactions } from "@/lib/services/plaid-service";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await syncTransactions(session.user.id);

    return NextResponse.json({
      success: true,
      synced: count,
      message: `Synced ${count} new transactions`,
    });
  } catch (error) {
    logger.error("Failed to sync transactions", error);
    return NextResponse.json(
      { error: "Failed to sync transactions" },
      { status: 500 },
    );
  }
}
