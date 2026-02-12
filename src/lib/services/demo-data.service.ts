import { Prisma } from '@prisma/client';

/**
 * Service to handle generation of demo data for testing purposes.
 * Encapsulates business logic for generating realistic transaction and experiment data.
 */
export class DemoDataService {
    /**
     * Generate a list of realistic demo transactions.
     * @param count Number of transactions to generate
     * @param userId The ID of the user to assign transactions to
     * @returns Array of transaction data objects ready for bulk insertion
     */
    static generateTransactions(count: number, userId: string): Prisma.TransactionCreateManyInput[] {
        const transactions: Prisma.TransactionCreateManyInput[] = [];
        const now = new Date();

        // Dynamic Income Profile: Randomize the income ratio between 15% and 35%
        // This makes some demo users "savers" (35% income events) and others "spenders" (15%)
        const incomeRatio = 0.15 + Math.random() * 0.20;

        const categories = {
            income: ['Salary', 'Freelance', 'Investment', 'Side Hustle', 'Business Profit', 'Consulting'],
            fixed: ['Rent', 'Utilities', 'Insurance', 'Phone', 'Internet', 'Subscription'],
            discretionary: ['Dining', 'Shopping', 'Entertainment', 'Travel', 'Hobbies', 'Gadgets']
        };

        for (let i = 0; i < count; i++) {
            // Random date within last 90 days
            const daysAgo = Math.floor(Math.random() * 90);
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);

            // Determine transaction type based on dynamic ratio
            const isIncome = Math.random() < incomeRatio;

            let amount: number;
            let category: string;
            let description: string;

            if (isIncome) {
                // Income: $500-8000 (More variety)
                amount = 500 + Math.random() * 7500;
                category = categories.income[Math.floor(Math.random() * categories.income.length)];

                // Add contextual descriptions
                if (category === 'Side Hustle') description = 'Etsy Shop Sales';
                else if (category === 'Business Profit') description = 'Q3 Dividend';
                else if (category === 'Consulting') description = 'Project Milestone Payment';
                else description = `${category} payment`;

            } else {
                // Expenses: Mix of fixed and discretionary
                const isFixed = Math.random() < 0.4; // Slightly less fixed expenses for more interesting data

                if (isFixed) {
                    // Fixed: $100-2000
                    amount = -(100 + Math.random() * 1900);
                    category = categories.fixed[Math.floor(Math.random() * categories.fixed.length)];
                    description = `${category} bill`;
                } else {
                    // Discretionary: $10-800
                    amount = -(10 + Math.random() * 790);
                    category = categories.discretionary[Math.floor(Math.random() * categories.discretionary.length)];
                    description = category === 'Dining' ? 'Restaurant / Cafe' :
                        category === 'Shopping' ? 'Online Order' :
                            category === 'Entertainment' ? 'Movie/Concert/Game' :
                                category === 'Hobbies' ? 'Art Supplies / Gear' :
                                    category === 'Gadgets' ? 'Tech Upgrade' :
                                        'Trip expense';
                }
            }

            transactions.push({
                userId,
                amount: Math.round(amount * 100) / 100, // Round to 2 decimals
                description,
                category,
                date,
                type: isIncome ? 'INCOME' : 'EXPENSE'
            });
        }

        return transactions;
    }

    /**
     * Generate unrealistic A/B testing experiment results.
     * @param experimentId The ID of the experiment
     * @param userId The ID of the user (admin) who technically "owns" these records for demo
     * @returns Array of result data objects ready for bulk insertion
     */
    static generateExperimentResults(experimentId: string, userId: string): Prisma.AIExperimentResultCreateManyInput[] {
        const results: Prisma.AIExperimentResultCreateManyInput[] = [];

        // Control group: 523 samples, 18.3% action rate
        for (let i = 0; i < 523; i++) {
            const tookAction = Math.random() < 0.183; // 18.3% action rate
            const rating = Math.floor(Math.random() * 2) + 3; // 3-4 rating
            const wasHelpful = Math.random() < 0.45; // 45% helpful rate

            results.push({
                experimentId,
                userId,
                variant: 'control',
                userRating: rating, // Prisma map: rating -> userRating (based on schema) - wait, schema might differ
                wasHelpful,
                wasActedUpon: tookAction, // Prisma map: tookAction -> wasActedUpon
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
                experimentId,
                userId,
                variant: 'variant',
                userRating: rating,
                wasHelpful,
                wasActedUpon: tookAction,
                responseTimeMs: Math.floor(900 + Math.random() * 600), // 900-1500ms
                confidence: Math.floor(80 + Math.random() * 20), // 80-100%
                specificity: Math.floor(75 + Math.random() * 25), // 75-100%
                requestData: { prompt: 'Analyze my cashflow risks using Big 4 methodology' },
                responseData: { analysis: 'Cashflow risk detected: high variance in discretionary spending.', score: 85 }
            });
        }

        return results;
    }
}
