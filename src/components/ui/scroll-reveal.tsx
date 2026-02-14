/**
 * ScrollReveal - Progressive disclosure component
 * Reveals content at specific scroll thresholds for storytelling
 */

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  threshold?: number; // 0 to 1 (viewport position to trigger)
  delay?: number;
  className?: string;
  variant?: "fade" | "fadeUp" | "scale" | "slideLeft" | "slideRight";
}

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
};

export function ScrollReveal({
  children,
  threshold = 0.2,
  delay = 0,
  className,
  variant = "fadeUp",
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: threshold,
        margin: "-50px",
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // zen easing
      }}
      variants={variants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
