/**
 * ZenButton - Minimalist button with Japanese-inspired design
 * Extends shadcn/ui Button with custom variants
 */

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const zenButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-smooth ease-zen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-card",
        // Mapping legacy variants to standard palette
        indigo:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-card", // Mapped to primary (Desert Clay)
        gold:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90 hover:shadow-card", // Mapped to secondary (Light Stone)
        outline:
          "border-2 border-border bg-transparent hover:bg-accent hover:border-primary/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glass:
          "bg-card/50 backdrop-blur-zen border border-border/50 hover:bg-card/80 hover:border-border",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
        success:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90", // Mapped to primary
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ZenButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof zenButtonVariants> {
  asChild?: boolean;
}

export const ZenButton = forwardRef<HTMLButtonElement, ZenButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(zenButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

ZenButton.displayName = "ZenButton";
