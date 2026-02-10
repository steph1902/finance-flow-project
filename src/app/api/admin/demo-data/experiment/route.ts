import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { DemoDataService } from '@/lib/services/demo-data.service';

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

        // Use Service Layer for Business Logic
        const results = DemoDataService.generateExperimentResults(experiment.id, session.user.id);

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

    } catch (error: unknown) {
        logger.error('Demo experiment generation error', error);
        return NextResponse.json(
            { success: false, error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
