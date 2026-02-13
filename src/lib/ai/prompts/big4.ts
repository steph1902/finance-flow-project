import { z } from 'zod';

export const big4AnalysisSchema = z.object({
    cashflowDiagnosis: z.object({
        netCashflowAvg: z.number(),
        trend: z.string(),
        variability: z.string(),
        assessment: z.string(),
    }),
    riskProjection: z.object({
        thirtyDay: z.object({
            level: z.enum(['Safe', 'Warning', 'Critical']),
            description: z.string(),
        }),
        sixtyDay: z.object({
            level: z.enum(['Safe', 'Warning', 'Critical']),
            description: z.string(),
        }),
        ninetyDay: z.object({
            level: z.enum(['Safe', 'Warning', 'Critical']),
            description: z.string(),
        }),
    }),
    strategicWeakPoints: z.object({
        structuralIssues: z.array(z.string()),
        bufferStatus: z.string(),
        rhythmBalance: z.string(),
    }),
    recommendations: z.array(z.object({
        priority: z.number(),
        action: z.string(),
        impact: z.string(),
        metric: z.string(),
    })),
});

export type Big4AnalysisResponse = z.infer<typeof big4AnalysisSchema>;

export const BIG4_SCHEMA = JSON.stringify({
    type: "object",
    properties: {
        cashflowDiagnosis: {
            type: "object",
            properties: {
                netCashflowAvg: { type: "number" },
                trend: { type: "string" },
                variability: { type: "string" },
                assessment: { type: "string" }
            },
            required: ["netCashflowAvg", "trend", "variability", "assessment"]
        },
        riskProjection: {
            type: "object",
            properties: {
                thirtyDay: {
                    type: "object",
                    properties: {
                        level: { type: "string", enum: ["Safe", "Warning", "Critical"] },
                        description: { type: "string" }
                    },
                    required: ["level", "description"]
                },
                sixtyDay: {
                    type: "object",
                    properties: {
                        level: { type: "string", enum: ["Safe", "Warning", "Critical"] },
                        description: { type: "string" }
                    },
                    required: ["level", "description"]
                },
                ninetyDay: {
                    type: "object",
                    properties: {
                        level: { type: "string", enum: ["Safe", "Warning", "Critical"] },
                        description: { type: "string" }
                    },
                    required: ["level", "description"]
                }
            },
            required: ["thirtyDay", "sixtyDay", "ninetyDay"]
        },
        strategicWeakPoints: {
            type: "object",
            properties: {
                structuralIssues: { type: "array", items: { type: "string" } },
                bufferStatus: { type: "string" },
                rhythmBalance: { type: "string" }
            },
            required: ["structuralIssues", "bufferStatus", "rhythmBalance"]
        },
        recommendations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    priority: { type: "number" },
                    action: { type: "string" },
                    impact: { type: "string" },
                    metric: { type: "string" }
                },
                required: ["priority", "action", "impact", "metric"]
            }
        }
    },
    required: ["cashflowDiagnosis", "riskProjection", "strategicWeakPoints", "recommendations"]
});
