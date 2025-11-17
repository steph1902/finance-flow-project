import { CATEGORIES } from '../config';

export interface TransactionInput {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  merchant?: string;
  date?: string;
}

export interface CategorizationResponse {
  category: string;
  subcategory?: string | undefined;
  confidence: number;
  reasoning: string;
}

export function createCategorizationPrompt(input: TransactionInput): string {
  const categories = CATEGORIES[input.type];
  const categoryList = categories.join(', ');

  return `You are a financial transaction categorization expert. Analyze the following transaction and suggest the most appropriate category.

Transaction Details:
- Description: ${input.description}
- Amount: $${input.amount}
- Type: ${input.type}
${input.merchant ? `- Merchant: ${input.merchant}` : ''}
${input.date ? `- Date: ${input.date}` : ''}

Available Categories:
${categoryList}

Instructions:
1. Choose the MOST appropriate category from the list above
2. Provide a subcategory if applicable
3. Give a confidence score between 0 and 1
4. Provide brief reasoning

Respond with JSON in this exact format:
{
  "category": "exact category name from the list",
  "subcategory": "specific subcategory or null",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}

Consider:
- Merchant name patterns and common businesses
- Transaction amount ranges typical for categories
- Keywords in the description
- Common spending patterns

Respond ONLY with the JSON, no other text.`;
}

export const CATEGORIZATION_SCHEMA = `{
  "category": "string (must be from provided list)",
  "subcategory": "string or null",
  "confidence": "number between 0 and 1",
  "reasoning": "string (brief explanation)"
}`;
