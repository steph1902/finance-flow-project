/**
 * Form validation helpers with user-friendly error messages
 */

export const VALIDATION_RULES = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "That doesn't look like a valid email 📧",
    },
    password: {
        minLength: 8,
        message: "Password needs at least 8 characters for security 🔐",
    },
    amount: {
        pattern: /^-?\d+(\.\d{1,2})?$/,
        message: "Enter a valid amount (e.g., 45.50) 💵",
    },
    positiveAmount: {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: "Amount must be positive ✅",
    },
    date: {
        message: "Please select a valid date 📅",
    },
    required: {
        message: "This field is required ✏️",
    },
};

/**
 * Validate email
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
    if (!email) {
        return { valid: false, message: VALIDATION_RULES.required.message };
    }

    if (!VALIDATION_RULES.email.pattern.test(email)) {
        return { valid: false, message: VALIDATION_RULES.email.message };
    }

    return { valid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password) {
        return { valid: false, message: VALIDATION_RULES.required.message };
    }

    if (password.length < VALIDATION_RULES.password.minLength) {
        return { valid: false, message: VALIDATION_RULES.password.message };
    }

    return { valid: true };
}

/**
 * Validate amount
 */
export function validateAmount(amount: string | number, mustBePositive = false): { valid: boolean; message?: string } {
    const amountStr = String(amount);

    if (!amountStr) {
        return { valid: false, message: VALIDATION_RULES.required.message };
    }

    const pattern = mustBePositive ? VALIDATION_RULES.positiveAmount.pattern : VALIDATION_RULES.amount.pattern;
    const message = mustBePositive ? VALIDATION_RULES.positiveAmount.message : VALIDATION_RULES.amount.message;

    if (!pattern.test(amountStr)) {
        return { valid: false, message };
    }

    return { valid: true };
}

/**
 * Get smart default values for forms
 */
export const FORM_DEFAULTS = {
    transaction: {
        date: new Date().toISOString().split('T')[0],
        category: 'Uncategorized',
    },
    budget: {
        period: 'monthly',
        rollover: false,
    },
    goal: {
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    },
};

/**
 * Format amount for display
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Get category emoji
 */
export function getCategoryEmoji(category: string): string {
    const emojiMap: Record<string, string> = {
        'Food & Dining': '🍔',
        'Transportation': '🚗',
        'Shopping': '🛍️',
        'Entertainment': '🎬',
        'Bills & Utilities': '💡',
        'Healthcare': '🏥',
        'Education': '📚',
        'Travel': '✈️',
        'Groceries': '🛒',
        'Freelance Income': '💼',
        'Salary': '💰',
        'Investment': '📈',
        'Gift': '🎁',
        'Other': '💵',
        'Uncategorized': '❓',
    };

    return emojiMap[category] || '💵';
}
