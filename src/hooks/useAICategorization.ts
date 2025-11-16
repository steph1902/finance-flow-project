"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { CategorySuggestion } from "@/types";
import { logError } from "@/lib/logger";

interface UseAICategorizationProps {
  description?: string;
  amount?: number;
  type?: "income" | "expense";
  merchant?: string;
}

interface UseAICategorizationReturn {
  suggestion: CategorySuggestion | null;
  isLoading: boolean;
  error: string | null;
  getSuggestion: () => Promise<void>;
  clearSuggestion: () => void;
  acceptSuggestion: () => CategorySuggestion | null;
}

export function useAICategorization({
  description,
  amount,
  type,
  merchant,
}: UseAICategorizationProps = {}): UseAICategorizationReturn {
  const [suggestion, setSuggestion] = useState<CategorySuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = useCallback(async () => {
    if (!description || !amount || !type) {
      setError("Missing required fields for AI categorization");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          amount,
          type,
          merchant,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI suggestion");
      }

      const data: CategorySuggestion = await response.json();
      setSuggestion(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(`AI categorization failed: ${errorMessage}`);
      logError("AI categorization error", err, { description, amount, type });
    } finally {
      setIsLoading(false);
    }
  }, [description, amount, type, merchant]);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
    setError(null);
  }, []);

  const acceptSuggestion = useCallback(() => {
    if (!suggestion) return null;
    const accepted = { ...suggestion };
    clearSuggestion();
    return accepted;
  }, [suggestion, clearSuggestion]);

  return {
    suggestion,
    isLoading,
    error,
    getSuggestion,
    clearSuggestion,
    acceptSuggestion,
  };
}
