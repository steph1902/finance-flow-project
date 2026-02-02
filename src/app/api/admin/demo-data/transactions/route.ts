import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/demo-data/transactions
 * Generate demo transaction data for testing
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        let userId = session?.user?.id;

        // Load Test Bypass
        if (!userId && req.headers.get('x-load-test-bypass') === 'unlocked_for_testing') {
            const demoUser = await prisma.user.findUnique({
                where: { email: 'demo@financeflow.com' },
                select: { id: true }
            });
            if (demoUser) userId = demoUser.id;
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const count = Math.min(body.count || 100, 1000); // Max 1000

        // Generate transactions over last 90 days
        const transactions = [];
        const now = new Date();
        const categories = {
            income: ['Salary', 'Freelance', 'Investment'],
            fixed: ['Rent', 'Utilities', 'Insurance', 'Phone'],
            discretionary: ['Dining', 'Shopping', 'Entertainment', 'Travel']
        };

        for (let i = 0; i < count; i++) {
            // Random date within last 90 days
            const daysAgo = Math.floor(Math.random() * 90);
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);

            // Determine transaction type (20% income, 80% expenses)
            const isIncome = Math.random() < 0.2;

            let amount: number;
            let category: string;
            let description: string;

            if (isIncome) {
                // Income: $3000-5000
                amount = 3000 + Math.random() * 2000;
                category = categories.income[Math.floor(Math.random() * categories.income.length)];
                description = `${category} payment`;
            } else {
                // Expenses: Mix of fixed and discretionary
                const isFixed = Math.random() < 0.5;

                if (isFixed) {
                    // Fixed: $500-1500
                    amount = -(500 + Math.random() * 1000);
                    category = categories.fixed[Math.floor(Math.random() * categories.fixed.length)];
                    description = `${category} bill`;
                } else {
                    // Discretionary: $20-500
                    amount = -(20 + Math.random() * 480);
                    category = categories.discretionary[Math.floor(Math.random() * categories.discretionary.length)];
                    description = category === 'Dining' ? 'Restaurant' :
                        category === 'Shopping' ? 'Online purchase' :
                            category === 'Entertainment' ? 'Movie/Concert' :
                                'Trip expense';
                }
            }

            transactions.push({
                userId,
                amount: Math.round(amount * 100) / 100,
                description,
                category,
                date,
                type: (isIncome ? 'INCOME' : 'EXPENSE') as 'INCOME' | 'EXPENSE'
            });
        }

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
        console.error('Demo data generation error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
