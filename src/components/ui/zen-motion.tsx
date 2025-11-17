/**
 * ZenMotion - Subtle animation wrapper using Framer Motion
 * Implements Japanese ma (間) principles in motion design
 * Supports reduced-motion preferences
 */

"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

export type ZenMotionVariant = "fadeIn" | "fadeInUp" | "fadeInDown" | "scaleIn" | "slideInRight" | "none";

export interface ZenMotionProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit"> {
  variant?: ZenMotionVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
}

const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

export const ZenMotion = forwardRef<HTMLDivElement, ZenMotionProps>(
  ({ variant = "fadeIn", delay = 0, duration = 0.5, once = true, children, ...props }, ref) => {
    const selectedVariant = motionVariants[variant];

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        transition={{
          duration,
          delay,
          ease: [0.4, 0.0, 0.2, 1], // zen easing
        }}
        variants={selectedVariant}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ZenMotion.displayName = "ZenMotion";
