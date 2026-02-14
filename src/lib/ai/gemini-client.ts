import {
  GoogleGenerativeAI,
  GenerativeModel,
  Part,
} from "@google/generative-ai";
import { AI_CONFIG } from "./config";
import { logError, logWarn } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { withRetry } from "./retry-handler";
import { ZodType, ZodError } from "zod";

/**
 * ⚠️ VERCEL BUILD FIX:
 * GeminiClient now uses lazy initialization to prevent build-time crashes
 * when GEMINI_API_KEY is missing. The client is only initialized when
 * actually used (runtime), not when the module loads (build-time).
 *
 * 🔄 DYNAMIC KEY UPDATE:
 * Now supports per-user API keys fetched from the database.
 */

export class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string | undefined;

  constructor(apiKey?: string, model?: GenerativeModel) {
    this.apiKey = apiKey;
    this.model = model || null;
  }

  /**
   * Lazy initialization - only creates client when first used (runtime)
   * This prevents build failures when env vars are missing
   */
  private initialize() {
    if (this.model) {
      return; // Already initialized or injected
    }

    // Use provided key or fallback to env var
    const keyToUse = this.apiKey || AI_CONFIG.apiKey;

    if (!keyToUse) {
      throw new Error(
        "GEMINI_API_KEY not configured. " +
          "Please set GEMINI_API_KEY in your Vercel environment variables or in Settings > API Keys.",
      );
    }

    this.genAI = new GoogleGenerativeAI(keyToUse);
    this.model = this.genAI.getGenerativeModel({
      model: AI_CONFIG.model,
    });
  }

  async generateContent(
    prompt: string | Array<string | Part>,
  ): Promise<string> {
    this.initialize(); // Lazy init

    return withRetry(async () => {
      // Normalize input to Part[]
      let parts: Part[];

      if (typeof prompt === "string") {
        parts = [{ text: prompt }];
      } else {
        parts = prompt.map((p) => (typeof p === "string" ? { text: p } : p));
      }

      const result = await this.model!.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: AI_CONFIG.temperature,
          maxOutputTokens: AI_CONFIG.maxTokens,
          topP: AI_CONFIG.topP,
          topK: AI_CONFIG.topK,
        },
      });

      const response = await result.response;
      return response.text();
    });
  }

  /**
   * Generates structured content and validates it against a Zod schema.
   * @param prompt The prompt to send to the AI
   * @param schemaDescription A text description of the expected JSON schema for the prompt
   * @param validationSchema The Zod schema to validate the response against
   */
  async generateObject<T>(
    prompt: string,
    schemaDescription: string,
    validationSchema: ZodType<T>,
  ): Promise<T> {
    const fullPrompt = `${prompt}\n\nRespond with valid JSON matching this structure:\n${schemaDescription}\n\nReturn JSON only.`;

    const responseText = await this.generateContent(fullPrompt);

    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/```\n([\s\S]*?)\n```/);

      const jsonString = jsonMatch?.[1] ?? responseText;
      const parsed = JSON.parse(jsonString.trim());

      // Validate with Zod
      return validationSchema.parse(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        logError("AI Response Validation Failed", error, { responseText });
        throw new Error(
          "AI response did not match expected schema: " + error.message,
        );
      }
      if (error instanceof SyntaxError) {
        logError("AI Response JSON Parse Failed", error, { responseText });
        throw new Error("Invalid JSON response from AI");
      }
      throw error;
    }
  }

  /**
   * @deprecated Use generateObject with Zod schema instead
   */
  async generateStructuredContent<T>(
    prompt: string,
    schema?: string,
  ): Promise<T> {
    // Wrapper for backward compatibility if needed, strict validtion not possible without schema
    // We will fallback to basic parsing
    const fullPrompt = schema
      ? `${prompt}\n\nRespond with valid JSON matching this schema:\n${schema}`
      : `${prompt}\n\nRespond with valid JSON only.`;

    const response = await this.generateContent(fullPrompt);

    try {
      const jsonMatch =
        response.match(/```json\n([\s\S]*?)\n```/) ||
        response.match(/```\n([\s\S]*?)\n```/);

      const jsonString = jsonMatch?.[1] ?? response;
      return JSON.parse(jsonString.trim()) as T;
    } catch (parseError) {
      logError("Failed to parse AI response as JSON", parseError, { response });
      throw new Error("Invalid JSON response from AI");
    }
  }
}

/**
 * Factory to get a GeminiClient instance for a specific user.
 * Fetches the API key from the database (User.apiKeys), falls back to env var.
 */
export async function getGeminiClient(userId?: string): Promise<GeminiClient> {
  let userKey: string | undefined;

  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { apiKeys: true },
      });

      const keys = user?.apiKeys as Record<string, string> | null;
      if (keys && keys["gemini-ai"]) {
        userKey = keys["gemini-ai"];
      }
    } catch (error) {
      logWarn("Failed to fetch user API key, falling back to env", {
        userId,
        error,
      });
    }
  }

  return new GeminiClient(userKey);
}

/**
 * Export singleton instance (lazy initialization)
 * @deprecated Use getGeminiClient(userId) instead for multi-tenant support
 */
export const geminiClient = new GeminiClient();
