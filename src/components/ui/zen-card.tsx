/**
 * ZenCard - Elevated card component with Japanese minimalist aesthetic
 * Supports glass morphism, soft shadows, and subtle borders
 */

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export type ZenCardVariant = "default" | "glass" | "outlined" | "elevated";

interface ZenCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ZenCardVariant;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses: Record<ZenCardVariant, string> = {
  default: "bg-card border border-border shadow-card",
  glass: "bg-card/80 backdrop-blur-zen border border-border/50 shadow-glass",
  outlined: "bg-transparent border-2 border-border",
  elevated: "bg-card border border-border shadow-floating",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const ZenCard = forwardRef<HTMLDivElement, ZenCardProps>(
  (
    {
      variant = "default",
      hoverable = false,
      padding = "md",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-smooth ease-zen",
          variantClasses[variant],
          paddingClasses[padding],
          hoverable &&
            "hover:shadow-mist hover:scale-[1.02] hover:border-primary/20",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ZenCard.displayName = "ZenCard";
