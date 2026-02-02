import { NextRequest, NextResponse } from 'next/server';

console.log('!!! MODULE LOADED: src/app/api/admin/demo-data/transactions/route.ts !!!');

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { DemoDataService } from '@/lib/services/demo-data.service';

/**
 * POST /api/admin/demo-data/transactions
 * Generate demo transaction data for testing
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        let userId = session?.user?.id;

        console.log('[Debug] Session Check:', {
            hasSession: !!session,
            userId: session?.user?.id,
            cookies: req.headers.get('cookie')
        });

        // Load Test Bypass
        if (!userId && req.headers.get('x-load-test-bypass') === 'unlocked_for_testing') {
            const demoUser = await prisma.user.findUnique({
                where: { email: 'demo@financeflow.com' },
                select: { id: true }
            });
            if (demoUser) userId = demoUser.id;
        }

        if (!userId) {
            await logger.warn('Demo data generation unauthorized access attempt', {
                userId: 'anonymous',
                ip: req.headers.get('x-forwarded-for') || 'unknown',
                headers: Object.fromEntries(req.headers.entries())
            });
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const count = Math.min(body.count || 100, 1000); // Max 1000

        // Use Service Layer for Business Logic
        const transactions = DemoDataService.generateTransactions(count, userId);

        // Bulk insert
        await prisma.transaction.createMany({
            data: transactions
        });

        return NextResponse.json({
            success: true,
            count: transactions.length,
            message: `Generated ${transactions.length} demo transactions`
        });

    } catch (error: any) {
        logger.error('Demo data generation error', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
