import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ReceiptOCRService } from '../receipt-ocr-service';
import { ReceiptParserService, ParsedReceipt } from '../receipt-parser-service';

// Mock dependencies
const mockGenerateContent = jest.fn<any>();
const mockGenerateObject = jest.fn<any>();
const mockGeminiClient = {
    generateContent: mockGenerateContent,
    generateObject: mockGenerateObject,
};
const mockClientFactory = (jest.fn() as any).mockResolvedValue(mockGeminiClient);

describe('Receipt Services', () => {
    describe('ReceiptOCRService', () => {
        let ocrService: ReceiptOCRService;

        beforeEach(() => {
            jest.clearAllMocks();
            ocrService = new ReceiptOCRService(mockClientFactory as any);
        });

        it('should extract text from image', async () => {
            mockGenerateContent.mockResolvedValue('Item 1 10.00\nTotal 10.00');

            const result = await ocrService.extractTextFromReceipt('data:image/jpeg;base64,abc', 'user-1');

            expect(result.fullText).toBe('Item 1 10.00\nTotal 10.00');
            expect(result.lines).toHaveLength(2);
            expect(result.confidence).toBe(0.9);
            expect(mockClientFactory).toHaveBeenCalledWith('user-1');
            expect(mockGenerateContent).toHaveBeenCalled();
        });

        it('should validate image format', () => {
            const result1 = ocrService.validateReceiptImage('data:image/jpeg;base64,abc');
            expect(result1.valid).toBe(true);

            const result2 = ocrService.validateReceiptImage('invalid-base64');
            expect(result2.valid).toBe(false);
            expect(result2.error).toContain('Invalid image format');
        });
    });

    describe('ReceiptParserService', () => {
        let parserService: ReceiptParserService;

        beforeEach(() => {
            jest.clearAllMocks();
            parserService = new ReceiptParserService(mockClientFactory as any);
        });

        it('should parse receipt text into structured data', async () => {
            const mockParsed: ParsedReceipt = {
                merchant: 'Walmart',
                amount: 10.00,
                date: '2024-01-01',
                items: [{ name: 'Item 1', price: 10.00 }],
                confidence: 0.95,
            };

            mockGenerateObject.mockResolvedValue(mockParsed);

            const result = await parserService.parseReceiptText('raw text', 'user-1');

            expect(result).toEqual(mockParsed);
            expect(mockGenerateObject).toHaveBeenCalled();
        });

        it('should handle parsing errors gracefully', async () => {
            mockGenerateObject.mockRejectedValue(new Error('AI Error'));

            const result = await parserService.parseReceiptText('raw text', 'user-1');

            expect(result.merchant).toBe('Unknown Merchant');
            expect(result.amount).toBe(0);
            expect(result.confidence).toBe(0);
        });
    });
});
