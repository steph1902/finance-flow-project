/**
 * Enhanced Export API
 * POST /api/export/generate - Generate export in various formats (JSON, CSV, PDF, Excel)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exportUserData, ExportFormat } from "@/lib/services/export-service";
import { logger } from "@/lib/logger";
import { z } from "zod";

const exportSchema = z.object({
  format: z.enum(["json", "csv", "pdf", "excel"]),
  startDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  includeTransactions: z.boolean().optional(),
  includeBudgets: z.boolean().optional(),
  includeGoals: z.boolean().optional(),
  includeRecurring: z.boolean().optional(),
  includeInvestments: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = exportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 },
      );
    }

    const data = validation.data;
    const exportData = await exportUserData({
      userId: session.user.id,
      format: data.format as ExportFormat,
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.includeTransactions !== undefined && {
        includeTransactions: data.includeTransactions,
      }),
      ...(data.includeBudgets !== undefined && {
        includeBudgets: data.includeBudgets,
      }),
      ...(data.includeGoals !== undefined && {
        includeGoals: data.includeGoals,
      }),
      ...(data.includeRecurring !== undefined && {
        includeRecurring: data.includeRecurring,
      }),
      ...(data.includeInvestments !== undefined && {
        includeInvestments: data.includeInvestments,
      }),
    });

    const filename = `financeflow-export-${new Date().toISOString().split("T")[0]}`;

    // Set appropriate content type and filename
    const contentTypes: Record<ExportFormat, string> = {
      json: "application/json",
      csv: "text/csv",
      pdf: "application/pdf",
      excel:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const extensions: Record<ExportFormat, string> = {
      json: "json",
      csv: "csv",
      pdf: "pdf",
      excel: "xlsx",
    };

    const headers = new Headers();
    headers.set("Content-Type", contentTypes[data.format]);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}.${extensions[data.format]}"`,
    );

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const responseData = Buffer.isBuffer(exportData)
      ? new Uint8Array(exportData)
      : exportData.toString();

    return new NextResponse(responseData, { headers });
  } catch (error) {
    logger.error("Export generation failed", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 },
    );
  }
}
