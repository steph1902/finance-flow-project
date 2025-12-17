/**
 * @jest-environment node
 */
import { GeminiClient } from '../gemini-client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the Google AI SDK
jest.mock('@google/generative-ai');

describe('GeminiClient', () => {
  let client: GeminiClient;
  let mockGenerateContent: jest.Mock;
  let mockGetGenerativeModel: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock responses
    mockGenerateContent = jest.fn();
    mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });

    (GoogleGenerativeAI as jest.MockedClass<typeof GoogleGenerativeAI>).mockImplementation(
      () =>
        ({
          getGenerativeModel: mockGetGenerativeModel,
        }) as unknown as GoogleGenerativeAI
    );

    // Set API key
    process.env.GEMINI_API_KEY = 'test-api-key';
    
    client = new GeminiClient();
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        response: {
          text: () => 'Generated content',
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await client.generateContent('Test prompt');

      expect(result).toBe('Generated content');
      expect(mockGenerateContent).toHaveBeenCalledWith({
        contents: [{ role: 'user', parts: [{ text: 'Test prompt' }] }],
      });
    });

    it('should throw error when API key is missing', () => {
      delete process.env.GEMINI_API_KEY;
      
      expect(() => new GeminiClient()).toThrow('GEMINI_API_KEY not configured');
    });

    it('should handle API errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      await expect(client.generateContent('Test prompt')).rejects.toThrow('API Error');
    });
  });

  describe('generateContentWithRetry', () => {
    it('should retry on failure and succeed', async () => {
      const mockResponse = {
        response: {
          text: () => 'Success after retry',
        },
      };

      // Fail twice, then succeed
      mockGenerateContent
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockRejectedValueOnce(new Error('Another error'))
        .mockResolvedValueOnce(mockResponse);

      const result = await client.generateContentWithRetry('Test prompt');

      expect(result).toBe('Success after retry');
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Persistent error'));

      await expect(client.generateContentWithRetry('Test prompt', 2)).rejects.toThrow(
        'Persistent error'
      );

      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it('should respect custom retry attempts', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Error'));

      await expect(client.generateContentWithRetry('Test prompt', 5)).rejects.toThrow();

      expect(mockGenerateContent).toHaveBeenCalledTimes(5);
    });
  });

  describe('generateStructuredContent', () => {
    it('should generate and parse JSON content', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({ category: 'Food', confidence: 0.9 }),
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const schema = JSON.stringify({
        type: 'object',
        properties: {
          category: { type: 'string' },
          confidence: { type: 'number' },
        },
      });

      const result = await client.generateStructuredContent('Categorize this', schema);

      expect(result).toEqual({ category: 'Food', confidence: 0.9 });
    });

    it('should handle JSON wrapped in code blocks', async () => {
      const mockResponse = {
        response: {
          text: () => '```json\n{"key": "value"}\n```',
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await client.generateStructuredContent('Test');

      expect(result).toEqual({ key: 'value' });
    });

    it('should throw error on invalid JSON', async () => {
      const mockResponse = {
        response: {
          text: () => 'Not valid JSON',
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      await expect(client.generateStructuredContent('Test')).rejects.toThrow();
    });
  });
});
