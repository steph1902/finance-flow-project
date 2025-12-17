"use client";

import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onNewTransaction?: () => void;
  onSearch?: () => void;
  onNewBudget?: () => void;
  onSettings?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + N: New Transaction
      if ((event.metaKey || event.ctrlKey) && event.key === "n") {
        event.preventDefault();
        handlers.onNewTransaction?.();
      }

      // Cmd/Ctrl + K: Search/Command Palette
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        handlers.onSearch?.();
      }

      // Cmd/Ctrl + B: New Budget
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault();
        handlers.onNewBudget?.();
      }

      // Cmd/Ctrl + ,: Settings
      if ((event.metaKey || event.ctrlKey) && event.key === ",") {
        event.preventDefault();
        handlers.onSettings?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
