import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AI_CONFIG } from './config';
import { logError, logWarn } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Lazy initialization - only creates client when first used (runtime)
   * This prevents build failures when env vars are missing
   */
  private initialize() {
    if (this.genAI && this.model) {
      return; // Already initialized
    }

    // Use provided key or fallback to env var
    const keyToUse = this.apiKey || AI_CONFIG.apiKey;

    if (!keyToUse) {
      throw new Error(
        'GEMINI_API_KEY not configured. ' +
        'Please set GEMINI_API_KEY in your Vercel environment variables or in Settings > API Keys.'
      );
    }

    this.genAI = new GoogleGenerativeAI(keyToUse);
    this.model = this.genAI.getGenerativeModel({
      model: AI_CONFIG.model,
    });
  }

  async generateContent(prompt: string): Promise<string> {
    this.initialize(); // Lazy init

    try {
      const result = await this.model!.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: AI_CONFIG.temperature,
          maxOutputTokens: AI_CONFIG.maxTokens,
          topP: AI_CONFIG.topP,
          topK: AI_CONFIG.topK,
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      logError('Gemini API Error', error, { context: 'gemini-client' });
      throw new Error('Failed to generate AI response: ' + (error as Error).message);
    }
  }

  async generateContentWithRetry(
    prompt: string,
    maxRetries = 3
  ): Promise<string> {
    this.initialize(); // Lazy init

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateContent(prompt);
      } catch (error) {
        lastError = error as Error;
        logWarn(`Gemini retry attempt ${attempt} failed`, { error, attempt, maxRetries });

        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed after all retry attempts');
  }

  async generateStructuredContent<T>(
    prompt: string,
    schema?: string
  ): Promise<T> {
    this.initialize(); // Lazy init

    const fullPrompt = schema
      ? `${prompt}\n\nRespond with valid JSON matching this schema:\n${schema}`
      : `${prompt}\n\nRespond with valid JSON only.`;

    const response = await this.generateContentWithRetry(fullPrompt);

    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
        response.match(/```\n([\s\S]*?)\n```/);

      const jsonString = jsonMatch?.[1] ?? response;
      return JSON.parse(jsonString.trim()) as T;
    } catch (parseError) {
      logError('Failed to parse AI response as JSON', parseError, { response });
      throw new Error('Invalid JSON response from AI');
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
      if (keys && keys['gemini-ai']) {
        userKey = keys['gemini-ai'];
      }
    } catch (error) {
      logWarn('Failed to fetch user API key, falling back to env', { userId, error });
    }
  }

  return new GeminiClient(userKey);
}

/**
 * Export singleton instance (lazy initialization)
 * @deprecated Use getGeminiClient(userId) instead for multi-tenant support
 */
export const geminiClient = new GeminiClient();
