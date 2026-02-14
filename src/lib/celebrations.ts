/**
 * Celebration utilities for delightful micro-interactions
 * Using pure CSS animations and haptic feedback (no external dependencies)
 */

/**
 * Haptic feedback patterns (mobile)
 */
export const haptics = {
  /**
   * Success vibration
   */
  success() {
    if ("vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },

  /**
   * Error vibration
   */
  error() {
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  },

  /**
   * Subtle tap
   */
  tap() {
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
  },

  /**
   * Celebration pattern
   */
  celebrate() {
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  },

  /**
   * Light feedback
   */
  light() {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },
};

/**
 * Create floating emoji animation as visual celebration
 */
export function celebrateWithEmoji(emoji: string, container?: HTMLElement) {
  const target = container || document.body;
  const emojiEl = document.createElement("div");
  emojiEl.textContent = emoji;
  emojiEl.style.cssText = `
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    animation: celebrate-bounce 0.6s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  `;

  // Add animation keyframes if not already added
  if (!document.querySelector("#celebrate-keyframes")) {
    const style = document.createElement("style");
    style.id = "celebrate-keyframes";
    style.textContent = `
      @keyframes celebrate-bounce {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -60%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -80%) scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  target.appendChild(emojiEl);
  setTimeout(() => emojiEl.remove(), 600);

  // Trigger haptic
  haptics.celebrate();
}

/**
 * Quick celebration shortcuts
 */
export const celebrations = {
  firstTransaction: () => celebrateWithEmoji("🎉"),
  budgetSuccess: () => celebrateWithEmoji("🏆"),
  goalReached: () => celebrateWithEmoji("💰"),
  streak: () => celebrateWithEmoji("🔥"),
  goodJob: () => celebrateWithEmoji("✨"),
};
