/**
 * ZenContainer - Layout container with Japanese ma (間) spacing principles
 * Provides consistent max-width and horizontal padding across breakpoints
 */

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export type ZenContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ZenContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ZenContainerSize;
  centered?: boolean;
}

const sizeClasses: Record<ZenContainerSize, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1600px]",
  full: "max-w-full",
};

export const ZenContainer = forwardRef<HTMLDivElement, ZenContainerProps>(
  ({ size = "xl", centered = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          centered && "mx-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ZenContainer.displayName = "ZenContainer";
