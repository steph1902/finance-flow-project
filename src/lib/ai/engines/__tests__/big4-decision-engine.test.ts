import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Big4DecisionEngine } from '../big4-decision-engine';
import { financialDataAggregator } from '../../analyzers/financial-data-aggregator';

// Mock dependencies
const mockGenerateObject = jest.fn<any>();
const mockGeminiClient = {
    generateObject: mockGenerateObject,
} as any;
const mockClientFactory = (jest.fn() as any).mockResolvedValue(mockGeminiClient);



describe('Big4DecisionEngine', () => {
    let engine: Big4DecisionEngine;
    const mockDb = {
        big4Analysis: {
            create: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        engine = new Big4DecisionEngine(mockClientFactory as any, mockDb as any);

        // Spy on the singleton method
        jest.spyOn(financialDataAggregator, 'getOrCreateSnapshot').mockResolvedValue({
            periodStart: new Date(),
            periodEnd: new Date(),
            netCashflow90d: 1000,
            cashflowTrendPercent: 10,
            discretionaryVariability: 5,
            burnRate: 2000,
            cashBuffer: 5000,
            bufferMultiple: 2.5,
            monthlyIncome: 3000,
            incomeStability: 'stable',
            monthlyData: [],
            totalExpenses90d: 6000,
            safetyMargin: 83,
            discretionarySpending: 1000,
            fixedExpenses: 5000
        });
    });

    it('should generate analysis using AI', async () => {
        // Mock AI response
        const mockAnalysis = {
            cashflowDiagnosis: {
                netCashflowAvg: 1000,
                trend: 'improving',
                variability: 'low',
                assessment: 'Good health',
            },
            riskProjection: {
                thirtyDay: { level: 'Safe', description: 'Safe' },
                sixtyDay: { level: 'Safe', description: 'Safe' },
                ninetyDay: { level: 'Warning', description: 'Monitor' },
            },
            strategicWeakPoints: {
                structuralIssues: [],
                bufferStatus: 'Good',
                rhythmBalance: 'Balanced',
            },
            recommendations: [
                { priority: 1, action: 'Save more', impact: 'High', metric: '10%' },
            ],
        };

        mockGenerateObject.mockResolvedValue(mockAnalysis);

        const result = await engine.analyze('user-1');

        expect(result.analysis).toEqual(mockAnalysis);
        expect(mockClientFactory).toHaveBeenCalledWith('user-1');
        expect(mockGenerateObject).toHaveBeenCalled();
        expect(financialDataAggregator.getOrCreateSnapshot).toHaveBeenCalledWith('user-1');
    });
});
