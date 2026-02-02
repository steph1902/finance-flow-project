// src/lib/ai/ab-testing/experiment-manager.ts
/**
 * A/B Testing Experiment Manager
 * Manages experiment lifecycle, variant assignment, and result tracking
 */

import { prisma } from '@/lib/prisma';
import { calculatePValue, calculateConfidenceInterval } from './statistics';

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
        winner: 'control' | 'variant' | 'no_difference' | null;
        confidence: number; // 0-100%
    };

    metrics: {
        ratingImprovement: number; // % improvement
        helpfulImprovement: number;
        actionImprovement: number;
    };
}

export class ExperimentManager {

    /**
     * Create a new experiment
     */
    async createExperiment(config: ExperimentConfig): Promise<string> {
        const experiment = await prisma.aIExperiment.create({
            data: {
                name: config.name,
                description: config.description,
                status: 'RUNNING',
                controlName: config.controlName || 'baseline',
                variantName: config.variantName || 'big4',
                controlPrompt: config.controlPrompt,
                variantPrompt: config.variantPrompt,
                trafficSplit: config.trafficSplit || 50,
                minSampleSize: config.minSampleSize || 100,
                startDate: new Date()
            }
        });

        console.log(`✅ Created experiment: ${experiment.name} (ID: ${experiment.id})`);
        return experiment.id;
    }

    /**
     * Assign user to variant (control or variant)
     */
    async assignVariant(experimentId: string, userId: string): Promise<'control' | 'variant'> {
        const experiment = await prisma.aIExperiment.findUnique({
            where: { id: experimentId }
        });

        if (!experiment || experiment.status !== 'RUNNING') {
            throw new Error('Experiment not found or not running');
        }

        // Check if user already assigned
        const existing = await prisma.aIExperimentResult.findFirst({
            where: {
                experimentId,
                userId
            }
        });

        if (existing) {
            return existing.variant as 'control' | 'variant';
        }

        // Random assignment based on traffic split
        const random = Math.random() * 100;
        const variant = random < experiment.trafficSplit ? 'variant' : 'control';

        return variant;
    }

