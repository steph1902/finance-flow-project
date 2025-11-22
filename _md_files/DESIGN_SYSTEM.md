# 🎨 FinanceFlow Zen Design System

> A comprehensive Japanese-inspired design system built on TailwindCSS v4, React 19, and Next.js 16

## 🧘 Philosophy

This design system embodies three core Japanese aesthetic principles:

- **Ma (間)** - Negative space and breathing room
- **Kanso (簡素)** - Simplicity and elimination of clutter  
- **Wabi-sabi (侘寂)** - Beauty in imperfection and subtle refinement

## 🎯 Design Tokens

### Color System

#### Light Mode
- **Background**: Rice paper white with subtle warmth
- **Text**: Charcoal ink with multiple opacity levels
- **Accents**: Muted indigo, luxury gold, soft charcoal

#### Dark Mode
- **Background**: Night stone (deep charcoal)
- **Text**: Moonlight white with controlled opacity
- **Accents**: Brighter indigo, enhanced gold, light charcoal

### Spacing Scale (Ma)
```css
--space-zen-xs: 0.25rem;   /* 4px - minimal breath */
--space-zen-sm: 0.5rem;    /* 8px - tight */
--space-zen-md: 1rem;      /* 16px - comfortable */
--space-zen-lg: 1.5rem;    /* 24px - breathing */
--space-zen-xl: 2rem;      /* 32px - spacious */
--space-zen-2xl: 3rem;     /* 48px - generous */
--space-zen-3xl: 4rem;     /* 64px - vast */
--space-zen-4xl: 6rem;     /* 96px - monumental */
```

### Elevation (Shadows)
- `shadow-soft` - Minimal elevation
- `shadow-card` - Standard card shadow
- `shadow-glass` - Glass morphism effect
- `shadow-mist` - Gentle floating effect
- `shadow-floating` - Prominent elevation

### Motion Tokens
- `transition-instant`: 0.1s
- `transition-fast`: 0.2s
- `transition-smooth`: 0.3s (default)
- `transition-calm`: 0.5s
- `transition-slow`: 0.8s

Easing functions:
- `ease-zen`: cubic-bezier(0.4, 0.0, 0.2, 1)
- `ease-gentle`: cubic-bezier(0.25, 0.1, 0.25, 1)
- `ease-bounce`: cubic-bezier(0.34, 1.56, 0.64, 1)

## 📝 Typography

### Fonts
- **UI Text**: Noto Sans JP (400, 500, 600, 700)
- **Headings/Display**: Noto Serif JP (500, 600, 700)
- **Code**: System monospace

### Type Scale (Clamp-based)
```css
.jp-display  /* Hero text: 2.5rem → 5rem */
.jp-h1       /* Main heading: 2rem → 3.5rem */
.jp-h2       /* Section heading: 1.5rem → 2.5rem */
.jp-h3       /* Subsection: 1.25rem → 1.875rem */
.jp-h4       /* Small heading: 1.125rem → 1.5rem */
.jp-h5       /* Micro heading: 1rem → 1.25rem */
.jp-h6       /* Label heading: 0.875rem → 1rem */
.jp-body     /* Body text: 0.875rem → 1.125rem */
.jp-lead     /* Lead paragraph: 1.125rem → 1.5rem */
.jp-caption  /* Small text: 0.75rem → 0.875rem */
.jp-numeric  /* Financial numbers: tabular nums */
```

## 🎨 Components

### ZenContainer
Layout container with responsive padding and max-width constraints.

```tsx
import { ZenContainer } from "@/components/ui/zen-index";

<ZenContainer size="xl" centered>
  {/* Content */}
</ZenContainer>
```

**Props:**
- `size`: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
- `centered`: boolean (default: true)

### ZenSection
Semantic section with vertical rhythm spacing.

```tsx
<ZenSection spacing="lg" background="muted">
  {/* Content */}
</ZenSection>
```

