export const tokens = {
  colors: {
    base: {
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
    },
    neutral: {
      50: '#FDFCF8',  // Cream White (Main Background)
      100: '#F5F2EB', // Warm Beige (Secondary Background)
      200: '#EBE5DA', // Sand (Borders/Dividers)
      300: '#D6CFC7', // Deep Sand (Disabled/Placeholder)
      400: '#A89F91', // Muted Text
      500: '#7D7268', // Body Text
      600: '#5D5248', // Heading Text
      700: '#4A4036', // Darker Text
      800: '#2D2420', // Almost Black (Primary Text)
      900: '#1A1410', // Deepest Brown
    },
    primary: {
      50: '#F4EFE9',
      100: '#E6DCD3',
      200: '#D4C4B5',
      300: '#BFA896',
      400: '#A88B76',
      500: '#8C705F', // Earthy Brown (Brand Primary)
      600: '#70594C',
      700: '#554339',
      800: '#3B2E27',
      900: '#221A16',
    },
    accent: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#0EA5E9', // Cyan (Kept for subtle tech accents, maybe desaturated later)
      600: '#0284C7',
      700: '#0369A1',
      800: '#075985',
      900: '#0C4A6E',
    },
    success: {
      500: '#10B981', // Emerald
    },
    warning: {
      500: '#F59E0B', // Amber
    },
    error: {
      500: '#EF4444', // Red
    },
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
  },
  borderRadius: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '24px', // Large soft radius
    xl: '32px',
    '2xl': '40px',
    full: '9999px',
  },
} as const;
