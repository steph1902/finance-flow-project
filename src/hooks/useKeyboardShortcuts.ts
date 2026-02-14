"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keyboard shortcuts for better UX
 */
export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      const isInput =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement;

      // Don't trigger shortcuts when typing in forms
      if (isInput) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + K: Search/Command palette (prevent default browser search)
      if (modKey && event.key === "k") {
        event.preventDefault();
        // TODO: Open command palette when implemented
        console.log("Command palette shortcut triggered");
      }

      // Simple shortcuts (no modifier)
      switch (event.key.toLowerCase()) {
        case "g":
          // g + d: Dashboard
          setTimeout(() => {
            const nextKey = new Promise((resolve) => {
              const handler = (e: KeyboardEvent) => {
                resolve(e.key);
                window.removeEventListener("keydown", handler);
              };
              window.addEventListener("keydown", handler);
              setTimeout(() => {
                window.removeEventListener("keydown", handler);
                resolve(null);
              }, 1000);
            });

            nextKey.then((key) => {
              if (key === "d") router.push("/dashboard");
              if (key === "t") router.push("/transactions");
              if (key === "b") router.push("/budgets");
              if (key === "g") router.push("/goals");
            });
          }, 0);
          break;

        case "c":
          // c: Create transaction (when not in form)
          if (!modKey) {
            router.push("/transactions?action=new");
          }
          break;

        case "?":
          // ?: Show keyboard shortcuts help
          event.preventDefault();
          // TODO: Show shortcuts modal
          console.log("Shortcuts help triggered");
          break;
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);
}

/**
 * Keyboard shortcut hints component
 */
export const KEYBOARD_SHORTCUTS = [
  {
    category: "Navigation",
    shortcuts: [
      { keys: ["g", "d"], description: "Go to Dashboard" },
      { keys: ["g", "t"], description: "Go to Transactions" },
      { keys: ["g", "b"], description: "Go to Budgets" },
      { keys: ["g", "g"], description: "Go to Goals" },
    ],
  },
  {
    category: "Actions",
    shortcuts: [
      { keys: ["c"], description: "Create Transaction" },
      { keys: ["Cmd/Ctrl", "K"], description: "Search/Command Palette" },
    ],
  },
  {
    category: "Help",
    shortcuts: [{ keys: ["?"], description: "Show Keyboard Shortcuts" }],
  },
];
