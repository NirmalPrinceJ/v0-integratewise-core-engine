# Branding Guide — Theme System & Logo Integration


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

Your workbench now includes a comprehensive branding system with 4 distinct brand themes:

1. **Brand Blue** — Primary corporate brand (#4154A3)
2. **Forest** — Nature-inspired green (#1E4D2B)
3. **Paper** — Warm neutral brown (#5C4033)
4. **Mono White** — Minimalist white variant

Each theme includes:
- Branded logo variants
- Complete color palettes (light & dark modes)
- Theme-specific typography and UI styling
- Persistent user preferences

---

## Theme Architecture

### Color System

Each theme defines 7 core colors:

```typescript
interface ThemeColors {
  background: string;   // Page background
  foreground: string;   // Text color
  primary: string;      // Primary brand color
  secondary?: string;   // Secondary accent
  muted: string;        // Disabled/secondary text
  border: string;       // Component borders
  accent: string;       // Interactive elements
}
```

### Brand Configurations

**File:** `packages/domain-shells/utils/branding.ts`

Each theme includes:
- Logo path (color variant)
- Logo white (for dark backgrounds)
- Primary & secondary colors
- Light mode colors
- Dark mode colors

---

## Usage

### 1. Apply Theme Globally

```typescript
import { applyTheme, getStoredTheme } from '@integratewise/domain-shells';

// Get stored user preference or default
const { theme, mode } = getStoredTheme();

// Apply theme to document
applyTheme('brand-blue', 'light'); // or 'dark'
```

### 2. Use Theme in Components

```typescript
import { getBrandConfig, getThemeColors } from '@integratewise/domain-shells';

export function Header() {
  const config = getBrandConfig('forest');
  const colors = getThemeColors('forest', 'light');

  return (
    <header style={{ backgroundColor: colors.primary }}>
      <img src={config.logo} alt="Logo" />
    </header>
  );
}
```

### 3. Theme Switcher Component

```typescript
import { ThemeSwitcher } from '@integratewise/domain-shells';

export function Settings() {
  return (
    <div>
      <ThemeSwitcher />
    </div>
  );
}
```

---

## Theme Details

### Brand Blue (#4154A3)

**Perfect for:** Corporate, professional, tech companies

- **Logo:** `/logos/brand-blue.svg`
- **Primary:** #4154A3 (deep blue)
- **Secondary:** #6B7ACC (lighter blue)
- **Light Background:** #ffffff
- **Dark Background:** #111111

### Forest (#1E4D2B)

**Perfect for:** Sustainability, health, environment

- **Logo:** `/logos/forest.svg`
- **Primary:** #1E4D2B (forest green)
- **Secondary:** #7BAE7F (sage green)
- **Light Background:** #ffffff
- **Dark Background:** #111111

### Paper (#5C4033)

**Perfect for:** Publishing, design, craftsmanship

- **Logo:** `/logos/paper.svg`
- **Primary:** #5C4033 (warm brown)
- **Secondary:** #C4956A (tan)
- **Light Background:** #ffffff
- **Dark Background:** #111111

### Mono White

**Perfect for:** Minimalist, minimal branding, universal

- **Logo:** `/logos/mono-white.svg`
- **Primary:** #000000 (black on light) / #ffffff (white on dark)
- **Light Background:** #ffffff
- **Dark Background:** #111111

---

## Logo Files

All logos stored in `/public/logos/`:

```
public/logos/
├── brand-blue.svg    — Brand Blue variant
├── forest.svg        — Forest green variant
├── paper.svg         — Paper brown variant
└── mono-white.svg    — Mono white variant (works on all backgrounds)
```

**Format:** SVG (scalable, crisp at any size)

**Sizes Used:**
- Header: 48x48px
- Sidebar: 12x12px
- Favicon: 32x32px

---

## Implementing Theme Switcher

Add to settings panel:

```typescript
import { ThemeSwitcher } from '@integratewise/domain-shells';

export function SettingsPanel() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2>Appearance</h2>
        <ThemeSwitcher />
      </section>
    </div>
  );
}
```

The theme switcher:
- Shows all 4 theme options
- Displays logo preview for each
- Shows active selection with checkmark
- Persists choice to localStorage
- Triggers DOM re-renders on change

---

## CSS Variables

Themes automatically generate CSS variables:

```css
--background: #ffffff;
--foreground: #000000;
--primary: #4154A3;
--secondary: #6B7ACC;
--muted: #808080;
--border: #e5e5e5;
--accent: #4154A3;
```

Use in Tailwind:

```tsx
<div className="bg-background text-foreground border border-border">
  <button className="bg-primary text-white hover:bg-accent">
    Click me
  </button>
</div>
```

---

## Dark Mode Support

Each theme includes optimized dark mode colors:

```typescript
// Light mode (default)
applyTheme('brand-blue', 'light');

// Dark mode
applyTheme('brand-blue', 'dark');
```

Dark mode adapts:
- Lighter primary color for contrast
- Appropriate border colors
- Readable text contrast
- Accent colors that work on dark backgrounds

---

## Customization

### Add a New Theme

```typescript
// In packages/domain-shells/utils/branding.ts

export const brandConfigs: Record<BrandTheme, BrandConfig> = {
  'my-brand': {
    name: 'My Brand',
    logo: '/logos/my-brand.svg',
    logoWhite: '/logos/my-brand-white.svg',
    primaryColor: '#YOUR_COLOR',
    theme: {
      light: {
        background: '#ffffff',
        foreground: '#000000',
        primary: '#YOUR_COLOR',
        secondary: '#YOUR_SECONDARY',
        muted: '#808080',
        border: '#e5e5e5',
        accent: '#YOUR_COLOR',
      },
      dark: {
        background: '#111111',
        foreground: '#ffffff',
        primary: '#YOUR_LIGHT_COLOR',
        secondary: '#YOUR_LIGHT_SECONDARY',
        muted: '#666666',
        border: '#333333',
        accent: '#YOUR_LIGHT_ACCENT',
      },
    },
  },
};
```

Then add to type:

```typescript
export type BrandTheme = 'brand-blue' | 'forest' | 'paper' | 'mono-white' | 'my-brand';
```

---

## API Reference

### `getBrandConfig(theme: BrandTheme): BrandConfig`

Get complete configuration for a theme.

```typescript
const config = getBrandConfig('forest');
console.log(config.primaryColor); // #1E4D2B
```

### `getThemeColors(theme: BrandTheme, mode: ThemeMode): ThemeColors`

Get color palette for a theme and mode.

```typescript
const colors = getThemeColors('forest', 'dark');
console.log(colors.background); // #111111
```

### `applyTheme(theme: BrandTheme, mode: ThemeMode)`

Apply theme to document and persist preference.

```typescript
applyTheme('forest', 'light');
// Sets CSS variables on :root
// Saves to localStorage
```

### `getStoredTheme(): { theme: BrandTheme; mode: ThemeMode }`

Get user's stored preference or defaults.

```typescript
const { theme, mode } = getStoredTheme();
```

### `generateCSSVariables(theme: BrandTheme, mode: ThemeMode): string`

Generate CSS variable declaration string.

```typescript
const cssVars = generateCSSVariables('forest', 'light');
// Returns: "--background: #ffffff; --foreground: #000000; ..."
```

---

## Events

Listen for theme changes:

```typescript
window.addEventListener('theme-changed', (event: CustomEvent) => {
  console.log('Theme changed to:', event.detail.theme);
  // Re-render components that depend on theme
});
```

---

## Best Practices

1. **Logo Usage**
   - Use branded logo in header for identity
   - Use mono-white for light backgrounds
   - Use appropriate variant in dark mode

2. **Color Selection**
   - Ensure sufficient contrast (WCAG AA+)
   - Test colors in both light and dark modes
   - Use secondary colors for accents only

3. **Theme Persistence**
   - Always call `applyTheme()` on app load
   - Get user preference from `getStoredTheme()`
   - Listen to `theme-changed` events for updates

4. **Consistency**
   - Use CSS variables instead of hardcoded colors
   - Define theme-specific components once
   - Test across all 4 themes

---

## Files Reference

**Core:**
- `packages/domain-shells/utils/branding.ts` — Brand configuration
- `packages/domain-shells/components/theme-switcher.tsx` — Theme UI

**Assets:**
- `public/logos/brand-blue.svg`
- `public/logos/forest.svg`
- `public/logos/paper.svg`
- `public/logos/mono-white.svg`

**Integration:**
- `packages/domain-shells/account-success-shell-redesigned.tsx` — Uses branding

---

## Summary

Your workbench now features:

✅ 4 professional brand themes
✅ Complete light & dark mode support
✅ Branded logo integration
✅ Theme-aware CSS variables
✅ Persistent user preferences
✅ Theme switcher component
✅ Full API for theme management

Deploy and customize to match your brand identity.
