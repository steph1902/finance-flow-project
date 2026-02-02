// src/lib/ai/agents/budget-guardian.ts
import { AutonomousAgent, type AgentState, type AgentInsight, type AgentAction, type AgentDecisionLog } from './base-agent';
import { prisma } from '@/lib/prisma';
import type { Transaction, Budget, RecurringTransaction } from '@prisma/client';

interface BudgetState extends AgentState {
    data: {
        budgets: Budget[];
        transactions: Transaction[];
        recurring: RecurringTransaction[];
        historicalPatterns: MonthlySpendingPattern[];
    };
}

interface MonthlySpendingPattern {
    month: number;
    year: number;
    category: string;
    totalSpent: number;
    transactionCount: number;
    averagePerTransaction: number;
}

/**
 * Budget Guardian Agent
 * Continuously monitors budget health and provides autonomous recommendations
 */
export class BudgetGuardianAgent extends AutonomousAgent {
    constructor() {
        super('BudgetGuardian', 60 * 60 * 1000); // Run every hour
    }

    /**
     * OBSERVE: Gather current budget state
     */
    protected async observe(): Promise<BudgetState> {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);

        // Gather data in parallel for efficiency
        const [budgets, transactions, recurring, historicalPatterns] = await Promise.all([
            // Current month budgets across all users
            prisma.budget.findMany({
                where: {
                    month: currentMonth,
                    year: currentYear
                }
            }),

            // Transactions from this month
            prisma.transaction.findMany({
                where: {
                    date: { gte: startOfMonth },
                    deletedAt: null
                },
                orderBy: { date: 'desc' }
            }),

            // Active recurring transactions
            prisma.recurringTransaction.findMany({
                where: { isActive: true }
            }),

            // Historical spending patterns (last 3 months)
            this.getHistoricalPatterns(currentMonth, currentYear, 3)
        ]);

