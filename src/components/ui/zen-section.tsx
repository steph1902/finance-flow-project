/**
 * ZenSection - Semantic section component with vertical rhythm
 * Implements Japanese ma (間) spacing for breathing room
 */

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export type ZenSectionSpacing = "none" | "sm" | "md" | "lg" | "xl" | "epic";

interface ZenSectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: ZenSectionSpacing;
  background?: "default" | "muted" | "card" | "glass";
}

const spacingClasses: Record<ZenSectionSpacing, string> = {
  none: "",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16 lg:py-20",
  lg: "py-16 md:py-24 lg:py-32",
  xl: "py-24 md:py-32 lg:py-40",
  epic: "py-32 md:py-40 lg:py-48",
};

const backgroundClasses = {
  default: "bg-background",
  muted: "bg-muted/30",
  card: "bg-card",
  glass: "bg-background/80 backdrop-blur-zen",
};

export const ZenSection = forwardRef<HTMLElement, ZenSectionProps>(
  (
    { spacing = "md", background = "default", className, children, ...props },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          spacingClasses[spacing],
          backgroundClasses[background],
          "relative",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

ZenSection.displayName = "ZenSection";
