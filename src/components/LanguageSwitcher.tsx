"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";

    // Create new path with correct locale
    const segments = pathname.split("/");
    segments[1] = newLocale; // Replace locale segment
    const newPath = segments.join("/");

    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-secondary/50"
      aria-label={`Switch to ${locale === "en" ? "Japanese" : "English"}`}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "en" ? "日本語" : "English"}</span>
    </button>
  );
}
