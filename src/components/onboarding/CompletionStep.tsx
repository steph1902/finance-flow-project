"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2Icon, SparklesIcon } from "lucide-react";

interface CompletionStepProps {
  onComplete: () => void;
  summary: {
    budgetCount: number;
    hasGoal: boolean;
    totalBudget: number;
  };
}

export function CompletionStep({ onComplete, summary }: CompletionStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="p-4 bg-green-500/10 rounded-full">
          <CheckCircle2Icon className="size-16 text-green-500" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          You&apos;re All Set!{" "}
          <SparklesIcon className="size-8 text-yellow-500" />
        </h1>
        <p className="text-lg text-muted-foreground">
          Your FinanceFlow account is ready to go
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>What You&apos;ve Set Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Monthly Budgets</span>
            <span className="font-semibold">
              {summary.budgetCount} categories
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Budget</span>
            <span className="font-semibold">
              ${summary.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Financial Goals</span>
            <span className="font-semibold">
              {summary.hasGoal ? "1 goal" : "None yet"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold mb-2">🚀 Next Steps</h3>
        <ul className="text-sm text-left space-y-2 text-muted-foreground">
          <li>• Add your first transaction to start tracking</li>
          <li>• Connect bank accounts for automatic imports (optional)</li>
          <li>• Explore AI-powered insights and categorization</li>
          <li>• Set up recurring transactions for bills and income</li>
        </ul>
      </div>

      <Button size="lg" onClick={onComplete} className="mt-6">
        Go to Dashboard
      </Button>
    </div>
  );
}
