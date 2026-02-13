export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
] as const;

export const TRANSACTION_TYPE_OPTIONS = [
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
] as const;

export function getCategoriesForType(type: "INCOME" | "EXPENSE"): readonly string[] {
  return type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

