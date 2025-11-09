import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1, "Category is required"),
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
  date: z.coerce.date({ invalid_type_error: "Date is invalid" }),
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

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
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

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionFilters = z.infer<typeof transactionQuerySchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;

