// src/app/api/admin/experiments/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { experimentManager } from '@/lib/ai/ab-testing/experiment-manager';

/**
 * GET /api/admin/experiments - List all experiments
 */
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;

        const experiments = await experimentManager.listExperiments(status);

        return NextResponse.json({
            success: true,
            experiments
        });

    } catch (error: unknown) {
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/experiments - Create new experiment
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, controlPrompt, variantPrompt, trafficSplit, minSampleSize } = body;

        const experimentId = await experimentManager.createExperiment({
            name,
            description,
            controlPrompt,
            variantPrompt,
            trafficSplit,
            minSampleSize
        });

        return NextResponse.json({
            success: true,
            experimentId
        });

    } catch (error: unknown) {
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
