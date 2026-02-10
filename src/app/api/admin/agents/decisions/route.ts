// src/app/api/admin/agents/decisions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/agents/decisions - Get agent decision logs
 * Query params: agentType?, limit?, offset?
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const agentType = searchParams.get('agentType');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where = agentType ? { agentType } : {};

        const [decisions, total] = await Promise.all([
            prisma.agentDecisionLog.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: limit,
                skip: offset
            }),
            prisma.agentDecisionLog.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                decisions,
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { success: false, error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
