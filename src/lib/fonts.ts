/**
 * Premium Typography System (2025)
 * Primary: Inter (clean, modern, excellent readability)
 * Display: Playfair Display (elegant serif for headings)
 */

import { Inter, Playfair_Display } from "next/font/google";

// Inter - Primary sans-serif with excellent readability
// Used for all UI, body text, and navigation
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Playfair Display - Elegant serif for headings
// Gives that luxury, premium feel for Japanese zen aesthetic
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const fontInter = inter;
export const fontPlayfair = playfair;
