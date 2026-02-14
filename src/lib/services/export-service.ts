/**
 * Enhanced Export Service
 * Supports JSON, CSV, PDF, and Excel exports with custom date ranges
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { write, utils } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";

export type ExportFormat = "json" | "csv" | "pdf" | "excel";

export interface ExportOptions {
  userId: string;
  format: ExportFormat;
  startDate?: Date;
  endDate?: Date;
  includeTransactions?: boolean;
  includeBudgets?: boolean;
  includeGoals?: boolean;
  includeRecurring?: boolean;
  includeInvestments?: boolean;
}

export interface ExportData {
  user: {
    id: string;
    email: string;
    name: string | null;
    preferredCurrency: string;
    createdAt: Date;
  } | null;
  transactions?: Array<{
    date: Date;
    description: string | null;
    category: string;
    type: string;
    amount: number | import("@prisma/client/runtime/library").Decimal;
    notes: string | null;
  }>;
  budgets?: Array<{
    category: string;
    amount: number | import("@prisma/client/runtime/library").Decimal;
    month: number;
    year: number;
  }>;
  goals?: Array<{
    name: string;
    targetAmount: number | import("@prisma/client/runtime/library").Decimal;
    currentAmount: number | import("@prisma/client/runtime/library").Decimal;
    targetDate: Date | null;
    status: string;
  }>;
  recurringTransactions?: Array<{
    description: string | null;
    category: string;
    type: string;
    amount: number | import("@prisma/client/runtime/library").Decimal;
    frequency: string;
    nextDate: Date;
    isActive: boolean;
  }>;
  investments?: Array<{
    symbol: string;
    name: string;
    type: string;
    quantity: number | import("@prisma/client/runtime/library").Decimal;
    costBasis: number | import("@prisma/client/runtime/library").Decimal;
    currentValue: number | import("@prisma/client/runtime/library").Decimal;
    currency: string;
    purchaseDate: Date;
  }>;
}

/**
 * Export user data in specified format
 */
