"use server";

import { getCurrentUser } from "@/lib/session";
import { DemoDataService } from "@/lib/services/demo-data.service";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message?: string;
  count?: number;
  error?: string;
};

export async function generateTransactionsAction(
  count: number,
): Promise<ActionState> {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        error: "Unauthorized: No active session found.",
      };
    }

    const limit = Math.min(count, 1000);
    const transactions = DemoDataService.generateTransactions(limit, user.id);

    await prisma.transaction.createMany({
      data: transactions,
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/demo-data");

    return {
      success: true,
      count: transactions.length,
      message: `Successfully generated ${transactions.length} demo transactions.`,
    };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
}

export type ExperimentActionState = {
  success: boolean;
  experiment?: { id: string; name: string };
  resultsCount?: number;
  message?: string;
  error?: string;
};

export async function generateExperimentAction(): Promise<ExperimentActionState> {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        error: "Unauthorized: No active session found.",
      };
    }

    // Create experiment
    const experiment = await prisma.aIExperiment.create({
      data: {
        name: "Big 4 vs Baseline Demo",
        description: "Testing Big 4 effectiveness with demo data",

        controlPrompt: "Baseline generic financial advice prompt",
        variantPrompt: "Big 4 structured analysis prompt",
        status: "RUNNING",
        trafficSplit: 50,
        minSampleSize: 100,
        startDate: new Date(),
      },
    });

    // Use Service Layer for Business Logic
    const results = DemoDataService.generateExperimentResults(
      experiment.id,
      user.id,
    );

    // Bulk insert results
    await prisma.aIExperimentResult.createMany({
      data: results,
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/demo-data");
    revalidatePath("/admin/experiments");

    return {
      success: true,
      experiment: {
        id: experiment.id,
        name: experiment.name,
      },
      resultsCount: results.length,
      message: "Demo experiment created with statistical significance",
    };
  } catch (error: any) {
    console.error("Experiment Action Error:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
}

export async function runAggregationAction(): Promise<ActionState> {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        error: "Unauthorized: No active session found.",
      };
    }

    const { qualityTracker } =
      await import("@/lib/ai/monitoring/quality-tracker");
    await qualityTracker.runDailyAggregation();

    revalidatePath("/admin/ai-quality");
    revalidatePath("/admin/demo-data");

    return {
      success: true,
      message: "Daily AI quality aggregation completed successfully.",
    };
  } catch (error: any) {
    console.error("Aggregation Action Error:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
}
