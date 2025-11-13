"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * ThemeToggle component with SSR hydration support.
 * Note: The setState in useEffect pattern here is intentional and required
 * for proper SSR/hydration with next-themes. This is a well-known pattern
 * and the warning can be safely ignored for this specific use case.
 */
export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is the recommended pattern from next-themes documentation
    // for avoiding hydration mismatch
    setMounted(true);
  }, []);

  // Show a neutral state during SSR/hydration
  if (!mounted) {
    return (
      <Button variant="secondary" size="icon" className="rounded-full" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

