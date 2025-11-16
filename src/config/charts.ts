/**
 * Chart Configuration
 * 
 * Centralized chart settings including colors, dimensions, and default options.
 * Uses Tailwind color palette for theme consistency.
 */

/**
 * Chart color palette using Tailwind design system colors
 * Matches the colors defined in tailwind.config.ts
 */
export const CHART_COLORS = [
  "#3B82F6", // primary-500 - blue
  "#10B981", // success-500 - green
  "#F59E0B", // warning-500 - amber
  "#EF4444", // danger-500 - red
  "#8B5CF6", // purple-500
  "#14B8A6", // teal-500
  "#F97316", // orange-500
  "#EC4899", // pink-500
] as const;

/**
 * Get color by index, wrapping around if index exceeds array length
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0];
}

/**
 * Chart default dimensions and spacing
 */
export const CHART_DIMENSIONS = {
  pieChart: {
    innerRadius: 60,
    outerRadius: 100,
    paddingAngle: 2,
  },
  barChart: {
    barSize: 40,
    barGap: 8,
  },
  lineChart: {
    strokeWidth: 2,
    dotRadius: 4,
  },
} as const;

/**
 * Chart animation configuration
 */
export const CHART_ANIMATION = {
  duration: 800,
  easing: "ease-out",
} as const;
