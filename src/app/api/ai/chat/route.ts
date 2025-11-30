import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/auth-helpers";
import { chatWithAssistant } from "@/lib/ai/chat-service";
import { checkChatRateLimit, getRateLimitHeaders } from "@/lib/rate-limiter";
import { logError } from "@/lib/logger";

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

export const POST = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    // Check rate limit
    if (!checkChatRateLimit(userId)) {
      const headers = getRateLimitHeaders(userId, 'CHAT_ENDPOINT');
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers,
        }
      );
    }

    const body = await req.json();
    const { message, conversationHistory } = chatRequestSchema.parse(body);

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

    logError("Chat API error", error, { userId });
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
});