export async function exportUserData(
  options: ExportOptions,
): Promise<Buffer | string> {
  try {
    logger.info("Starting data export", {
      userId: options.userId,
      format: options.format,
    });

    const data = await gatherExportData(options);

    switch (options.format) {
      case "json":
        return JSON.stringify(data, null, 2);

      case "csv":
        return generateCSV(data);

      case "pdf":
        return await generatePDF(data);
      case "excel":
        return generateExcel(data);

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  } catch (error: unknown) {
    logger.error("Data export failed", error);
    throw new Error("Failed to export data");
  }
}

/**
 * Gather all data for export
 */
async function gatherExportData(options: ExportOptions): Promise<ExportData> {
  const { userId, startDate, endDate } = options;
  const data: Partial<ExportData> = {};

  // User info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      preferredCurrency: true,
      createdAt: true,
    },
  });
  data.user = user;

  // Date filter

  const dateFilter: Record<string, Date> = {};
  if (startDate) dateFilter.gte = startDate;
  if (endDate) dateFilter.lte = endDate;

  // Transactions
  if (options.includeTransactions !== false) {
    data.transactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      orderBy: { date: "desc" },
    });
  }

  // Budgets
  if (options.includeBudgets !== false) {
    data.budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // Goals
  if (options.includeGoals !== false) {
    data.goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: true,
        contributions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Recurring transactions
  if (options.includeRecurring !== false) {
    data.recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // Investments (if they exist)
  if (options.includeInvestments !== false) {
    try {
      const investments = await prisma.investment.findMany({
        where: { userId },
        include: {
          transactions: true,
        },
        orderBy: { createdAt: "desc" },
      });
      data.investments = investments;
    } catch {
      // Investment table might not exist yet
      logger.warn("Skipping investments (table not found)");
    }
  }

  return data as ExportData;
}

/**
 * Generate CSV export
 */
function generateCSV(data: ExportData): string {
  let csv = "";

  // Transactions CSV
  if (data.transactions && data.transactions.length > 0) {
    csv += "TRANSACTIONS\n";
    csv += "Date,Description,Category,Type,Amount,Notes\n";

    data.transactions.forEach((txn) => {
      const row = [
        format(new Date(txn.date), "yyyy-MM-dd"),
        escapeCSV(txn.description || ""),
        escapeCSV(txn.category),
        txn.type,
        txn.amount,
        escapeCSV(txn.notes || ""),
      ];
      csv += row.join(",") + "\n";
    });
    csv += "\n";
  }

  // Budgets CSV
  if (data.budgets && data.budgets.length > 0) {
    csv += "BUDGETS\n";
    csv += "Category,Amount,Month,Year\n";

    data.budgets.forEach((budget) => {
      const row = [
        escapeCSV(budget.category),
        budget.amount,
        budget.month,
        budget.year,
      ];
      csv += row.join(",") + "\n";
    });
    csv += "\n";
  }

  // Goals CSV
  if (data.goals && data.goals.length > 0) {
    csv += "GOALS\n";
    csv += "Name,Target Amount,Current Amount,Target Date,Status\n";

    data.goals.forEach((goal) => {
      const row = [
        escapeCSV(goal.name),
        goal.targetAmount,
        goal.currentAmount,
        goal.targetDate ? format(new Date(goal.targetDate), "yyyy-MM-dd") : "",
        goal.status,
      ];
      csv += row.join(",") + "\n";
    });
  }

  return csv;
}

/**
 * Escape CSV special characters
 */
function escapeCSV(str: string): string {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate PDF export
 */
async function generatePDF(data: ExportData): Promise<Buffer> {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.text("FinanceFlow Export Report", 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "PPP")}`, 20, yPos);
  yPos += 5;
  doc.text(`User: ${data.user?.email || "Unknown"}`, 20, yPos);
  yPos += 15;

  // Transactions Table
  if (data.transactions && data.transactions.length > 0) {
    doc.setFontSize(14);
    doc.text("Transactions", 20, yPos);
    yPos += 5;

    const transactionRows = data.transactions.map((txn) => [
      format(new Date(txn.date), "MMM dd, yyyy"),
      txn.description || "",
      txn.category,
      txn.type,
      formatCurrency(Number(txn.amount)),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Date", "Description", "Category", "Type", "Amount"]],
      body: transactionRows,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 },
    });

    interface JsPDFWithAutoTable extends jsPDF {
      lastAutoTable: { finalY: number };
    }
    yPos = (doc as unknown as JsPDFWithAutoTable).lastAutoTable.finalY + 10;
  }

  // Summary Statistics
  if (yPos < 250) {
    doc.setFontSize(14);
    doc.text("Summary", 20, yPos);
    yPos += 7;

    doc.setFontSize(10);

    const income =
      data.transactions
        ?.filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const expenses =
      data.transactions
        ?.filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    doc.text(`Total Income: ${formatCurrency(income)}`, 20, yPos);
    yPos += 6;
    doc.text(`Total Expenses: ${formatCurrency(expenses)}`, 20, yPos);
    yPos += 6;
    doc.text(`Net: ${formatCurrency(income - expenses)}`, 20, yPos);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

/**
 * Generate Excel export
 */
function generateExcel(data: ExportData): Buffer {
  const workbook = utils.book_new();

  // Transactions sheet
  if (data.transactions && data.transactions.length > 0) {
    const transactionData = data.transactions.map((txn) => ({
      Date: format(new Date(txn.date), "yyyy-MM-dd"),
      Description: txn.description || "",
      Category: txn.category,
      Type: txn.type,
      Amount: Number(txn.amount),
      Notes: txn.notes || "",
    }));

    const ws1 = utils.json_to_sheet(transactionData);
    utils.book_append_sheet(workbook, ws1, "Transactions");
  }

  // Budgets sheet
  if (data.budgets && data.budgets.length > 0) {
    const budgetData = data.budgets.map((budget) => ({
      Category: budget.category,
      Amount: Number(budget.amount),
      Month: budget.month,
      Year: budget.year,
    }));

    const ws2 = utils.json_to_sheet(budgetData);
    utils.book_append_sheet(workbook, ws2, "Budgets");
  }

  // Goals sheet
  if (data.goals && data.goals.length > 0) {
    const goalData = data.goals.map((goal) => ({
      Name: goal.name,
      "Target Amount": Number(goal.targetAmount),
      "Current Amount": Number(goal.currentAmount),
      "Target Date": goal.targetDate
        ? format(new Date(goal.targetDate), "yyyy-MM-dd")
        : "",
      Status: goal.status,
    }));

    const ws3 = utils.json_to_sheet(goalData);
    utils.book_append_sheet(workbook, ws3, "Goals");
  }

  // Recurring Transactions sheet
  if (data.recurringTransactions && data.recurringTransactions.length > 0) {
    const recurringData = data.recurringTransactions.map((rec) => ({
      Description: rec.description || "",
      Category: rec.category,
      Type: rec.type,
      Amount: Number(rec.amount),
      Frequency: rec.frequency,
      "Next Date": format(new Date(rec.nextDate), "yyyy-MM-dd"),
      Active: rec.isActive,
    }));

    const ws4 = utils.json_to_sheet(recurringData);
    utils.book_append_sheet(workbook, ws4, "Recurring");
  }

  // Investments sheet
  if (data.investments && data.investments.length > 0) {
    const investmentData = data.investments.map((inv) => ({
      Symbol: inv.symbol,
      Name: inv.name,
      Type: inv.type,
      Quantity: Number(inv.quantity),
      "Cost Basis": Number(inv.costBasis),
      "Current Value": Number(inv.currentValue),
      Currency: inv.currency,
      "Purchase Date": format(new Date(inv.purchaseDate), "yyyy-MM-dd"),
    }));

    const ws5 = utils.json_to_sheet(investmentData);
    utils.book_append_sheet(workbook, ws5, "Investments");
  }

  return write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * Create and store export report
 */
export async function createExportReport(
  userId: string,
  options: Omit<ExportOptions, "userId">,
) {
  try {
    const fullOptions: ExportOptions = { userId, ...options };
    const data = await exportUserData(fullOptions);

    // Store report record
    const report = await prisma.report.create({
      data: {
        userId,
        type: "CUSTOM",
        format:
          options.format.toUpperCase() as import("@prisma/client").ReportFormat,
        name: `Export ${format(new Date(), "yyyy-MM-dd HH:mm")}`,
        startDate: options.startDate || new Date(0),
        endDate: options.endDate || new Date(),
        filters: {
          includeTransactions: options.includeTransactions,
          includeBudgets: options.includeBudgets,
          includeGoals: options.includeGoals,
          includeRecurring: options.includeRecurring,
        },
        data: typeof data === "string" ? JSON.parse(data) : data,
        // In production, upload to storage and store URL
        fileUrl: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    logger.info("Export report created", { userId, reportId: report.id });
    return report;
  } catch (error: unknown) {
    logger.error("Failed to create export report", error);
    throw new Error("Failed to create export report");
  }
}
