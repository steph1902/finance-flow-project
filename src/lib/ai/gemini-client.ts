import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AI_CONFIG } from './config';
import { logError, logWarn } from '@/lib/logger';

class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!AI_CONFIG.apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: AI_CONFIG.model,
    });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent({
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
    const fullPrompt = schema
      ? `${prompt}\n\nRespond with valid JSON matching this schema:\n${schema}`
      : `${prompt}\n\nRespond with valid JSON only.`;

    const response = await this.generateContentWithRetry(fullPrompt);
    
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                       response.match(/```\n([\s\S]*?)\n```/);
      
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      return JSON.parse(jsonString.trim()) as T;
    } catch (parseError) {
      logError('Failed to parse AI response as JSON', parseError, { response });
      throw new Error('Invalid JSON response from AI');
    }
  }
}

// Export singleton instance
export const geminiClient = new GeminiClient();
