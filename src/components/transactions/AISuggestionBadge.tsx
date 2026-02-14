"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestionBadgeProps {
  category: string;
  confidence?: number;
  className?: string;
  showConfidence?: boolean;
}

/**
 * AI Suggestion Badge
 * Displays when a transaction was categorized by AI
 */
export function AISuggestionBadge({
  category,
  confidence,
  className,
  showConfidence = true,
}: AISuggestionBadgeProps) {
  // Don't show if no confidence score (not AI-suggested)
  if (!confidence && showConfidence) return null;

  const confidencePercent = confidence ? Math.round(confidence * 100) : 0;

  // Color based on confidence level
  const getVariant = () => {
    if (confidencePercent >= 90) return "default"; // High confidence - blue
    if (confidencePercent >= 75) return "secondary"; // Medium - gray
    return "outline"; // Low confidence - outlined
  };

  return (
    <Badge
      variant={getVariant()}
      className={cn("gap-1 text-xs font-normal", className)}
    >
      <Sparkles className="h-3 w-3" />
      <span>AI: {category}</span>
      {showConfidence && confidence && (
        <span className="opacity-70">({confidencePercent}%)</span>
      )}
    </Badge>
  );
}
