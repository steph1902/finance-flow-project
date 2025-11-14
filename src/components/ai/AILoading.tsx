"use client";

import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AILoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AILoading({ 
  message = "AI is analyzing...", 
  size = "md",
  className 
}: AILoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Sparkles className={cn(sizeClasses[size], "text-primary animate-pulse")} />
        <Loader2 className={cn(sizeClasses[size], "absolute inset-0 animate-spin text-primary/30")} />
      </div>
      <span className={cn("text-muted-foreground", textSizeClasses[size])}>
        {message}
      </span>
    </div>
  );
}
