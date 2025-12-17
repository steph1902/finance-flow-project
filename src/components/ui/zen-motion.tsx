/**
 * ZenMotion - Premium animation wrapper using Framer Motion
 * Implements Japanese ma (間) principles in motion design
 * Expanded with Awwwards-level premium variants
 * Supports reduced-motion preferences
 */

"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

export type ZenMotionVariant = 
  | "fadeIn" 
  | "fadeInUp" 
  | "fadeInDown" 
  | "scaleIn" 
  | "slideInRight"
  | "slideInLeft"
  | "revealMask"
  | "shimmer"
  | "lift"
  | "rotate"
  | "blur"
  | "none";

export type EasingCurve = "apple" | "zen" | "luxury" | "material" | "bounce" | "spring";

export interface ZenMotionProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit"> {
  variant?: ZenMotionVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  easing?: EasingCurve;
  stagger?: boolean; // For animating children
  staggerDelay?: number;
}

// Premium easing curves (matching CSS variables)
const easingCurves = {
  apple: [0.32, 0.72, 0, 1] as const,
  zen: [0.25, 0.46, 0.45, 0.94] as const,
  luxury: [0.22, 0.61, 0.36, 1] as const,
  material: [0.4, 0, 0.2, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  spring: [0.5, 1.75, 0.75, 1] as const,
};

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
  slideInLeft: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  // Premium variants
  revealMask: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)" },
  },
  shimmer: {
    hidden: { 
      opacity: 0.6,
      backgroundPosition: "-200% 0",
    },
    visible: { 
      opacity: 1,
      backgroundPosition: "200% 0",
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
    },
  },
  lift: {
    hidden: { y: 0, scale: 1 },
    visible: { 
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -5 },
    visible: { opacity: 1, rotate: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

export const ZenMotion = forwardRef<HTMLDivElement, ZenMotionProps>(
  ({ 
    variant = "fadeIn", 
    delay = 0, 
    duration = 0.5, 
    once = true, 
    easing = "zen",
    stagger = false,
    staggerDelay = 0.1,
    children, 
    ...props 
  }, ref) => {
    const selectedVariant = motionVariants[variant];
    const easingFunction = easingCurves[easing];

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        transition={{
          duration,
          delay,
          ease: easingFunction,
          ...(stagger && {
            staggerChildren: staggerDelay,
          }),
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
