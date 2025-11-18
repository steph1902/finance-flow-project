import { ENV } from '@/lib/env';

/**
 * ⚠️ VERCEL BUILD FIX:
 * AI_CONFIG now uses getters for lazy evaluation.
 * This prevents accessing ENV values during build time.
 */
export const AI_CONFIG = {
  get apiKey() { return ENV.GEMINI_API_KEY; },
  get model() { return ENV.AI_MODEL_VERSION; },
  get temperature() { return parseFloat(ENV.AI_TEMPERATURE); },
  get maxTokens() { return parseInt(ENV.AI_MAX_TOKENS); },
  topP: 0.8,
  topK: 40,
  get autoAcceptThreshold() { return parseFloat(ENV.AI_AUTO_ACCEPT_THRESHOLD); },
} as const;

export const CATEGORIES = {
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Housing',
    'Insurance',
    'Other',
  ],
  income: [
    'Salary',
    'Freelance',
    'Investment',
    'Gift',
    'Refund',
    'Business',
    'Other',
  ],
} as const;

export const SUBCATEGORIES = {
  'Food & Dining': ['Restaurants', 'Coffee & Cafes', 'Groceries', 'Fast Food', 'Delivery'],
  'Transportation': ['Gas', 'Public Transit', 'Parking', 'Ride Share', 'Auto Maintenance'],
  'Shopping': ['Clothing', 'Electronics', 'Home & Garden', 'Online Shopping', 'Gifts'],
  'Entertainment': ['Movies', 'Music', 'Games', 'Sports', 'Hobbies'],
  'Bills & Utilities': ['Electric', 'Water', 'Internet', 'Phone', 'Streaming Services'],
  'Healthcare': ['Doctor', 'Pharmacy', 'Insurance', 'Dental', 'Vision'],
  'Education': ['Tuition', 'Books', 'Courses', 'Supplies'],
  'Travel': ['Flights', 'Hotels', 'Vacation', 'Car Rental'],
  'Personal Care': ['Haircut', 'Spa', 'Gym', 'Beauty Products'],
  'Housing': ['Rent', 'Mortgage', 'HOA Fees', 'Repairs'],
  'Insurance': ['Auto', 'Home', 'Life', 'Health'],
} as const;

export type ExpenseCategory = typeof CATEGORIES.expense[number];
export type IncomeCategory = typeof CATEGORIES.income[number];
export type Category = ExpenseCategory | IncomeCategory;
