/**
 * Animation Configuration
 *
 * Centralized animation constants for framer-motion animations across the app.
 * Provides consistent timing, delays, and easing for better UX.
 */

/**
 * Stagger animation delays
 * Used for sequential item animations (e.g., list items appearing one by one)
 */
export const STAGGER_DELAY = {
  /**
   * Fast stagger - for large lists (100+ items)
   * Prevents cumulative delay from becoming too long
   */
  fast: 0.02,

  /**
   * Medium stagger - for moderate lists (10-50 items)
   * Good balance between visible animation and total time
   */
  medium: 0.05,

  /**
   * Slow stagger - for small lists (< 10 items)
   * More noticeable animation for each item
   */
  slow: 0.1,

  /**
   * Maximum cumulative stagger duration (in seconds)
   * Prevents long lists from having excessive total animation time
   */
  maxDuration: 0.3,
} as const;

/**
 * Base animation durations (in seconds)
 */
export const DURATION = {
  /** Instant (effectively no animation) */
  instant: 0,

  /** Very fast - quick hover effects, tooltips */
  fastest: 0.15,

  /** Fast - modal open/close, dropdowns */
  fast: 0.2,

  /** Normal - most UI transitions */
  normal: 0.3,

  /** Slow - emphasized transitions */
  slow: 0.4,

  /** Very slow - dramatic effects, progress bars */
  slowest: 0.8,
} as const;

/**
 * Scale transformations for hover/active states
 */
export const SCALE = {
  /** Subtle scale up - buttons, cards */
  hoverUp: 1.02,

  /** Medium scale up - icons, badges */
  hoverUpMedium: 1.05,

  /** Large scale up - emphasized elements */
  hoverUpLarge: 1.1,

  /** Scale down - pressed/active state */
  active: 0.95,
} as const;

/**
 * Common easing functions
 */
export const EASING = {
  /** Default easing - most transitions */
  default: "ease-out",

  /** Smooth - fluid movements */
  smooth: [0.4, 0.0, 0.2, 1],

  /** Bounce - playful effects */
  bounce: [0.34, 1.56, 0.64, 1],

  /** Sharp - quick, snappy */
  sharp: [0.4, 0.0, 0.6, 1],
} as const;

/**
 * Common fade animations
 */
export const FADE = {
  /** Fade in from opacity 0 to 1 */
  in: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  /** Fade in and slide up */
  inUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  /** Fade in and slide down */
  inDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  /** Fade in and slide from left */
  inLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  /** Fade in and slide from right */
  inRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
} as const;

/**
 * Helper function to calculate stagger delay with maximum cap
 */
export function getStaggerDelay(
  index: number,
  delayPerItem: number = STAGGER_DELAY.medium,
): number {
  const delay = index * delayPerItem;
  return Math.min(delay, STAGGER_DELAY.maxDuration);
}

/**
 * Helper function to create transition config
 */
export function createTransition(
  duration: number = DURATION.normal,
  delay: number = 0,
  easing: string | number[] = EASING.default,
) {
  return {
    duration,
    delay,
    ease: easing,
  };
}
