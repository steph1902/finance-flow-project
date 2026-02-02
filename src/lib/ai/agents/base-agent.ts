// src/lib/ai/agents/base-agent.ts
/**
 * Base class for all autonomous agents
 * Implements the observe-analyze-decide-act-learn loop
 */

export interface AgentState {
    timestamp: Date;
    data: any;
    metadata?: Record<string, any>;
}

export interface AgentInsight {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    data: any;
    confidence: number; // 0-1
}

export interface AgentAction {
    type: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    payload: any;
    reasoning: string;
    requiresApproval: boolean;
}

export interface AgentDecisionLog {
    agentType: string;
    observation: AgentState;
    insights: AgentInsight[];
    actions: AgentAction[];
    reasoning: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export abstract class AutonomousAgent {
    protected running: boolean = false;
    protected interval?: NodeJS.Timeout;

    constructor(
        protected readonly name: string,
        protected readonly runIntervalMs: number = 60 * 60 * 1000 // Default: 1 hour
    ) { }

    /**
     * Start the agent's autonomous loop
     */
    async start(): Promise<void> {
        if (this.running) {
            console.warn(`Agent ${this.name} is already running`);
            return;
        }

        this.running = true;
        console.log(`🤖 Agent ${this.name} started (interval: ${this.runIntervalMs}ms)`);

        // Run immediately on start
        await this.runLoop();

        // Then run on interval
        this.interval = setInterval(async () => {
            await this.runLoop();
        }, this.runIntervalMs);
    }

    /**
     * Stop the agent
     */
    async stop(): Promise<void> {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.running = false;
        console.log(`🛑 Agent ${this.name} stopped`);
    }

    /**
     * Main agent loop: observe → analyze → decide → act → learn
     */
    private async runLoop(): Promise<void> {
        try {
            const startTime = Date.now();

            // 1. Observe current state
            const state = await this.observe();

            // 2. Analyze state to generate insights
            const insights = await this.analyze(state);

            // 3. Decide what actions to take
            const actions = await this.decide(insights);

            // 4. Execute actions
            await this.act(actions);

            // 5. Learn from outcomes (track for future improvement)
            await this.learn({ state, insights, actions });

            // 6. Log the complete decision cycle
            await this.logDecision({
                agentType: this.name,
                observation: state,
                insights,
                actions,
                reasoning: this.generateReasoningSummary(insights, actions),
                timestamp: new Date(),
                metadata: {
                    executionTimeMs: Date.now() - startTime
                }
            });

        } catch (error) {
            console.error(`❌ Agent ${this.name} encountered error:`, error);
            await this.handleError(error);
        }
    }

    /**
     * STEP 1: Observe the current state
     * Each agent implements this to gather relevant data
     */
    protected abstract observe(): Promise<AgentState>;

    /**
     * STEP 2: Analyze the observed state to generate insights
     * Pattern detection, anomaly detection, forecasting, etc.
     */
    protected abstract analyze(state: AgentState): Promise<AgentInsight[]>;

    /**
     * STEP 3: Decide what actions to take based on insights
     * Multi-step reasoning, constraint evaluation, option comparison
     */
    protected abstract decide(insights: AgentInsight[]): Promise<AgentAction[]>;

    /**
     * STEP 4: Execute the decided actions
     * Send notifications, update database, call external APIs, etc.
     */
    protected abstract act(actions: AgentAction[]): Promise<void>;

    /**
     * STEP 5: Learn from outcomes
     * Track user responses, update models, adjust thresholds
     */
    protected abstract learn(cycle: {
        state: AgentState;
        insights: AgentInsight[];
        actions: AgentAction[];
    }): Promise<void>;

    /**
     * Log the complete decision cycle for audit trail
     */
    protected abstract logDecision(log: AgentDecisionLog): Promise<void>;

    /**
     * Generate a human-readable summary of the reasoning
     */
    protected generateReasoningSummary(
        insights: AgentInsight[],
        actions: AgentAction[]
    ): string {
        if (insights.length === 0) {
            return 'No significant patterns detected. No action required.';
        }

        const highSeverityInsights = insights.filter(i =>
            i.severity === 'high' || i.severity === 'critical'
        );

        if (highSeverityInsights.length === 0 && actions.length === 0) {
            return `Analyzed ${insights.length} patterns. All within normal parameters.`;
        }

        return `Detected ${highSeverityInsights.length} high-priority patterns. ` +
            `Recommended ${actions.length} actions based on analysis.`;
    }

    /**
     * Handle errors in the agent loop
     */
    protected async handleError(error: any): Promise<void> {
        // Log error (in production, this would go to monitoring system)
        console.error(`Agent error in ${this.name}:`, {
            error: error.message,
            stack: error.stack,
            timestamp: new Date()
        });

        // Could implement:
        // - Send alert to monitoring system
        // - Exponential backoff on repeated failures
        // - Circuit breaker pattern
        // - Graceful degradation
    }

    /**
     * Get agent status
     */
    getStatus(): {
        name: string;
        running: boolean;
        intervalMs: number;
    } {
        return {
            name: this.name,
            running: this.running,
            intervalMs: this.runIntervalMs
        };
    }
}
