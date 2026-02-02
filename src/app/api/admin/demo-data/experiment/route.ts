import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/demo-data/experiment
 * Generate demo experiment with results
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            await logger.warn('Demo experiment generation unauthorized access attempt', { userId: 'anonymous', ip: req.headers.get('x-forwarded-for') || 'unknown' });
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Create experiment
        const experiment = await prisma.aIExperiment.create({
            data: {
                name: 'Big 4 vs Baseline Demo',
                description: 'Testing Big 4 effectiveness with demo data',

                controlPrompt: 'Baseline generic financial advice prompt',
                variantPrompt: 'Big 4 structured analysis prompt',
                status: 'RUNNING',
                trafficSplit: 50,
                minSampleSize: 100,
                startDate: new Date(),
            }
        });

        // Generate demo results
        const results = [];

        // Control group: 523 samples, 18.3% action rate
        for (let i = 0; i < 523; i++) {
            const tookAction = Math.random() < 0.183; // 18.3% action rate
            const rating = Math.floor(Math.random() * 2) + 3; // 3-4 rating
            const wasHelpful = Math.random() < 0.45; // 45% helpful rate

            results.push({
                experimentId: experiment.id,
                userId: session.user.id as string,
                variant: 'control',
                rating,
                wasHelpful,
                tookAction,
                responseTimeMs: Math.floor(800 + Math.random() * 400), // 800-1200ms
                confidence: Math.floor(60 + Math.random() * 20), // 60-80%
                specificity: Math.floor(40 + Math.random() * 30), // 40-70%
                requestData: { prompt: 'How is my financial health?' },
                responseData: { analysis: 'Your financial health is average.' }
            });
        }

        // Variant group: 509 samples, 43.1% action rate
        for (let i = 0; i < 509; i++) {
            const tookAction = Math.random() < 0.431; // 43.1% action rate
            const rating = Math.floor(Math.random() * 2) + 4; // 4-5 rating
            const wasHelpful = Math.random() < 0.78; // 78% helpful rate

            results.push({
                experimentId: experiment.id,
                userId: session.user.id as string,
                variant: 'variant',
                rating,
                wasHelpful,
                tookAction,
                responseTimeMs: Math.floor(900 + Math.random() * 600), // 900-1500ms
                confidence: Math.floor(80 + Math.random() * 20), // 80-100%
                specificity: Math.floor(75 + Math.random() * 25), // 75-100%
                requestData: { prompt: 'Analyze my cashflow risks using Big 4 methodology' },
                responseData: { analysis: 'Cashflow risk detected: high variance in discretionary spending.', score: 85 }
            });
        }

        // Bulk insert results
        await prisma.aIExperimentResult.createMany({
            data: results
        });

        return NextResponse.json({
            success: true,
            experiment: {
                id: experiment.id,
                name: experiment.name
            },
            resultsCount: results.length,
            message: 'Demo experiment created with statistical significance'
        });

    } catch (error: any) {
        logger.error('Demo experiment generation error', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
