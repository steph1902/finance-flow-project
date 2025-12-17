/**
 * ScrollProgress - Premium scroll progress indicator
 * Displays reading progress at top of page (Apple/Medium style)
 */

"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  color?: string;
  height?: number;
}

export function ScrollProgress({ 
  color = "hsl(var(--primary))", 
  height = 3 
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  
  // Add spring physics for smooth, natural motion
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 origin-left"
      style={{
        scaleX,
        height: `${height}px`,
        backgroundColor: color,
      }}
    />
  );
}
