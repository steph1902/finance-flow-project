"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBankIcon, PlusIcon, TrashIcon } from "lucide-react"
import { EXPENSE_CATEGORIES } from "@/constants/categories"

interface BudgetSetupStepProps {
  onNext: (data: BudgetData[]) => void;
  onBack: () => void;
  initialData?: BudgetData[];
}

export interface BudgetData {
  category: string;
  amount: number;
}

export function BudgetSetupStep({ onNext, onBack, initialData }: BudgetSetupStepProps) {
  const [budgets, setBudgets] = useState<BudgetData[]>(
    initialData?.length
      ? initialData
      : [
        { category: 'Food', amount: 500 },
        { category: 'Transportation', amount: 200 },
        { category: 'Entertainment', amount: 150 },
      ]
  );

  const handleAddBudget = () => {
    const usedCategories = budgets.map((b) => b.category);
    const availableCategory = EXPENSE_CATEGORIES.find(
      (cat) => !usedCategories.includes(cat)
    );

    if (availableCategory) {
      setBudgets([...budgets, { category: availableCategory, amount: 100 }]);
    }
  };

  const handleRemoveBudget = (index: number) => {
    setBudgets(budgets.filter((_, i) => i !== index));
  };

  const handleUpdateBudget = (index: number, field: keyof BudgetData, value: string | number) => {
    const updated = [...budgets];
    const current = updated[index];
    if (current) {
      updated[index] = { ...current, [field]: value };
      setBudgets(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validBudgets = budgets.filter((b) => b.amount > 0);
    onNext(validBudgets);
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !budgets.some((b) => b.category === cat)
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <PiggyBankIcon className="size-6 text-primary" />
          </div>
          <div>
            <CardTitle>Set Your Budgets</CardTitle>
            <CardDescription>
              Create monthly budgets for different categories (you can always adjust these later)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {budgets.map((budget, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`category-${index}`}>Category</Label>
                  <select
                    id={`category-${index}`}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={budget.category}
                    onChange={(e) => handleUpdateBudget(index, 'category', e.target.value)}
                  >
                    <option value={budget.category}>{budget.category}</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-40 space-y-2">
                  <Label htmlFor={`amount-${index}`}>Monthly Limit</Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={budget.amount}
                    onChange={(e) =>
                      handleUpdateBudget(index, 'amount', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveBudget(index)}
                  disabled={budgets.length === 1}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          {availableCategories.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddBudget}
              className="w-full"
            >
              <PlusIcon className="size-4 mr-2" />
              Add Another Budget
            </Button>
          )}

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-medium mb-1">Total Monthly Budget</p>
            <p className="text-2xl font-bold">
              ${budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
