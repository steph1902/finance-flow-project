import type { Metadata } from "next";

/**
 * SEO & Metadata Configuration
 *
 * Centralized metadata for better SEO across the application
 */

export const siteConfig = {
  name: "FinanceFlow",
  description:
    "AI-Powered Personal Finance Management Platform - Track expenses, manage budgets, and achieve financial goals with intelligent insights.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://financeflow.app",
  ogImage: "/og-image.png",
  author: "FinanceFlow Team",
  keywords: [
    "personal finance",
    "budget tracker",
    "expense management",
    "financial planning",
    "money management",
    "AI finance",
    "budget app",
    "finance automation",
    "spending tracker",
    "financial goals",
  ],
  twitter: {
    handle: "@financeflow",
    site: "@financeflow",
    cardType: "summary_large_image",
  },
} as const;

/**
 * Generate metadata for pages
 */
export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.twitter.handle,
      site: siteConfig.twitter.site,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
  };
}

/**
 * JSON-LD structured data for rich snippets
 */
export function generateJsonLd(
  type: "WebApplication" | "Organization" | "WebPage",
  data?: Record<string, unknown>,
) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  };

  if (type === "WebApplication") {
    return {
      ...baseSchema,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      ...data,
    };
  }

  if (type === "Organization") {
    return {
      ...baseSchema,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      sameAs: [
        "https://twitter.com/financeflow",
        "https://github.com/financeflow",
      ],
      ...data,
    };
  }

  return {
    ...baseSchema,
    ...data,
  };
}
