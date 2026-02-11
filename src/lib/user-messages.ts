/**
 * User-friendly error messages for better UX
 */

export const ERROR_MESSAGES = {
    // Authentication
    AUTH_INVALID_CREDENTIALS: "Hmm, that email or password doesn't look right. Want to try again? 🔐",
    AUTH_SESSION_EXPIRED: "Your session expired - let's log you back in quickly! ⏰",
    AUTH_UNAUTHORIZED: "You'll need to log in first to access this. Quick detour! 🚪",

    // Transactions
    TRANSACTION_CREATE_FAILED: "Oops! Couldn't save that transaction. Let's give it another shot 🔄",
    TRANSACTION_UPDATE_FAILED: "Update didn't stick - mind trying once more? 💪",
    TRANSACTION_DELETE_FAILED: "Couldn't delete that. Maybe refresh and try again? 🗑️",
    TRANSACTION_NOT_FOUND: "We can't find that transaction - it might have been deleted 🔍",

    // Budgets
    BUDGET_CREATE_FAILED: "Budget creation hit a snag. Ready to try again? 📊",
    BUDGET_UPDATE_FAILED: "Update didn't save. Let's fix that! 🛠️",
    BUDGET_EXCEEDED: "Whoa! You're over budget this month. Time to slow down! 🚨",
    BUDGET_NOT_FOUND: "Can't find that budget - double-check and try again? 🤔",

    // Goals
    GOAL_CREATE_FAILED: "Couldn't create your goal right now. One more time? 🎯",
    GOAL_UPDATE_FAILED: "Update failed - but hey, persistence pays off! 💪",
    GOAL_ALREADY_ACHIEVED: "You already hit this goal! Time for a new challenge? 🏆",

    // AI
    AI_CATEGORIZATION_FAILED: "AI is taking a coffee break ☕ - try manual categorization?",
    AI_CONFIDENCE_LOW: "AI isn't very sure about this one. Mind double-checking? 🤔",
    AI_SERVICE_UNAVAILABLE: "AI service is temporarily down. We'll categorize manually for now! 🛠️",

    // Network
    NETWORK_ERROR: "Connection hiccup! Check your internet and try again 📡",
    SERVER_ERROR: "Our servers are having a moment. Refresh in a few seconds? 🔄",
    TIMEOUT: "That took too long - let's try again, shall we? ⏱️",

    // Validation
    VALIDATION_REQUIRED_FIELD: "This field is required - we need it to continue! ✏️",
    VALIDATION_INVALID_EMAIL: "That doesn't look like a valid email. Typo? 📧",
    VALIDATION_INVALID_AMOUNT: "Amount must be a valid number. Check for typos! 🔢",
    VALIDATION_INVALID_DATE: "That date format isn't quite right. Try YYYY-MM-DD? 📅",

    // Generic
    SOMETHING_WENT_WRONG: "Something went wrong, but you can totally try again! 🔄",
    PERMISSION_DENIED: "You don't have permission for this action. Need help? 🔒",
    RATE_LIMIT: "Whoa there, speed racer! Slow down a bit and try again 🐌",
};

export const SUCCESS_MESSAGES = {
    // Transactions
    TRANSACTION_CREATED: "Transaction added! Your finances are looking good 💰",
    TRANSACTION_UPDATED: "Updated! Everything's up to date now ✅",
    TRANSACTION_DELETED: "Deleted successfully. All clean! 🗑️",

    // Budgets
    BUDGET_CREATED: "Budget created! Time to stay on track 🎯",
    BUDGET_UPDATED: "Budget updated. You're in control! 💪",
    BUDGET_DELETED: "Budget removed successfully ✨",
    BUDGET_ON_TRACK: "Nice restraint! You're on track this month 🎯",

    // Goals
    GOAL_CREATED: "Goal set! Let's make it happen 🚀",
    GOAL_UPDATED: "Goal updated. Keep crushing it! 💪",
    GOAL_ACHIEVED: "🎉 GOAL ACHIEVED! You did it! Celebrate this win! 🏆",
    GOAL_PROGRESS: "Great progress! You're {{percent}}% there 📈",

    // AI
    AI_CATEGORIZED: "AI did its magic! Categorized with {{confidence}}% confidence ✨",
    AI_LEARNING: "Thanks! AI is learning from your feedback 🧠",
    AI_IMPROVED: "AI just got smarter thanks to you! 🎓",

    // Import/Export
    IMPORT_SUCCESS: "Imported {{count}} transactions successfully! 📥",
    EXPORT_SUCCESS: "Export ready! Check your downloads 📤",

    // Generic
    SAVED: "Saved! All changes are secure 💾",
    CHANGES_SYNCED: "All synced up! You're good to go ✨",
};

export const LOADING_MESSAGES = {
    TRANSACTIONS_LOADING: "Loading your transactions...",
    BUDGETS_LOADING: "Crunching the numbers...",
    GOALS_LOADING: "Checking your progress...",
    AI_PROCESSING: "AI is thinking... (this usually takes 2-3 seconds)",
    BIG4_ANALYZING: "Running deep financial analysis... (30-45 seconds)",
    REPORT_GENERATING: "Generating your report...",
    IMPORT_PROCESSING: "Processing your import... (this may take a minute)",
    SYNC_IN_PROGRESS: "Syncing your data...",
};

export const EMPTY_STATE_MESSAGES = {
    NO_TRANSACTIONS: {
        title: "Your financial story starts here ✨",
        description: "Add your first transaction and watch the magic happen. We'll auto-categorize it with AI!",
    },
    NO_BUDGETS: {
        title: "No budgets yet - let's create one! 💰",
        description: "Budgets help you stay on track. Start with your biggest spending category!",
    },
    NO_GOALS: {
        title: "Dream big! Set your first goal 🎯",
        description: "Whether it's a vacation, emergency fund, or new gadget - let's make it happen!",
    },
    NO_RECURRING: {
        title: "Automate the boring stuff 🔄",
        description: "Set up recurring transactions for bills and subscriptions. Set it and forget it!",
    },
    NO_REPORTS: {
        title: "No reports generated yet 📊",
        description: "Generate your first report to see insights into your spending patterns!",
    },
    NO_SEARCH_RESULTS: {
        title: "No matches found 🔍",
        description: "Try different keywords or adjust your filters!",
    },
};

/**
 * Get dynamic message with parameters
 */
export function getMessage(key: keyof typeof SUCCESS_MESSAGES, params?: Record<string, any>): string {
    let message = SUCCESS_MESSAGES[key];

    if (params) {
        Object.keys(params).forEach((param) => {
            message = message.replace(`{{${param}}}`, params[param]);
        });
    }

    return message;
}

/**
 * Get encouraging message based on time of day
 */
export function getTimeBasedEncouragement(): string {
    const hour = new Date().getHours();

    if (hour < 6) return "Late night session? Don't forget to save your work! 🌙";
    if (hour < 12) return "Good morning! Fresh start, fresh finances ☀️";
    if (hour < 17) return "Afternoon check-in - you're doing great! 👋";
    if (hour < 22) return "Evening review time! Nice work today 🌆";
    return "Still going? Remember to rest - your finances will be here tomorrow! 💤";
}
