export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string | null;
  notes?: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionFilters = {
  page?: number;
  limit?: number;
  type?: TransactionType | "ALL" | undefined;
  category?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  search?: string | undefined;
  sort?: "date" | "amount";
  order?: "asc" | "desc";
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type DashboardSummary = {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  transactionCount: number;
};

export type SpendingByCategory = {
  category: string;
  amount: number;
};

export type DailyTrendPoint = {
  date: string;
  income: number;
  expenses: number;
};

export type RecentTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string | null;
  notes?: string | null;
  date: string;
};

export type DashboardStats = {
  summary: DashboardSummary;
  spendingByCategory: SpendingByCategory[];
  dailyTrend: DailyTrendPoint[];
  recentTransactions: RecentTransaction[];
  period: {
    start: string;
    end: string;
  };
};

export type Budget = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  spent?: number;
  remaining?: number;
  progress?: number;
};

export type BudgetFilters = {
  month?: number;
  year?: number;
};

// AI-related types
export type AISuggestion = {
  id: string;
  user_id: string;
  transaction_id?: string;
  suggestion_type: 'category' | 'insight' | 'recommendation';
  suggested_value: string;
  confidence_score: number;
  accepted?: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  session_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type CategorySuggestion = {
  category: string;
  subcategory?: string;
  confidence: number;
  reasoning: string;
};

export type InsightType = 'spending_alert' | 'trend' | 'recommendation' | 'achievement';
export type InsightSeverity = 'info' | 'warning' | 'critical';

export type Insight = {
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  message: string;
  category?: string;
  amount?: number;
  recommendation?: string;
};

