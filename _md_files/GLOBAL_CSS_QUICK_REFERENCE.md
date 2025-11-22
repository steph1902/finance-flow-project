# Global CSS Quick Reference

## 🎨 Color Variables (Use with `hsl(var(--variable))`)

### Semantic Colors
```css
--background          /* Page background */
--foreground          /* Primary text */
--primary             /* Brand blue */
--primary-foreground  /* Text on primary */
--secondary           /* Secondary backgrounds */
--destructive         /* Errors, expenses */
--success             /* Success, income */
--warning             /* Warnings, alerts */
--muted               /* Subdued backgrounds */
--muted-foreground    /* Secondary text */
--border              /* Border color */
--input               /* Input borders */
--ring                /* Focus ring */
```

## 📐 Containers (Responsive, Auto-centered)

```tsx
<div className="container-sm">   {/* max-w-640px */}
<div className="container-md">   {/* max-w-768px */}
<div className="container-lg">   {/* max-w-1024px */}
<div className="container-xl">   {/* max-w-1280px */}
<div className="container-2xl">  {/* max-w-1536px */}
```

## 💰 Financial Utilities

```tsx
<span className="currency">$1,234.56</span>      {/* Tabular nums */}
<span className="currency positive">+$500</span> {/* Green */}
<span className="currency negative">-$200</span> {/* Red */}
```

## ♿ Accessibility

```tsx
<a href="#main" className="skip-to-main">Skip to content</a>
<span className="sr-only">Screen reader only</span>
```

## 🎨 Effects

```tsx
<div className="glass">              {/* Frosted glass */}
<div className="scrollbar-thin">     {/* Thin scrollbar */}
<div className="fade-in">            {/* Fade in animation */}
<p className="truncate-2-lines">     {/* Max 2 lines */}
```

## 📱 Responsive Sections

```tsx
<section className="section">        {/* 3rem → 6rem padding */}
```

## 🌙 Dark Mode

Automatic via `next-themes`:
```tsx
<ThemeProvider>
  {/* All colors adapt automatically */}
</ThemeProvider>
```

## 🖨️ Print

```tsx
<nav className="no-print">           {/* Hide in print */}
```

---

**Full docs**: See `GLOBAL_CSS_DOCUMENTATION.md`
