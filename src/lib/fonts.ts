/**
 * Premium Typography System (2025)
 * Primary: Inter (clean, modern, excellent readability)
 * Display: Shippori Mincho B1 (Japanese refinement)
 */

import { Inter, Shippori_Mincho_B1 } from "next/font/google";

// Inter - Primary sans-serif with excellent readability
// Used for all UI, body text, and navigation
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Shippori Mincho B1 - Japanese serif for display/headings
// Used for hero headlines and special emphasis
const shipporiMincho = Shippori_Mincho_B1({
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const fontInter = inter;
export const fontShippori = shipporiMincho;
