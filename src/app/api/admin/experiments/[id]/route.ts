// src/app/api/admin/experiments/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { experimentManager } from '@/lib/ai/ab-testing/experiment-manager';

/**
 * GET /api/admin/experiments/[id] - Get experiment results
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const results = await experimentManager.getResults(id);

        return NextResponse.json({
            success: true,
            results
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/experiments/[id] - Update experiment status
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action } = body; // 'pause', 'resume', 'declare_winner'

        if (action === 'pause') {
            await experimentManager.pauseExperiment(id);
        } else if (action === 'resume') {
            await experimentManager.resumeExperiment(id);
        } else if (action === 'declare_winner') {
            await experimentManager.declareWinner(id);
        }

        return NextResponse.json({
            success: true,
            message: `Experiment ${action} successful`
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
