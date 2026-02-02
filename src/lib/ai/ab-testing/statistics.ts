// src/lib/ai/ab-testing/statistics.ts
/**
 * Statistical Functions for A/B Testing
 * Chi-square test, confidence intervals, sample size calculations
 */

/**
 * Calculate p-value using chi-square test for two proportions
 * Used to determine if difference between control and variant is statistically significant
 */
export function calculatePValue(
    controlSuccesses: number,
    controlTotal: number,
    variantSuccesses: number,
    variantTotal: number
): number {
    // Calculate proportions
    const p1 = controlSuccesses / controlTotal;
    const p2 = variantSuccesses / variantTotal;

    // Pooled proportion
    const pooled = (controlSuccesses + variantSuccesses) / (controlTotal + variantTotal);

    // Standard error
    const se = Math.sqrt(pooled * (1 - pooled) * (1 / controlTotal + 1 / variantTotal));

    if (se === 0) return 1.0;

    // Z-score
    const z = Math.abs(p1 - p2) / se;

    // Convert z-score to p-value (two-tailed test)
    const pValue = 2 * (1 - normalCDF(z));

    return Math.min(1, Math.max(0, pValue));
}

/**
 * Calculate confidence interval for a proportion
 */
export function calculateConfidenceInterval(
    successes: number,
    total: number,
    confidenceLevel: number = 0.95
): { lower: number; upper: number } {
    if (total === 0) {
        return { lower: 0, upper: 0 };
    }

    const p = successes / total;
    const z = getZScore(confidenceLevel);
    const se = Math.sqrt((p * (1 - p)) / total);

    return {
        lower: Math.max(0, p - z * se),
        upper: Math.min(1, p + z * se)
    };
}

/**
 * Calculate required sample size for detecting a given effect
 */
export function calculateSampleSize(
    baselineRate: number,
    minimumDetectableEffect: number, // e.g., 0.1 for 10% improvement
    power: number = 0.8,
    alpha: number = 0.05
): number {
    const p1 = baselineRate;
    const p2 = baselineRate * (1 + minimumDetectableEffect);

    const zAlpha = getZScore(1 - alpha / 2);
    const zBeta = getZScore(power);

    const pooled = (p1 + p2) / 2;

    const n = Math.pow(zAlpha + zBeta, 2) *
        (p1 * (1 - p1) + p2 * (1 - p2)) /
        Math.pow(p2 - p1, 2);

    return Math.ceil(n);
}

/**
 * Calculate effect size (Cohen's h)
 */
export function calculateEffectSize(
    controlSuccesses: number,
    controlTotal: number,
    variantSuccesses: number,
    variantTotal: number
): number {
    const p1 = controlSuccesses / controlTotal;
    const p2 = variantSuccesses / variantTotal;

    // Cohen's h formula
    const h = 2 * (Math.asin(Math.sqrt(p2)) - Math.asin(Math.sqrt(p1)));

    return h;
}

/**
 * Determine if sample size is sufficient
 */
export function isSampleSizeSufficient(
    controlTotal: number,
    variantTotal: number,
    minSampleSize: number = 100
): boolean {
    return controlTotal >= minSampleSize && variantTotal >= minSampleSize;
}

// ========== HELPER FUNCTIONS ==========

/**
 * Cumulative distribution function for standard normal distribution
 */
function normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

    return x > 0 ? 1 - prob : prob;
}

/**
 * Get z-score for a given confidence level
 */
function getZScore(confidenceLevel: number): number {
    const zScores: { [key: number]: number } = {
        0.90: 1.645,
        0.95: 1.96,
        0.975: 2.24,
        0.99: 2.576,
        0.995: 2.807,
        0.999: 3.291
    };

    return zScores[confidenceLevel] || 1.96; // Default to 95%
}

/**
 * Calculate statistical power of an experiment
 */
export function calculatePower(
    controlSuccesses: number,
    controlTotal: number,
    variantSuccesses: number,
    variantTotal: number,
    alpha: number = 0.05
): number {
    const p1 = controlSuccesses / controlTotal;
    const p2 = variantSuccesses / variantTotal;

    const pooled = (controlSuccesses + variantSuccesses) / (controlTotal + variantTotal);
    const se1 = Math.sqrt(pooled * (1 - pooled) * (1 / controlTotal + 1 / variantTotal));
    const se2 = Math.sqrt(p1 * (1 - p1) / controlTotal + p2 * (1 - p2) / variantTotal);

    const zAlpha = getZScore(1 - alpha / 2);
    const zBeta = (Math.abs(p2 - p1) - zAlpha * se1) / se2;

    return normalCDF(zBeta);
}

/**
 * Bayesian posterior probability that variant is better
 */
export function calculateBayesianProbability(
    controlSuccesses: number,
    controlTotal: number,
    variantSuccesses: number,
    variantTotal: number
): number {
    // Simplified Bayesian calculation using Beta distribution
    // In production, would use proper Monte Carlo simulation

    const alpha1 = controlSuccesses + 1;
    const beta1 = controlTotal - controlSuccesses + 1;

    const alpha2 = variantSuccesses + 1;
    const beta2 = variantTotal - variantSuccesses + 1;

    // Mean of beta distributions
    const mean1 = alpha1 / (alpha1 + beta1);
    const mean2 = alpha2 / (alpha2 + beta2);

    // Simple approximation
    if (mean2 > mean1) {
        const diff = (mean2 - mean1) / mean1;
        return Math.min(0.99, 0.5 + diff * 2);
    } else {
        const diff = (mean1 - mean2) / mean2;
        return Math.max(0.01, 0.5 - diff * 2);
    }
}
