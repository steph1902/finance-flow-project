// src/lib/ai/ab-testing/experiment-manager.ts
/**
 * A/B Testing Experiment Manager
 * Manages experiment lifecycle, variant assignment, and result tracking
 */

import { prisma } from "@/lib/prisma";
import { Prisma, AIExperimentResult } from "@prisma/client";
import { calculatePValue } from "./statistics";

export interface ExperimentConfig {
  name: string;
  description?: string;
  controlName?: string;
  variantName?: string;
  controlPrompt: string;
  variantPrompt: string;
  trafficSplit?: number; // % to variant (default 50)
  minSampleSize?: number; // Minimum samples before declaring winner
}

export interface ExperimentResults {
  experimentId: string;
  name: string;
  status: string;

  control: {
    name: string;
    samples: number;
    avgRating: number;
    helpfulRate: number;
    actionRate: number;
    avgResponseTime: number;
  };

  variant: {
    name: string;
    samples: number;
    avgRating: number;
    helpfulRate: number;
    actionRate: number;
    avgResponseTime: number;
  };

  significance: {
    pValue: number;
    isSignificant: boolean; // p < 0.05
    winner: "control" | "variant" | "no_difference" | null;
    confidence: number; // 0-100%
  };

  metrics: {
    ratingImprovement: number; // % improvement
    helpfulImprovement: number;
    actionImprovement: number;
  };
}

// Ensure 1:1 mapping with Prisma
export type ExperimentResultItem = AIExperimentResult;

export class ExperimentManager {
  constructor(private db = prisma) {}

  /**
   * Create a new experiment
   */
  async createExperiment(config: ExperimentConfig): Promise<string> {
    const experiment = await this.db.aIExperiment.create({
      data: {
        name: config.name,
        description: config.description,
        status: "RUNNING",
        controlName: config.controlName || "baseline",
        variantName: config.variantName || "big4",
        controlPrompt: config.controlPrompt,
        variantPrompt: config.variantPrompt,
        trafficSplit: config.trafficSplit || 50,
        minSampleSize: config.minSampleSize || 100,
        startDate: new Date(),
      },
    });

    console.log(
      `✅ Created experiment: ${experiment.name} (ID: ${experiment.id})`,
    );
    return experiment.id;
  }

  /**
   * Assign user to variant (control or variant)
   */
  async assignVariant(
    experimentId: string,
    userId: string,
  ): Promise<"control" | "variant"> {
    const experiment = await this.db.aIExperiment.findUnique({
      where: { id: experimentId },
    });

    if (!experiment || experiment.status !== "RUNNING") {
      throw new Error("Experiment not found or not running");
    }

    // Check if user already assigned
    const existing = await this.db.aIExperimentResult.findFirst({
      where: {
        experimentId,
        userId,
      },
    });

    if (existing) {
      return existing.variant as "control" | "variant";
    }

    // Random assignment based on traffic split
    const random = Math.random() * 100;
    const variant = random < experiment.trafficSplit ? "variant" : "control";

    return variant;
  }

  /**
   * Record experiment result with validation
   */
  async recordResult(
    experimentId: string,
    userId: string,
    variant: "control" | "variant",
    data: {
      requestData: Record<string, unknown>;
      responseData: Record<string, unknown>;
      responseTimeMs: number;
      confidence?: number;
      specificity?: number;
    },
  ): Promise<void> {
    // Validate Experiment Status First
    const experiment = await this.db.aIExperiment.findUnique({
      where: { id: experimentId },
      select: { status: true },
    });

    if (!experiment || experiment.status !== "RUNNING") {
      console.warn(
        `Attempted to record result for non-running experiment: ${experimentId}`,
      );
      return;
    }

    // Validate JSON Compatibility
    // Prisma expects InputJsonValue, which Record<string, unknown> generally satisfies via index signature
    // but explicit validation ensures no circular refs or functions
    try {
      JSON.stringify(data.requestData);
      JSON.stringify(data.responseData);
    } catch (e) {
      throw new Error("Invalid JSON data provided for experiment tracking");
    }

    await this.db.aIExperimentResult.create({
      data: {
        experimentId,
        userId,
        variant,
        requestData: data.requestData as Prisma.InputJsonValue,
        responseData: data.responseData as Prisma.InputJsonValue,
        responseTimeMs: data.responseTimeMs,
        confidence: data.confidence,
        specificity: data.specificity,
      },
    });
  }

  /**
   * Submit user feedback on result
   */
  async submitFeedback(
    resultId: string,
    feedback: {
      userRating?: number;
      wasHelpful?: boolean;
      wasActedUpon?: boolean;
      feedbackText?: string;
    },
  ): Promise<void> {
    await this.db.aIExperimentResult.update({
      where: { id: resultId },
      data: feedback,
    });
  }

