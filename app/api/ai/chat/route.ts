import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/auth-helpers";
import { chatWithAssistant } from "@/lib/ai/chat-service";

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationHistory: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
        timestamp: z.coerce.date(),
      })
    )
    .optional()
    .default([]),
});

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory } = chatRequestSchema.parse(body);

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await chatWithAssistant({
      userId,
      message,
      conversationHistory: conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return NextResponse.json({
      response: response.message,
      conversationId: response.conversationId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

export const POST = withApiAuth(handler);
