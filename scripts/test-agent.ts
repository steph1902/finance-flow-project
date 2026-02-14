// scripts/test-agent.ts
/**
 * Test script to run the Budget Guardian agent manually
 * Run with: npx tsx scripts/test-agent.ts
 */

import { BudgetGuardianAgent } from "../src/lib/ai/agents/budget-guardian";
import { prisma } from "../src/lib/prisma";

async function testAgent() {
  console.log("🧪 Testing Budget Guardian Agent...\n");

  const agent = new BudgetGuardianAgent();

  try {
    // Check if we have any budgets in the database
    const budgetCount = await prisma.budget.count();
    console.log(`📊 Found ${budgetCount} budgets in database\n`);

    if (budgetCount === 0) {
      console.log(
        "⚠️  No budgets found. Agent will run but may not generate insights.",
      );
      console.log("   Run the seed script first: npm run db:seed\n");
    }

    // Run the agent once
    console.log("🤖 Starting agent single run...\n");
    await agent.start();

    // Let it run for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Stop the agent
    await agent.stop();

    // Check decision logs
    const decisions = await prisma.agentDecisionLog.findMany({
      where: { agentType: "BudgetGuardian" },
      orderBy: { timestamp: "desc" },
      take: 1,
    });

    if (decisions.length > 0) {
      console.log("\n✅ Agent ran successfully! Decision log:");
      console.log(JSON.stringify(decisions[0], null, 2));
    } else {
      console.log(
        "\n⚠️  No decision logs created. Check console output above for errors.",
      );
    }
  } catch (error) {
    console.error("\n❌ Agent test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAgent();
