import { z } from "zod";

export const parsedReceiptSchema = z.object({
  merchant: z.string(),
  amount: z.number().positive(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format: must be YYYY-MM-DD"),
  category: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number().optional(),
        price: z.number().optional(),
      }),
    )
    .optional(),
  confidence: z.number().min(0).max(1),
  rawData: z
    .object({
      total: z.string().optional(),
      subtotal: z.string().optional(),
      tax: z.string().optional(),
      tip: z.string().optional(),
    })
    .optional(),
});

export type ParsedReceipt = z.infer<typeof parsedReceiptSchema>;

export const RECEIPT_PARSER_SCHEMA = JSON.stringify({
  type: "object",
  properties: {
    merchant: { type: "string" },
    amount: { type: "number" },
    date: { type: "string", description: "YYYY-MM-DD" },
    category: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          quantity: { type: "number" },
          price: { type: "number" },
        },
      },
    },
    confidence: { type: "number" },
    rawData: {
      type: "object",
      properties: {
        total: { type: "string" },
        subtotal: { type: "string" },
        tax: { type: "string" },
        tip: { type: "string" },
      },
    },
  },
  required: ["merchant", "amount", "date", "confidence"],
});

export const createReceiptParserPrompt = (ocrText: string): string => {
  return `You are an expert at parsing receipt data. Extract structured information from this receipt text.

Receipt Text:
${ocrText}

Extract the following information:
1. merchant: The store/business name
2. amount: Total purchase amount as a number
3. date: Transaction date in ISO format YYYY-MM-DD (use today's date ${new Date().toISOString().split("T")[0]} if missing)
4. items: Array of purchased items
5. rawData: Object with total, subtotal, tax, tip (as strings)
6. confidence: Your confidence in the extraction (0-1)

Rules:
- If merchant name is unclear, extract the most prominent business name or location
- Amount should be the final TOTAL
- Date format: YYYY-MM-DD`;
};
