"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";

const REJECTION_REASONS = [
  { value: "incorrect_category", label: "Incorrect Category" },
  { value: "too_generic", label: "Too Generic" },
  { value: "wrong_merchant", label: "Wrong Merchant" },
  { value: "other", label: "Other" },
];

const CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Travel",
  "Education",
  "Insurance",
  "Debt",
  "Savings",
  "Income",
  "Other",
];

interface AISuggestionFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    description: string;
    category: string;
  };
  aiSuggestion: {
    suggestedValue: string;
    confidenceScore: number;
  };
  onAccept: () => Promise<void>;
  onReject: (feedback: {
    correctCategory: string;
    reason: string;
    comment?: string;
  }) => Promise<void>;
}

/**
 * AI Suggestion Feedback Modal
 * Allows users to accept or reject AI categorization with feedback
 */
export function AISuggestionFeedbackModal({
  open,
  onOpenChange,
  transaction,
  aiSuggestion,
  onAccept,
  onReject,
}: AISuggestionFeedbackModalProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [correctCategory, setCorrectCategory] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const confidencePercent = Math.round(aiSuggestion.confidenceScore * 100);

  const handleAccept = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await onAccept();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept suggestion",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async () => {
    if (!correctCategory || !reason) {
      setError("Please select a correct category and reason");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onReject({
        correctCategory,
        reason,
        comment: comment.trim() || undefined,
      });
      onOpenChange(false);
      // Reset form
      setShowFeedbackForm(false);
      setCorrectCategory("");
      setReason("");
      setComment("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Categorization Suggestion
          </DialogTitle>
          <DialogDescription>
            Review the AI's categorization for this transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Info */}
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {transaction.description}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Current category:{" "}
              <span className="font-medium">{transaction.category}</span>
            </p>
          </div>

          {/* AI Suggestion */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  AI Suggested:
                </p>
                <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {aiSuggestion.suggestedValue}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Confidence
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {confidencePercent}%
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showFeedbackForm ? (
            // Initial choice
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleAccept}
                disabled={isSubmitting}
                className="w-full"
                variant="default"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Correct - Accept Suggestion
              </Button>

              <Button
                onClick={handleReject}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Incorrect - Provide Feedback
              </Button>
            </div>
          ) : (
            // Feedback form
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correct-category">Correct Category *</Label>
                <Select
                  value={correctCategory}
                  onValueChange={setCorrectCategory}
                >
                  <SelectTrigger id="correct-category">
                    <SelectValue placeholder="Select the correct category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why was this incorrect? *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REJECTION_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Additional details (optional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="E.g., This is my rent payment, not a transportation expense"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-slate-500">
                  {comment.length}/500 characters
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFeedbackForm(false)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !correctCategory || !reason}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
