"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";
import type { CategorySuggestion } from "@/types";

interface CategorySuggestionCardProps {
  suggestion: CategorySuggestion;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export function CategorySuggestionCard({
  suggestion,
  onAccept,
  onReject,
  isLoading = false,
}: CategorySuggestionCardProps) {
  const confidencePercent = Math.round(suggestion.confidence * 100);

  // Determine confidence level color
  const getConfidenceColor = () => {
    if (suggestion.confidence >= 0.8) return "text-green-600";
    if (suggestion.confidence >= 0.6) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (suggestion.confidence >= 0.8) return "default";
    if (suggestion.confidence >= 0.6) return "secondary";
    return "outline";
  };

  return (
    <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Suggestion
          </CardTitle>
          <Badge variant={getConfidenceVariant()} className={getConfidenceColor()}>
            {confidencePercent}% confident
          </Badge>
        </div>
        <CardDescription className="text-sm">
          Based on the transaction details
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Category</p>
          <p className="text-xl font-semibold">{suggestion.category}</p>
        </div>

        {suggestion.subcategory && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Subcategory</p>
            <p className="text-lg">{suggestion.subcategory}</p>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm font-medium text-muted-foreground mb-1">Why this category?</p>
          <p className="text-sm">{suggestion.reasoning}</p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          onClick={onAccept}
          disabled={isLoading}
          className="flex-1"
          size="sm"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Accept
        </Button>
        <Button
          onClick={onReject}
          disabled={isLoading}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Choose Manually
        </Button>
      </CardFooter>
    </Card>
  );
}
