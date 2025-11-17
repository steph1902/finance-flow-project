import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          indigo: 'hsl(var(--color-accent-indigo))',
          gold: 'hsl(var(--color-accent-gold))',
          charcoal: 'hsl(var(--color-accent-charcoal))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--color-error))',
          foreground: 'hsl(var(--color-error-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--color-info))',
          foreground: 'hsl(var(--color-info-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        serif: ['"Noto Serif JP"', '"Noto Sans JP"', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      spacing: {
        'zen-xs': 'var(--space-zen-xs)',
        'zen-sm': 'var(--space-zen-sm)',
        'zen-md': 'var(--space-zen-md)',
        'zen-lg': 'var(--space-zen-lg)',
        'zen-xl': 'var(--space-zen-xl)',
        'zen-2xl': 'var(--space-zen-2xl)',
        'zen-3xl': 'var(--space-zen-3xl)',
        'zen-4xl': 'var(--space-zen-4xl)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'card': 'var(--shadow-card)',
        'glass': 'var(--shadow-glass)',
        'mist': 'var(--shadow-mist)',
        'floating': 'var(--shadow-floating)',
      },
      animation: {
        'fade-in': 'fadeIn var(--transition-smooth) var(--ease-zen)',
        'fade-in-up': 'fadeInUp var(--transition-calm) var(--ease-zen)',
        'fade-in-down': 'fadeInDown var(--transition-calm) var(--ease-zen)',
        'scale-in': 'scaleIn var(--transition-smooth) var(--ease-zen)',
        'slide-in-right': 'slideInRight var(--transition-calm) var(--ease-gentle)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(2rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-2rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-2rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        'instant': 'var(--transition-instant)',
        'fast': 'var(--transition-fast)',
        'smooth': 'var(--transition-smooth)',
        'calm': 'var(--transition-calm)',
        'slow': 'var(--transition-slow)',
      },
      transitionTimingFunction: {
        'zen': 'var(--ease-zen)',
        'gentle': 'var(--ease-gentle)',
        'bounce': 'var(--ease-bounce)',
      },
      backdropBlur: {
        xs: '2px',
        zen: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
