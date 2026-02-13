import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GeminiClient } from '../gemini-client';
import { z } from 'zod';

// Mock Config
jest.mock('../config', () => ({
  AI_CONFIG: {
    apiKey: 'test-key',
    model: 'gemini-pro',
    temperature: 0.7,
  },
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logError: jest.fn(),
  logWarn: jest.fn(),
}));

describe('GeminiClient', () => {
  let client: GeminiClient;
  let mockModel: any;
  let mockGenerateContent: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGenerateContent = jest.fn();
    mockModel = {
      generateContent: mockGenerateContent,
    };

    // Inject mock model
    client = new GeminiClient('test-key', mockModel);
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      mockGenerateContent.mockResolvedValue({
        response: Promise.resolve({
          text: () => 'Test response',
        }),
      });

      const result = await client.generateContent('Test prompt');
      expect(result).toBe('Test response');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      // Mock failure then success
      mockGenerateContent
        .mockRejectedValueOnce(new Error('429 Rate limit exceeded'))
        .mockResolvedValue({
          response: Promise.resolve({
            text: () => 'Retry success',
          }),
        });

      // We need to bypass `generateContent` direct call for retry test IF we test `generateContent`.
      // But `generateContent` uses `withRetry` internaly now.
      const result = await client.generateContent('Retry prompt');
      expect(result).toBe('Retry success');
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateObject', () => {
    it('should parse and validate JSON', async () => {
      const schema = z.object({
        answer: z.string(),
        confidence: z.number(),
      });

      mockGenerateContent.mockResolvedValue({
        response: Promise.resolve({
          text: () => '```json\n{ "answer": "Yes", "confidence": 0.9 }\n```',
        }),
      });

      const result = await client.generateObject('Prompt', 'Schema Desc', schema);

      expect(result).toEqual({ answer: 'Yes', confidence: 0.9 });
    });

    it('should throw on validation error', async () => {
      const schema = z.object({
        answer: z.string(),
      });

      mockGenerateContent.mockResolvedValue({
        response: Promise.resolve({
          text: () => '{ "wrong": "field" }',
        }),
      });

      await expect(client.generateObject('Prompt', 'Schema', schema))
        .rejects.toThrow('AI response did not match expected schema');
    });

    it('should throw on invalid JSON', async () => {
      const schema = z.object({ answer: z.string() });
      mockGenerateContent.mockResolvedValue({
        response: Promise.resolve({
          text: () => 'Not JSON',
        }),
      });

      await expect(client.generateObject('Prompt', 'Schema', schema))
        .rejects.toThrow('Invalid JSON response from AI');
    });
  });
});
