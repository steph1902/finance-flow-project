/**
 * StaggerContainer - Container for staggered list animations
 * Creates elegant sequential animations for child elements
 */

"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

export interface StaggerContainerProps extends Omit<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "viewport"
> {
  staggerDelay?: number;
  once?: boolean;
  enableViewport?: boolean;
}

export const StaggerContainer = forwardRef<
  HTMLDivElement,
  StaggerContainerProps
>(
  (
    {
      staggerDelay = 0.1,
      once = true,
      enableViewport = true,
      children,
      ...props
    },
    ref,
  ) => {
    const variantsWithDelay = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    };

    if (enableViewport) {
      return (
        <motion.div
          ref={ref}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, margin: "-50px" }}
          variants={variantsWithDelay}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={variantsWithDelay}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

StaggerContainer.displayName = "StaggerContainer";

/**
 * StaggerItem - Child element for staggered animations
 * Use inside StaggerContainer
 */

export interface StaggerItemProps extends Omit<
  HTMLMotionProps<"div">,
  "variants"
> {
  variant?: "fadeIn" | "fadeInUp" | "scaleIn" | "slideInRight";
}

const itemVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const },
    },
  },
};

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ variant = "fadeInUp", children, ...props }, ref) => {
    return (
      <motion.div ref={ref} variants={itemVariants[variant]} {...props}>
        {children}
      </motion.div>
    );
  },
);

StaggerItem.displayName = "StaggerItem";