    /**
     * Record experiment result
     */
    async recordResult(
        experimentId: string,
        userId: string,
        variant: 'control' | 'variant',
        data: {
            requestData: any;
            responseData: any;
            responseTimeMs: number;
            confidence?: number;
            specificity?: number;
        }
    ): Promise<void> {
        await prisma.aIExperimentResult.create({
            data: {
                experimentId,
                userId,
                variant,
                requestData: data.requestData,
                responseData: data.responseData,
                responseTimeMs: data.responseTimeMs,
                confidence: data.confidence,
                specificity: data.specificity
            }
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
        }
    ): Promise<void> {
        await prisma.aIExperimentResult.update({
            where: { id: resultId },
            data: feedback
        });
    }

    /**
     * Get experiment results with statistical analysis
     */
    async getResults(experimentId: string): Promise<ExperimentResults> {
        const experiment = await prisma.aIExperiment.findUnique({
            where: { id: experimentId },
            include: {
                results: true
            }
        });

        if (!experiment) {
            throw new Error('Experiment not found');
        }

        // Separate control and variant results
        const controlResults = experiment.results.filter(r => r.variant === 'control');
        const variantResults = experiment.results.filter(r => r.variant === 'variant');

        // Calculate metrics for each group
        const control = this.calculateGroupMetrics(controlResults, experiment.controlName);
        const variant = this.calculateGroupMetrics(variantResults, experiment.variantName);

        // Calculate statistical significance
        const significance = this.calculateSignificance(controlResults, variantResults);

        // Calculate improvements
        const metrics = {
            ratingImprovement: control.avgRating > 0
                ? ((variant.avgRating - control.avgRating) / control.avgRating) * 100
                : 0,
            helpfulImprovement: control.helpfulRate > 0
                ? ((variant.helpfulRate - control.helpfulRate) / control.helpfulRate) * 100
                : 0,
            actionImprovement: control.actionRate > 0
                ? ((variant.actionRate - control.actionRate) / control.actionRate) * 100
                : 0
        };

        return {
            experimentId: experiment.id,
            name: experiment.name,
            status: experiment.status,
            control,
            variant,
            significance,
            metrics
        };
    }

    /**
     * Declare experiment winner and stop experiment
     */
    async declareWinner(experimentId: string): Promise<void> {
        const results = await this.getResults(experimentId);

        if (!results.significance.isSignificant) {
            throw new Error('Cannot declare winner: results not statistically significant');
        }

        await prisma.aIExperiment.update({
            where: { id: experimentId },
            data: {
                status: 'COMPLETED',
                endDate: new Date(),
                winnerVariant: results.significance.winner,
                significance: results.significance.pValue
            }
        });

        console.log(`🏆 Experiment winner: ${results.significance.winner}`);
    }

    /**
     * Pause experiment
     */
    async pauseExperiment(experimentId: string): Promise<void> {
        await prisma.aIExperiment.update({
            where: { id: experimentId },
            data: { status: 'PAUSED' }
        });
    }

    /**
     * Resume experiment
     */
    async resumeExperiment(experimentId: string): Promise<void> {
        await prisma.aIExperiment.update({
            where: { id: experimentId },
            data: { status: 'RUNNING' }
        });
    }

    /**
     * Get all experiments
     */
    async listExperiments(status?: string): Promise<any[]> {
        const where = status ? { status } : {};

        return await prisma.aIExperiment.findMany({
            where,
            orderBy: { startDate: 'desc' },
            include: {
                _count: {
                    select: { results: true }
                }
            }
        });
    }

    // ========== PRIVATE HELPER METHODS ==========

    private calculateGroupMetrics(results: any[], name: string) {
        const samples = results.length;

        if (samples === 0) {
            return {
                name,
                samples: 0,
                avgRating: 0,
                helpfulRate: 0,
                actionRate: 0,
                avgResponseTime: 0
            };
        }

        // Calculate averages
        const ratings = results.filter(r => r.userRating !== null).map(r => r.userRating);
        const avgRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        const helpfulCount = results.filter(r => r.wasHelpful === true).length;
        const helpfulRate = (helpfulCount / samples) * 100;

        const actionCount = results.filter(r => r.wasActedUpon === true).length;
        const actionRate = (actionCount / samples) * 100;

        const avgResponseTime = results.reduce((sum, r) => sum + r.responseTimeMs, 0) / samples;

        return {
            name,
            samples,
            avgRating,
            helpfulRate,
            actionRate,
            avgResponseTime
        };
    }

    private calculateSignificance(controlResults: any[], variantResults: any[]) {
        // Use "action taken" as primary metric for significance testing
        const controlActions = controlResults.filter(r => r.wasActedUpon === true).length;
        const variantActions = variantResults.filter(r => r.wasActedUpon === true).length;

        const controlTotal = controlResults.length;
        const variantTotal = variantResults.length;

        if (controlTotal === 0 || variantTotal === 0) {
            return {
                pValue: 1.0,
                isSignificant: false,
                winner: null,
                confidence: 0
            };
        }

        // Calculate p-value using chi-square test
        const pValue = calculatePValue(
            controlActions,
            controlTotal,
            variantActions,
            variantTotal
        );

        const isSignificant = pValue < 0.05;

        // Determine winner
        let winner: 'control' | 'variant' | 'no_difference' | null = null;
        if (isSignificant) {
            const controlRate = controlActions / controlTotal;
            const variantRate = variantActions / variantTotal;
            winner = variantRate > controlRate ? 'variant' : 'control';
        } else {
            winner = 'no_difference';
        }

        const confidence = (1 - pValue) * 100;

        return {
            pValue,
            isSignificant,
            winner,
            confidence
        };
    }
}

// Export singleton
export const experimentManager = new ExperimentManager();
