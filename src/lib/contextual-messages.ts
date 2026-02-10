/**
 * Contextual encouragement messages based on user behavior and time
 */

/**
 * Get time-based greeting
 */
export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 6) return "Burning the midnight oil? Your finances can wait till morning 😴";
    if (hour < 12) return "Good morning! Let's make your money work smarter today ☀️";
    if (hour < 17) return "Good afternoon! Quick check-in on your finances 👋";
    if (hour < 22) return "Good evening! Time to review today's spending 🌙";
    return "Still awake? Your budget will be here tomorrow 💤";
}

/**
 * Get savings rate encouragement
 */
export function getSavingsRateMessage(savingsRate: number): string {
    if (savingsRate >= 30) return "Whoa! You're saving like a pro! 🚀";
    if (savingsRate >= 20) return "Excellent discipline! You're building wealth 💎";
    if (savingsRate >= 10) return "Great progress! Keep it up 🎯";
    if (savingsRate >= 5) return "You're saving! Every bit counts 💪";
    return "Let's boost those savings - small wins matter! 🌱";
}

/**
 * Get budget status message
 */
export function getBudgetStatusMessage(usage: number): string {
    if (usage < 50) return "Plenty of runway left! Nice restraint 🎯";
    if (usage < 70) return "You're on track 👍";
    if (usage < 85) return "Getting close - watch those impulse buys! 👀";
    if (usage < 100) return "Running hot! Time to slow down 🔥";
    return "Over budget - let's rein it in this week 📉";
}

/**
 * Get motivational message based on day of week
 */
export function getDayBasedMotivation(): string {
    const day = new Date().getDay();

    switch (day) {
        case 0: // Sunday
            return "Sunday vibes! Perfect time to plan next week's budget 🌅";
        case 1: // Monday
            return "Fresh week, fresh start! Let's nail those financial goals 💼";
        case 5: // Friday
            return "Friday feels! Remember your weekend budget 🎉";
        case 6: // Saturday
            return "Weekend mode! Try to resist those impulse buys 🛍️";
        default:
            return "Keep crushing it! 💪";
    }
}

/**
 * Get transaction count milestone message
 */
export function getTransactionMilestone(count: number): string | null {
    if (count === 1) return "🎉 First transaction! Your financial journey begins!";
    if (count === 10) return "💪 10 transactions tracked! You're building great habits!";
    if (count === 50) return "🚀 50 transactions! You're a tracking pro!";
    if (count === 100) return "🏆 Century! 100 transactions tracked!";
    if (count === 500) return "🌟 500 transactions! Financial mastery achieved!";
    return null;
}

/**
 * Get spending insight
 */
export function getSpendingInsight(categorySpending: { category: string; amount: number }[]): string | null {
    if (categorySpending.length === 0) return null;

    // Find highest spending category
    const highest = categorySpending[0];
    const amount = Math.abs(highest.amount);

    if (highest.category === 'Food & Dining' && amount > 200) {
        return `You're spending $${amount}/mo on ${highest.category.toLowerCase()} - that's a vacation fund! ☕→✈️`;
    }

    if (highest.category === 'Entertainment' && amount > 100) {
        return `Enjoying life! $${amount} on ${highest.category.toLowerCase()} this month 🎬`;
    }

    if (highest.category === 'Transportation' && amount > 300) {
        return `$${amount} on ${highest.category.toLowerCase()} - consider carpooling or transit? 🚗→🚇`;
    }

    if (amount > 500) {
        return `Big spender alert: $${amount} on ${highest.category} this month! 💸`;
    }

    return null;
}