        return {
            timestamp: now,
            data: {
                budgets,
                transactions,
                recurring,
                historicalPatterns
            },
            metadata: {
                budgetCount: budgets.length,
                transactionCount: transactions.length,
                recurringCount: recurring.length
            }
        };
    }

    /**
     * ANALYZE: Detect patterns, anomalies, and risks
     */
    protected async analyze(state: BudgetState): Promise<AgentInsight[]> {
        const insights: AgentInsight[] = [];
        const { budgets, transactions, recurring, historicalPatterns } = state.data;

        // Group transactions by user and category
        const transactionsByUserCategory = this.groupTransactionsByUserCategory(transactions);

        // Analyze each budget
        for (const budget of budgets) {
            const userCategoryKey = `${budget.userId}_${budget.category}`;
            const categoryTransactions = transactionsByUserCategory.get(userCategoryKey) || [];

            // Calculate current spending
            const currentSpent = categoryTransactions
                .filter(t => t.type === 'EXPENSE')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            // Get recurring obligations for this category
            const categoryRecurring = recurring
                .filter(r => r.userId === budget.userId && r.category === budget.category)
                .reduce((sum, r) => sum + Number(r.amount), 0);

            // Calculate days remaining in month
            const now = new Date();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const daysRemaining = Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            const daysInMonth = endOfMonth.getDate();
            const daysElapsed = daysInMonth - daysRemaining;

            // Calculate expected spending at this point
            const expectedSpending = (Number(budget.amount) / daysInMonth) * daysElapsed;

            // Insight 1: Budget overrun risk
            const budgetRemaining = Number(budget.amount) - currentSpent;
            const projectedEndOfMonthSpending = currentSpent + categoryRecurring;

            if (projectedEndOfMonthSpending > Number(budget.amount)) {
                const overrunAmount = projectedEndOfMonthSpending - Number(budget.amount);
                const overrunPercent = (overrunAmount / Number(budget.amount)) * 100;

                insights.push({
                    type: 'BUDGET_OVERRUN_RISK',
                    severity: overrunPercent > 50 ? 'critical' : overrunPercent > 25 ? 'high' : 'medium',
                    description: `Budget "${budget.category}" projected to exceed by $${overrunAmount.toFixed(2)} (${overrunPercent.toFixed(1)}%)`,
                    data: {
                        userId: budget.userId,
                        category: budget.category,
                        budgetAmount: budget.amount,
                        currentSpent,
                        projectedTotal: projectedEndOfMonthSpending,
                        overrunAmount,
                        daysRemaining
                    },
                    confidence: 0.85
                });
            }

            // Insight 2: Pace anomaly detection
            const paceRatio = currentSpent / expectedSpending;
            if (paceRatio > 1.5 && daysElapsed > 7) { // Spending too fast, and we're past the first week
                insights.push({
                    type: 'SPENDING_PACE_ANOMALY',
                    severity: paceRatio > 2 ? 'high' : 'medium',
                    description: `Spending pace is ${(paceRatio * 100).toFixed(0)}% of expected for "${budget.category}"`,
                    data: {
                        userId: budget.userId,
                        category: budget.category,
                        currentSpent,
                        expectedSpending,
                        paceRatio,
                        daysElapsed,
                        daysRemaining
                    },
                    confidence: 0.75
                });
            }

            // Insight 3: Historical comparison
            const historicalAverage = this.getHistoricalAverage(historicalPatterns, budget.category);
            if (historicalAverage && currentSpent > historicalAverage * 1.3 && daysElapsed > 14) {
                insights.push({
                    type: 'HISTORICAL_ANOMALY',
                    severity: 'medium',
                    description: `Spending on "${budget.category}" is 30%+ above historical average`,
                    data: {
                        userId: budget.userId,
                        category: budget.category,
                        currentSpent,
                        historicalAverage,
                        deviation: ((currentSpent / historicalAverage) - 1) * 100
                    },
                    confidence: 0.70
                });
            }

            // Insight 4: Threshold alert
            if (budget.alertThreshold) {
                const spentPercent = (currentSpent / Number(budget.amount)) * 100;
                const thresholdPercent = Number(budget.alertThreshold);

                if (spentPercent >= thresholdPercent) {
                    insights.push({
                        type: 'THRESHOLD_EXCEEDED',
                        severity: spentPercent >= 90 ? 'high' : 'medium',
                        description: `Budget threshold (${thresholdPercent}%) exceeded for "${budget.category}"`,
                        data: {
                            userId: budget.userId,
                            category: budget.category,
                            spentPercent,
                            thresholdPercent,
                            budgetAmount: budget.amount,
                            currentSpent
                        },
                        confidence: 1.0 // This is a hard rule
                    });
                }
            }
        }

        return insights;
    }

    /**
     * DECIDE: Determine what actions to take
     */
    protected async decide(insights: AgentInsight[]): Promise<AgentAction[]> {
        const actions: AgentAction[] = [];

        for (const insight of insights) {
            switch (insight.type) {
                case 'BUDGET_OVERRUN_RISK':
                    if (insight.severity === 'critical' || insight.severity === 'high') {
                        actions.push({
                            type: 'SEND_ALERT',
                            priority: insight.severity === 'critical' ? 'urgent' : 'high',
                            payload: {
                                userId: insight.data.userId,
                                title: `⚠️ Budget Alert: ${insight.data.category}`,
                                message: `Your ${insight.data.category} budget is projected to exceed by $${insight.data.overrunAmount.toFixed(2)} with ${insight.data.daysRemaining} days remaining.`,
                                category: insight.data.category,
                                type: 'BUDGET_ALERT'
                            },
                            reasoning: `Projected spending ($${insight.data.projectedTotal.toFixed(2)}) exceeds budget ($${Number(insight.data.budgetAmount).toFixed(2)})`,
                            requiresApproval: false
                        });

                        // Suggest budget reallocation if there's a way to fix it
                        actions.push({
                            type: 'SUGGEST_REALLOCATION',
                            priority: 'medium',
                            payload: {
                                userId: insight.data.userId,
                                fromCategory: insight.data.category,
                                suggestion: `Consider reducing discretionary spending or increasing budget by $${(insight.data.overrunAmount * 1.1).toFixed(2)}`
                            },
                            reasoning: `Allow 10% buffer for unexpected expenses`,
                            requiresApproval: true
                        });
                    }
                    break;

                case 'THRESHOLD_EXCEEDED':
                    actions.push({
                        type: 'SEND_NOTIFICATION',
                        priority: 'medium',
                        payload: {
                            userId: insight.data.userId,
                            title: `Budget Threshold Reached: ${insight.data.category}`,
                            message: `You've reached ${insight.data.spentPercent.toFixed(1)}% of your ${insight.data.category} budget.`,
                            type: 'BUDGET_ALERT'
                        },
                        reasoning: `User-defined threshold (${insight.data.thresholdPercent}%) exceeded`,
                        requiresApproval: false
                    });
                    break;

                case 'SPENDING_PACE_ANOMALY':
                    if (insight.severity === 'high') {
                        actions.push({
                            type: 'SEND_INSIGHT',
                            priority: 'medium',
                            payload: {
                                userId: insight.data.userId,
                                title: `⚡ Spending Pace Alert: ${insight.data.category}`,
                                message: `You're spending ${(insight.data.paceRatio * 100).toFixed(0)}% faster than expected. Consider slowing down to stay within budget.`,
                                type: 'ANOMALY_DETECTION'
                            },
                            reasoning: `Spending pace significantly above expected (${insight.data.paceRatio.toFixed(2)}x)`,
                            requiresApproval: false
                        });
                    }
                    break;

                case 'HISTORICAL_ANOMALY':
                    actions.push({
                        type: 'SEND_INSIGHT',
                        priority: 'low',
                        payload: {
                            userId: insight.data.userId,
                            title: `📊 Spending Trend: ${insight.data.category}`,
                            message: `Your ${insight.data.category} spending is ${insight.data.deviation.toFixed(1)}% above your historical average.`,
                            type: 'ANOMALY_DETECTION'
                        },
                        reasoning: `Historical pattern deviation detected`,
                        requiresApproval: false
                    });
                    break;
            }
        }

        return actions;
    }

    /**
     * ACT: Execute the decided actions
     */
    protected async act(actions: AgentAction[]): Promise<void> {
        for (const action of actions) {
            try {
                switch (action.type) {
                    case 'SEND_ALERT':
                    case 'SEND_NOTIFICATION':
                    case 'SEND_INSIGHT':
                        await prisma.notification.create({
                            data: {
                                userId: action.payload.userId,
                                type: action.payload.type || 'BUDGET_ALERT',
                                title: action.payload.title,
                                message: action.payload.message,
                                priority: action.priority === 'urgent' ? 2 : action.priority === 'high' ? 1 : 0,
                                metadata: {
                                    agentGenerated: true,
                                    agentName: this.name,
                                    reasoning: action.reasoning
                                }
                            }
                        });
                        break;

                    case 'SUGGEST_REALLOCATION':
                        // Create AI suggestion
                        await prisma.aISuggestion.create({
                            data: {
                                userId: action.payload.userId,
                                suggestionType: 'BUDGET_REALLOCATION',
                                suggestedValue: action.payload.suggestion,
                                confidenceScore: 0.80,
                                metadata: {
                                    agentGenerated: true,
                                    agentName: this.name,
                                    reasoning: action.reasoning,
                                    fromCategory: action.payload.fromCategory
                                }
                            }
                        });
                        break;
                }
            } catch (error) {
                console.error(`Failed to execute action ${action.type}:`, error);
            }
        }
    }

    /**
     * LEARN: Track outcomes for future improvement
     */
    protected async learn(cycle: { state: AgentState; insights: AgentInsight[]; actions: AgentAction[] }): Promise<void> {
        // In a full implementation, this would:
        // 1. Track which suggestions users accepted/rejected
        // 2. Adjust confidence thresholds based on accuracy
        // 3. Update anomaly detection parameters
        // 4. Feed data back into ML models

        // For now, we just log metrics
        const learningMetrics = {
            timestamp: new Date(),
            insightsGenerated: cycle.insights.length,
            actionsRecommended: cycle.actions.length,
            highSeverityCount: cycle.insights.filter(i => i.severity === 'high' || i.severity === 'critical').length
        };

        console.log(`🧠 ${this.name} Learning Metrics:`, learningMetrics);
    }

    /**
     * Log the decision cycle to database
     */
    protected async logDecision(log: AgentDecisionLog): Promise<void> {
        try {
            // Store in database for audit trail and monitoring
            await prisma.agentDecisionLog.create({
                data: {
                    agentType: log.agentType,
                    observation: log.observation as any,
                    insights: log.insights as any,
                    actions: log.actions as any,
                    reasoning: log.reasoning,
                    executionTimeMs: log.metadata?.executionTimeMs || 0,
                    insightsCount: log.insights.length,
                    actionsCount: log.actions.length,
                    highSeverityCount: log.insights.filter(i =>
                        i.severity === 'high' || i.severity === 'critical'
                    ).length,
                    timestamp: log.timestamp
                }
            });

            console.log(`✅ ${this.name} logged decision to database:`, {
                insightsCount: log.insights.length,
                actionsCount: log.actions.length,
                executionTime: log.metadata?.executionTimeMs
            });
        } catch (error) {
            console.error(`❌ Failed to log decision to database:`, error);
            // Don't throw - logging failure shouldn't break the agent
        }
    }

    // Helper methods

    private groupTransactionsByUserCategory(transactions: Transaction[]): Map<string, Transaction[]> {
        const groups = new Map<string, Transaction[]>();

        for (const tx of transactions) {
            const key = `${tx.userId}_${tx.category}`;
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key)!.push(tx);
        }

        return groups;
    }

    private async getHistoricalPatterns(currentMonth: number, currentYear: number, monthsBack: number): Promise<MonthlySpendingPattern[]> {
        // Get transactions from the last N months
        const startDate = new Date(currentYear, currentMonth - monthsBack - 1, 1);
        const endDate = new Date(currentYear, currentMonth - 1, 0);

        const transactions = await prisma.transaction.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null,
                type: 'EXPENSE'
            }
        });

        // Group by month and category
        const patterns = new Map<string, MonthlySpendingPattern>();

        for (const tx of transactions) {
            const month = tx.date.getMonth() + 1;
            const year = tx.date.getFullYear();
            const key = `${year}_${month}_${tx.category}`;

            if (!patterns.has(key)) {
                patterns.set(key, {
                    month,
                    year,
                    category: tx.category,
                    totalSpent: 0,
                    transactionCount: 0,
                    averagePerTransaction: 0
                });
            }

            const pattern = patterns.get(key)!;
            pattern.totalSpent += Number(tx.amount);
            pattern.transactionCount += 1;
        }

        // Calculate averages
        for (const pattern of patterns.values()) {
            pattern.averagePerTransaction = pattern.totalSpent / pattern.transactionCount;
        }

        return Array.from(patterns.values());
    }

    private getHistoricalAverage(patterns: MonthlySpendingPattern[], category: string): number | null {
        const categoryPatterns = patterns.filter(p => p.category === category);

        if (categoryPatterns.length === 0) {
            return null;
        }

        const totalSpent = categoryPatterns.reduce((sum, p) => sum + p.totalSpent, 0);
        return totalSpent / categoryPatterns.length;
    }
}