**Props:**
- `spacing`: "none" | "sm" | "md" | "lg" | "xl"
- `background`: "default" | "muted" | "card" | "glass"

### ZenCard
Elevated card with multiple visual variants.

```tsx
<ZenCard variant="glass" hoverable padding="lg">
  {/* Content */}
</ZenCard>
```

**Props:**
- `variant`: "default" | "glass" | "outlined" | "elevated"
- `hoverable`: boolean
- `padding`: "none" | "sm" | "md" | "lg"

### ZenButton
Minimalist button extending shadcn/ui.

```tsx
<ZenButton variant="indigo" size="lg">
  Action
</ZenButton>
```

**Props:**
- `variant`: "default" | "indigo" | "gold" | "outline" | "ghost" | "glass" | "destructive" | "success"
- `size`: "sm" | "md" | "lg" | "xl" | "icon"

### ZenMotion
Scroll-triggered animation wrapper using Framer Motion.

```tsx
<ZenMotion variant="fadeInUp" delay={0.2} duration={0.5}>
  {/* Content */}
</ZenMotion>
```

**Props:**
- `variant`: "fadeIn" | "fadeInUp" | "fadeInDown" | "scaleIn" | "slideInRight" | "none"
- `delay`: number (in seconds)
- `duration`: number (in seconds)
- `once`: boolean (default: true)

## 🎭 Utility Classes

### Glass Effects
```tsx
className="glass"       // Glass morphism background
className="glass-card"  // Glass card variant
```

### Gradient Text
```tsx
className="text-gradient-primary"  // Indigo gradient
className="text-gradient-gold"     // Gold gradient
```

### Financial Numbers
```tsx
className="currency"    // Tabular numbers
className="positive"    // Green for gains
className="negative"    // Red for losses
```

### Transitions
```tsx
className="transition-zen"  // Smooth zen transition
```

## ♿ Accessibility

### Focus States
All interactive elements have enhanced focus indicators with subtle glow effects.

### Reduced Motion
Respects `prefers-reduced-motion` - all animations are disabled automatically.

### High Contrast
Supports `prefers-contrast: high` with enhanced border widths and underlines.

### Skip Links
Skip-to-main-content link included for keyboard navigation.

### Color Contrast
All color combinations meet WCAG 2.1 AA standards minimum.

## 🌓 Dark Mode

Automatic theme switching via `next-themes`:
- System preference detection
- Manual toggle support
- Smooth theme transitions (0.5s)
- Optimized color tokens for both modes

## 📦 Installation

All dependencies are already included in `package.json`:
- `framer-motion` - Animation library
- `tailwindcss@4` - Utility-first CSS
- `next-themes` - Theme management

## 🚀 Usage Example

```tsx
import {
  ZenContainer,
  ZenSection,
  ZenCard,
  ZenButton,
  ZenMotion,
} from "@/components/ui/zen-index";

export default function Page() {
  return (
    <ZenSection spacing="lg" background="muted">
      <ZenContainer size="xl">
        <ZenMotion variant="fadeInUp">
          <ZenCard variant="glass" hoverable>
            <h2 className="jp-h2">Zen Design</h2>
            <p className="jp-body">Beautiful simplicity.</p>
            <ZenButton variant="indigo" size="lg">
              Get Started
            </ZenButton>
          </ZenCard>
        </ZenMotion>
      </ZenContainer>
    </ZenSection>
  );
}
```

## 📐 Responsive Design

All components are mobile-first with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🎨 Customization

### Extending Colors
Add new colors in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      // Your custom colors
    }
  }
}
```

### Custom Shadows
Define in `globals.css`:

```css
:root {
  --shadow-custom: /* your shadow */;
}
```

## 📚 Resources

- [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)
- [Noto Serif JP](https://fonts.google.com/noto/specimen/Noto+Serif+JP)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**License:** MIT  
**Version:** 1.0.0  
**Last Updated:** November 2025
