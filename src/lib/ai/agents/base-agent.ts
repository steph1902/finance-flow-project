// src/lib/ai/agents/base-agent.ts
import { logInfo, logError, logWarn } from '@/lib/logger';
/**
 * Base class for all autonomous agents
 * Implements the observe-analyze-decide-act-learn loop
 */

export interface AgentState {
    timestamp: Date;
    metadata?: Record<string, unknown>;
    [key: string]: unknown; // Allow extensions but safe unknown
}

export interface AgentInsight {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    data: unknown;
    confidence: number; // 0-1
}

export interface AgentAction {
    type: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    payload: unknown;
    reasoning: string;
    requiresApproval: boolean;
}

export interface AgentDecisionLog<
    TState = AgentState,
    TInsight = AgentInsight,
    TAction = AgentAction
> {
    agentType: string;
    observation: TState;
    insights: TInsight[];
    actions: TAction[];
    reasoning: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export abstract class AutonomousAgent<
    TState extends AgentState = AgentState,
    TInsight extends AgentInsight = AgentInsight,
    TAction extends AgentAction = AgentAction
> {
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
            logWarn(`Agent ${this.name} is already running`);
            return;
        }

        this.running = true;
        logInfo(`🤖 Agent ${this.name} started (interval: ${this.runIntervalMs}ms)`);

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
        logInfo(`🛑 Agent ${this.name} stopped`);
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
            this.logDecision({
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
            logError(`❌ Agent ${this.name} encountered error:`, error);
            await this.handleError(error);
        }
    }

    /**
     * STEP 1: Observe the current state
     * Each agent implements this to gather relevant data from the environment, database, or external APIs.
     * 
     * @returns {Promise<TState>} A promise resolving to the current state object containing all necessary data for analysis.
     * @throws {Error} If data gathering fails critical requirements.
     */
    protected abstract observe(): Promise<TState>;

    /**
     * STEP 2: Analyze the observed state to generate insights
     * Pattern detection, anomaly detection, forecasting, etc.
     * 
     * @param {TState} state - The current state gathered during the observation phase.
     * @returns {Promise<TInsight[]>} A list of insights derived from the state. Returns empty array if no significant patterns found.
     */
    protected abstract analyze(state: TState): Promise<TInsight[]>;

    /**
     * STEP 3: Decide what actions to take based on insights
     * Multi-step reasoning, constraint evaluation, option comparison.
     * 
     * @param {TInsight[]} insights - The insights generated from the analysis phase.
     * @returns {Promise<TAction[]>} A list of concrete actions to execute.
     */
    protected abstract decide(insights: TInsight[]): Promise<TAction[]>;

    /**
     * STEP 4: Execute the decided actions
     * Send notifications, update database, call external APIs, etc.
     * 
     * @param {TAction[]} actions - The list of actions to execute.
     * @returns {Promise<void>} Resolves when all actions have been processed.
     */
    protected abstract act(actions: TAction[]): Promise<void>;

    /**
     * STEP 5: Learn from outcomes
     * Track user responses, update models, adjust thresholds.
     * 
     * @param {Object} cycle - The complete decision cycle data.
     * @param {TState} cycle.state - The initial state.
     * @param {TInsight[]} cycle.insights - The generated insights.
     * @param {TAction[]} cycle.actions - The executed actions.
     * @returns {Promise<void>} Resolves when learning data has been persisted.
     */
    protected abstract learn(cycle: {
        state: TState;
        insights: TInsight[];
        actions: TAction[];
    }): Promise<void>;

    /**
     * Log the complete decision cycle for audit trail
     * 
     * @param {AgentDecisionLog<TState, TInsight, TAction>} log - The structured log object to persist.
     * @returns {Promise<void>} Resolves when logging is complete.
     */
    protected abstract logDecision(log: AgentDecisionLog<TState, TInsight, TAction>): Promise<void>;

    /**
     * Generate a human-readable summary of the reasoning
     */
    protected generateReasoningSummary(
        insights: TInsight[],
        actions: TAction[]
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
    protected async handleError(error: unknown): Promise<void> {
        // Log error (in production, this would go to monitoring system)
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;

        logError(`Agent error in ${this.name}`, error, {
            error: errorMessage,
            stack: stack,
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
