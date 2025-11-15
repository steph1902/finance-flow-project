export const AI_CONFIG = {
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  model: process.env.AI_MODEL_VERSION || 'gemini-1.5-flash',
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2048'),
  topP: 0.8,
  topK: 40,
  autoAcceptThreshold: parseFloat(process.env.AI_AUTO_ACCEPT_THRESHOLD || '0'), // 0 = manual approval required
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
