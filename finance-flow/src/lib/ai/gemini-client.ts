import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AI_CONFIG } from './config';
import { logError, logWarn } from '@/lib/logger';

/**
 * ⚠️ VERCEL BUILD FIX:
 * GeminiClient now uses lazy initialization to prevent build-time crashes
 * when GEMINI_API_KEY is missing. The client is only initialized when
 * actually used (runtime), not when the module loads (build-time).
 */

export class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  /**
   * Lazy initialization - only creates client when first used (runtime)
   * This prevents build failures when env vars are missing
   */
  private initialize() {
    if (this.genAI && this.model) {
      return; // Already initialized
    }

    if (!AI_CONFIG.apiKey) {
      throw new Error(
        'GEMINI_API_KEY not configured. ' +
        'Please set GEMINI_API_KEY in your Vercel environment variables.'
      );
    }

    this.genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);
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
      throw new Error('Failed to generate AI response');
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
 * Export singleton instance (lazy initialization)
 * ⚠️ VERCEL BUILD FIX: Instance creation is safe now because
 * the client doesn't initialize until actually used at runtime
 */
export const geminiClient = new GeminiClient();
