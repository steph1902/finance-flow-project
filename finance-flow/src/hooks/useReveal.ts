/**
 * useReveal - Custom hook for scroll-based reveal animations
 * Respects reduced-motion preferences
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface UseRevealOptions {
  once?: boolean;
  delay?: number;
}

export function useReveal(options: UseRevealOptions = {}) {
  const { once = true, delay = 0 } = options;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once });
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (!isInView || hasRevealed) return;

    const timer = setTimeout(() => {
      setHasRevealed(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, hasRevealed, delay]);

  return { ref, isInView: hasRevealed };
}
