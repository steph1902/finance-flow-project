/**
 * Premium Typography System (2025)
 * Primary: Inter (clean, modern, excellent readability)
 * Display: Inter (temporary - Shippori Mincho B1 disabled due to Turbopack font loading)
 */

import { Inter } from "next/font/google";

// Inter - Primary sans-serif with excellent readability
// Used for all UI, body text, and navigation
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// TODO: Re-enable Shippori Mincho B1 after Turbopack font loading is fixed
// const shipporiMincho = Shippori_Mincho_B1({
//   subsets: ["latin"],  
//   variable: "--font-shippori",
//   display: "swap",
//   weight: ["400", "500", "600", "700", "800"],
// });

export const fontInter = inter;
export const fontShippori = inter; // Temporary: using Inter instead of Shippori
