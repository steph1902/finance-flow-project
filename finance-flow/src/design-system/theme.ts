import { tokens } from './tokens';

export const theme = {
    colors: {
        background: tokens.colors.neutral[50], // Cream White
        foreground: tokens.colors.neutral[800], // Dark Brown

        card: {
            DEFAULT: tokens.colors.base.white,
            foreground: tokens.colors.neutral[800],
        },

        popover: {
            DEFAULT: tokens.colors.base.white,
            foreground: tokens.colors.neutral[800],
        },

        primary: {
            DEFAULT: tokens.colors.primary[500], // Earthy Brown
            foreground: tokens.colors.base.white,
        },

        secondary: {
            DEFAULT: tokens.colors.neutral[100], // Warm Beige
            foreground: tokens.colors.neutral[900],
        },

        muted: {
            DEFAULT: tokens.colors.neutral[100],
            foreground: tokens.colors.neutral[500],
        },

        accent: {
            DEFAULT: tokens.colors.neutral[200], // Sand
            foreground: tokens.colors.neutral[900],
        },

        destructive: {
            DEFAULT: tokens.colors.error[500],
            foreground: tokens.colors.base.white,
        },

        border: tokens.colors.neutral[200],
        input: tokens.colors.neutral[200],
        ring: tokens.colors.primary[500],
    },
    borderRadius: {
        DEFAULT: tokens.borderRadius.lg,
    },
} as const;
