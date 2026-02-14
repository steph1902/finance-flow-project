// src/app/api/admin/agents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getErrorMessage } from "@/lib/utils/error";
import { agentOrchestrator } from "@/lib/ai/agents/orchestrator";

/**
 * GET /api/admin/agents - Get list of all agents and their status
 */
export async function GET() {
  try {
    const status = agentOrchestrator.getStatus();
    const agents = agentOrchestrator.listAgents();

    return NextResponse.json({
      success: true,
      data: {
        agents: status,
        totalAgents: agents.length,
        runningAgents: status.filter((a) => a.running).length,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/agents - Control agent lifecycle
 * Body: { action: 'start' | 'stop' | 'restart', agentName?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agentName } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 },
      );
    }

    switch (action) {
      case "start":
        if (agentName) {
          await agentOrchestrator.startAgent(agentName);
        } else {
          await agentOrchestrator.startAll();
        }
        break;

      case "stop":
        if (agentName) {
          await agentOrchestrator.stopAgent(agentName);
        } else {
          await agentOrchestrator.stopAll();
        }
        break;

      case "restart":
        if (agentName) {
          await agentOrchestrator.stopAgent(agentName);
          await agentOrchestrator.startAgent(agentName);
        } else {
          await agentOrchestrator.stopAll();
          await agentOrchestrator.startAll();
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `Agent ${agentName || "all"} ${action} successful`,
      data: agentOrchestrator.getStatus(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
