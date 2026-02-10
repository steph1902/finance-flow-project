// src/app/api/admin/performance/route.ts
import { NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/monitoring/performance';

/**
 * GET /api/admin/performance - Get performance metrics
 */
export async function GET() {
    try {
        const metrics = performanceMonitor.getAllMetrics();

        // Get unique metric names
        const uniqueNames = [...new Set(metrics.map(m => m.name))];

        // Build summaries
        const summaries = uniqueNames.map(name => ({
            name,
            ...performanceMonitor.getSummary(name)
        }));

        return NextResponse.json({
            success: true,
            data: {
                summaries,
                recentMetrics: metrics.slice(-50), // Last 50 metrics
                totalMetrics: metrics.length
            }
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { success: false, error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/performance - Clear all metrics
 */
export async function DELETE() {
    try {
        performanceMonitor.clear();

        return NextResponse.json({
            success: true,
            message: 'Performance metrics cleared'
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { success: false, error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
