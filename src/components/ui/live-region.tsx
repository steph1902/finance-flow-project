/**
 * LiveRegion component for screen reader announcements
 * WCAG SC 4.1.3 - Status Messages
 */

import { useEffect, useState } from "react";

type LiveRegionProps = {
  message: string;
  politeness?: "polite" | "assertive" | "off";
  clearAfter?: number; // auto-clear message after X milliseconds
};

export function LiveRegion({
  message,
  politeness = "polite",
  clearAfter,
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setCurrentMessage("");
      }, clearAfter);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
}

type LiveRegionContainerProps = {
  children: React.ReactNode;
};

/**
 * Container for live regions, typically placed at the root of the app
 */
export function LiveRegionContainer({ children }: LiveRegionContainerProps) {
  return (
    <div aria-live="polite" aria-atomic="false" className="sr-only">
      {children}
    </div>
  );
}
