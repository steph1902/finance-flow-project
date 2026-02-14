// src/lib/ai/agents/orchestrator.ts
import { AutonomousAgent } from "./base-agent";
import { BudgetGuardianAgent } from "./budget-guardian";
import { logInfo, logError } from "@/lib/logger";

/**
 * Agent Orchestrator
 * Manages lifecycle of all autonomous agents in the system
 */
export class AgentOrchestrator {
  private agents: Map<string, AutonomousAgent>;
  private static instance: AgentOrchestrator;

  private constructor() {
    this.agents = new Map();
    this.registerAgents();
  }

  /**
   * Singleton pattern - only one orchestrator should exist
   */
  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Register all available agents
   */
  private registerAgents(): void {
    // Budget Guardian - monitors budget health
    this.agents.set("BudgetGuardian", new BudgetGuardianAgent());

    // Future agents can be added here:
    // this.agents.set('TransactionClassifier', new ClassificationAgent());
    // this.agents.set('ForecastEngine', new ForecastAgent());
    // this.agents.set('OptimizationAdvisor', new OptimizationAgent());

    logInfo(`📋 Registered ${this.agents.size} agents`);
  }

  /**
   * Start all registered agents
   */
  async startAll(): Promise<void> {
    logInfo(`🚀 Starting ${this.agents.size} agents...`);

    const startPromises = Array.from(this.agents.entries()).map(
      async ([name, agent]) => {
        try {
          await agent.start();
          logInfo(`✅ ${name} started successfully`);
        } catch (error) {
          logError(`❌ Failed to start ${name}:`, error);
        }
      },
    );

    await Promise.all(startPromises);
    logInfo(`🎉 All agents started`);
  }

  /**
   * Stop all running agents
   */
  async stopAll(): Promise<void> {
    logInfo(`🛑 Stopping ${this.agents.size} agents...`);

    const stopPromises = Array.from(this.agents.values()).map((agent) =>
      agent.stop(),
    );
    await Promise.all(stopPromises);

    logInfo(`✅ All agents stopped`);
  }

  /**
   * Start a specific agent by name
   */
  async startAgent(name: string): Promise<void> {
    const agent = this.agents.get(name);

    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }

    await agent.start();
  }

  /**
   * Stop a specific agent by name
   */
  async stopAgent(name: string): Promise<void> {
    const agent = this.agents.get(name);

    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }

    await agent.stop();
  }

  /**
   * Get status of all agents
   */
  getStatus(): Array<{ name: string; running: boolean; intervalMs: number }> {
    return Array.from(this.agents.values()).map((agent) => agent.getStatus());
  }

  /**
   * Get a specific agent
   */
  getAgent(name: string): AutonomousAgent | undefined {
    return this.agents.get(name);
  }

  /**
   * List all available agents
   */
  listAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}

// Export singleton instance
export const agentOrchestrator = AgentOrchestrator.getInstance();

// Auto-start agents in production (can be controlled via env var)
if (process.env.AUTO_START_AGENTS === "true") {
  agentOrchestrator
    .startAll()
    .catch((err) => logError("Failed to auto-start agents", err));
}