  /**
   * Get experiment results with statistical analysis and error handling
   */
  async getResults(experimentId: string): Promise<ExperimentResults> {
    try {
      const experiment = await this.db.aIExperiment.findUnique({
        where: { id: experimentId },
        include: {
          results: true,
        },
      });

      if (!experiment) {
        throw new Error("Experiment not found");
      }

      // Type-safe filtering without 'as unknown'
      const controlResults: ExperimentResultItem[] = experiment.results.filter(
        (r): r is AIExperimentResult => r.variant === "control",
      );

      const variantResults: ExperimentResultItem[] = experiment.results.filter(
        (r): r is AIExperimentResult => r.variant === "variant",
      );

      // Calculate metrics for each group
      const control = this.calculateGroupMetrics(
        controlResults,
        experiment.controlName,
      );
      const variant = this.calculateGroupMetrics(
        variantResults,
        experiment.variantName,
      );

      // Calculate statistical significance
      const significance = this.calculateSignificance(
        controlResults,
        variantResults,
      );

      // Calculate improvements with safe division and rounding
      const calculateImprovement = (a: number, b: number): number => {
        if (b === 0) return 0;
        const improvement = ((a - b) / b) * 100;
        return Number(improvement.toFixed(2));
      };

      const metrics = {
        ratingImprovement: calculateImprovement(
          variant.avgRating,
          control.avgRating,
        ),
        helpfulImprovement: calculateImprovement(
          variant.helpfulRate,
          control.helpfulRate,
        ),
        actionImprovement: calculateImprovement(
          variant.actionRate,
          control.actionRate,
        ),
      };

      return {
        experimentId: experiment.id,
        name: experiment.name,
        status: experiment.status,
        control,
        variant,
        significance,
        metrics,
      };
    } catch (error) {
      console.error(
        `Error calculating experiment results [${experimentId}]:`,
        error,
      );
      throw error; // Re-throw to allow API to handle 500
    }
  }

  /**
   * Declare experiment winner and stop experiment
   */
  async declareWinner(experimentId: string): Promise<void> {
    const results = await this.getResults(experimentId);

    if (!results.significance.isSignificant) {
      throw new Error(
        "Cannot declare winner: results not statistically significant",
      );
    }

    await this.db.aIExperiment.update({
      where: { id: experimentId },
      data: {
        status: "COMPLETED",
        endDate: new Date(),
        winnerVariant: results.significance.winner,
        significance: results.significance.pValue,
      },
    });

    console.log(`🏆 Experiment winner: ${results.significance.winner}`);
  }

  /**
   * Pause experiment
   */
  async pauseExperiment(experimentId: string): Promise<void> {
    await this.db.aIExperiment.update({
      where: { id: experimentId },
      data: { status: "PAUSED" },
    });
  }

  /**
   * Resume experiment
   */
  async resumeExperiment(experimentId: string): Promise<void> {
    await this.db.aIExperiment.update({
      where: { id: experimentId },
      data: { status: "RUNNING" },
    });
  }

  /**
   * Get all experiments
   */
  async listExperiments(status?: string): Promise<any[]> {
    const where = status ? { status } : {};

    return await this.db.aIExperiment.findMany({
      where,
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: { results: true },
        },
      },
    });
  }

  // ========== PRIVATE HELPER METHODS ==========

  private calculateGroupMetrics(results: ExperimentResultItem[], name: string) {
    const samples = results.length;

    if (samples === 0) {
      return {
        name,
        samples: 0,
        avgRating: 0,
        helpfulRate: 0,
        actionRate: 0,
        avgResponseTime: 0,
      };
    }

    // Calculate averages with safe fallbacks
    const ratings = results
      .filter((r) => r.userRating !== null)
      .map((r) => r.userRating!);
    const rawAvgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const helpfulCount = results.filter((r) => r.wasHelpful === true).length;
    const rawHelpfulRate = (helpfulCount / samples) * 100;

    const actionCount = results.filter((r) => r.wasActedUpon === true).length;
    const rawActionRate = (actionCount / samples) * 100;

    const rawAvgResponseTime =
      results.reduce((sum, r) => sum + r.responseTimeMs, 0) / samples;

    // Round to 2 decimals for Executive Precision
    return {
      name,
      samples,
      avgRating: Number(rawAvgRating.toFixed(2)),
      helpfulRate: Number(rawHelpfulRate.toFixed(2)),
      actionRate: Number(rawActionRate.toFixed(2)),
      avgResponseTime: Math.round(rawAvgResponseTime), // Response time is usually integer ms
    };
  }

  private calculateSignificance(
    controlResults: ExperimentResultItem[],
    variantResults: ExperimentResultItem[],
  ) {
    const controlTotal = controlResults.length;
    const variantTotal = variantResults.length;

    // Resilience: Handle zero samples in either group
    if (controlTotal === 0 || variantTotal === 0) {
      return {
        pValue: 1.0, // No difference
        isSignificant: false,
        winner: null,
        confidence: 0,
      };
    }

    const controlActions = controlResults.filter(
      (r) => r.wasActedUpon === true,
    ).length;
    const variantActions = variantResults.filter(
      (r) => r.wasActedUpon === true,
    ).length;

    // Calculate p-value using chi-square test
    const pValue = calculatePValue(
      controlActions,
      controlTotal,
      variantActions,
      variantTotal,
    );

    const isSignificant = pValue < 0.05;

    // Determine winner
    let winner: "control" | "variant" | "no_difference" | null = null;
    if (isSignificant) {
      const controlRate = controlActions / controlTotal;
      const variantRate = variantActions / variantTotal;
      winner = variantRate > controlRate ? "variant" : "control";
    } else {
      winner = "no_difference";
    }

    const confidence = (1 - pValue) * 100;

    return {
      pValue,
      isSignificant,
      winner,
      confidence: Number(confidence.toFixed(2)), // Round confidence
    };
  }
}

// Export singleton
export const experimentManager = new ExperimentManager();
