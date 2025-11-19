import { TransactionType, RecurringFrequency } from "@prisma/client";
import { z } from "zod";

// ============================================
// TRANSACTION SCHEMAS
// ============================================

export const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(999999.99, "Amount is too large"),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1, "Category is required").max(100),
  description: z
    .string()
    .max(191, "Description must be 191 characters or less")
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .nullable(),
  date: z.coerce.date(),
});

export const transactionUpdateSchema = transactionSchema.partial();

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  type: z.nativeEnum(TransactionType).optional(),
  category: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(),
  sort: z.enum(["date", "amount"]).default("date"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// BUDGET SCHEMAS
// ============================================

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required").max(100),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(999999.99, "Amount is too large"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export const budgetUpdateSchema = budgetSchema.partial({
  category: true,
  month: true,
  year: true,
});

export const budgetQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

// ============================================
// RECURRING TRANSACTION SCHEMAS
// ============================================

export const recurringTransactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(999999.99, "Amount is too large"),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1, "Category is required").max(100),
  description: z
    .string()
    .max(191, "Description must be 191 characters or less")
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .nullable(),
  frequency: z.nativeEnum(RecurringFrequency),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  nextDate: z.coerce.date(),
  isActive: z.boolean().default(true),
});

export const recurringTransactionUpdateSchema = recurringTransactionSchema.partial();

// ============================================
// AI SERVICE SCHEMAS
// ============================================

export const categorizationResponseSchema = z.object({
  category: z.string(),
  subcategory: z.string().optional(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export const insightSchema = z.object({
  type: z.enum(["spending_alert", "trend", "recommendation", "achievement"]),
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string(),
  message: z.string(),
  category: z.string().nullable(),
  amount: z.number().nullable(),
  recommendation: z.string().nullable(),
});

export const forecastResponseSchema = z.object({
  months: z.array(z.object({
    month: z.number().int().min(1).max(12),
    year: z.number().int(),
    totalIncome: z.number(),
    totalExpense: z.number(),
    netBalance: z.number(),
    categories: z.array(z.object({
      category: z.string(),
      type: z.enum(["INCOME", "EXPENSE"]),
      projected: z.number(),
      historical: z.number(),
      trend: z.enum(["increasing", "decreasing", "stable"]),
      confidence: z.number().min(0).max(1),
      explanation: z.string(),
    })),
  })),
  totalProjected: z.number(),
  totalIncome: z.number(),
  totalExpense: z.number(),
  confidence: z.number().min(0).max(1),
  methodology: z.string(),
  insights: z.array(z.string()),
  generatedAt: z.string().datetime(),
});

export const budgetOptimizationResponseSchema = z.object({
  suggestions: z.array(z.object({
    fromCategory: z.string(),
    toCategory: z.string(),
    amount: z.number(),
    reason: z.string(),
    impact: z.string(),
    priority: z.enum(["high", "medium", "low"]),
  })),
  totalSavings: z.number(),
  confidence: z.number().min(0).max(1),
  analysis: z.object({
    overBudget: z.array(z.object({
      category: z.string(),
      budget: z.number(),
      actual: z.number(),
      variance: z.number(),
    })),
    underBudget: z.array(z.object({
      category: z.string(),
      budget: z.number(),
      actual: z.number(),
      variance: z.number(),
    })),
    balanced: z.array(z.object({
      category: z.string(),
      budget: z.number(),
      actual: z.number(),
    })),
  }),
  insights: z.array(z.string()),
  generatedAt: z.string().datetime(),
});

// ============================================
// AUTH SCHEMAS
// ============================================

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ============================================
// RECEIPT SCANNING SCHEMAS
// ============================================

export const receiptScanRequestSchema = z.object({
  image: z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, "Invalid image format"),
});

export const receiptScanResponseSchema = z.object({
  merchant: z.string().optional(),
  amount: z.number().positive(),
  date: z.coerce.date(),
  category: z.string(),
  subcategory: z.string().optional(),
  confidence: z.number().min(0).max(1),
  items: z.array(z.object({
    description: z.string(),
    amount: z.number(),
  })).optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionFilters = z.infer<typeof transactionQuerySchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type RecurringTransactionInput = z.infer<typeof recurringTransactionSchema>;
export type CategorizationResponse = z.infer<typeof categorizationResponseSchema>;
export type Insight = z.infer<typeof insightSchema>;
export type ForecastResponse = z.infer<typeof forecastResponseSchema>;
export type BudgetOptimizationResponse = z.infer<typeof budgetOptimizationResponseSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ReceiptScanRequest = z.infer<typeof receiptScanRequestSchema>;
export type ReceiptScanResponse = z.infer<typeof receiptScanResponseSchema>;

