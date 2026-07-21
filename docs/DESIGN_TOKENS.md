# Enterprise Design System - Customer Zero

## Overview

The Customer Zero UI follows a professional, enterprise-grade design system optimized for operational monitoring and decision-making. The system uses a carefully curated 5-color palette with supporting neutrals for clarity and accessibility.

## Color Palette

### Primary Colors (5-Color System)

#### 1. Primary - IntegrateWise Blue
- **Light**: `oklch(0.52 0.18 260)` - Primary action, trust, stability
- **Dark**: `oklch(0.65 0.18 260)` - High visibility in dark mode
- **Use**: Buttons, links, primary CTAs, important UI elements

#### 2. Secondary - Deep Gray (Enterprise)
- **Light**: `oklch(0.22 0.01 250)` - Professional, structured
- **Dark**: `oklch(0.85 0.01 250)` - Secondary text, neutral elements
- **Use**: Secondary text, dividers, structured layouts

#### 3. Success - Emerald (Operational Health)
- **Light**: `oklch(0.57 0.15 155)` - Healthy status indicators
- **Dark**: `oklch(0.68 0.15 155)` - Bright visibility for operational state
- **Use**: Success states, healthy status, positive indicators

#### 4. Warning - Amber (Caution)
- **Light**: `oklch(0.68 0.15 80)` - Attention needed
- **Dark**: `oklch(0.75 0.15 80)` - High visibility warnings
- **Use**: Warnings, caution states, "at-risk" indicators

#### 5. Danger - Red (Critical)
- **Light**: `oklch(0.55 0.2 20)` - Critical alerts
- **Dark**: `oklch(0.65 0.2 20)` - High visibility errors
- **Use**: Errors, destructive actions, critical failures

### Accent Colors

#### Accent - Cyan (Highlights)
- **Light**: `oklch(0.6 0.18 200)` - Secondary highlights
- **Dark**: `oklch(0.7 0.18 200)` - Twin recommendations, insights
- **Use**: Twin suggestions, secondary highlights, featured content

### Neutral Colors

#### Background
- **Light**: `oklch(0.98 0.001 250)` - Clean workspace
- **Dark**: `oklch(0.11 0.01 250)` - Reduced eye strain, monitoring-optimized

#### Card & Surface
- **Light**: `oklch(1 0 0)` - Pure white for clarity
- **Dark**: `oklch(0.15 0.01 250)` - Slightly elevated from background

#### Muted (Secondary Text)
- **Light**: `oklch(0.5 0.01 250)` - De-emphasized text
- **Dark**: `oklch(0.7 0.01 250)` - Readable secondary information

#### Border
- **Light**: `oklch(0.88 0.003 250)` - Subtle structure
- **Dark**: `oklch(0.25 0.01 250)` - Visible but not prominent

## Typography System

### Font Stack
- **Sans Serif**: Inter (primary), system-ui fallback
- **Monospace**: Geist Mono (code, technical text)

### Type Scale
```
Heading 1 (h1):     32px | 3xl | font-bold | line-height-tight (1.25)
Heading 2 (h2):     24px | 2xl | font-semibold | line-height-tight (1.25)
Heading 3 (h3):     20px | xl | font-semibold | line-height-tight (1.25)
Heading 4 (h4):     18px | lg | font-semibold | line-height-normal (1.5)
Body Text:          16px | base | regular | line-height-normal (1.5)
Small Text:         14px | sm | regular | line-height-normal (1.5)
Extra Small:        12px | xs | regular | line-height-normal (1.5)
```

### Line Heights
- **Tight**: 1.25 - Headings
- **Normal**: 1.5 - Body text (default)
- **Relaxed**: 1.625 - Comfortable reading for long content

## Spacing System

### Border Radius
- **sm**: 4px - Small UI elements (buttons, badges)
- **md**: 6px - Medium components (cards, inputs)
- **lg**: 8px - Large components (modals, panels)
- **xl**: 12px - Extra large components

### Spacing Scale
Uses Tailwind's standard 4px base unit:
- 2: 8px
- 3: 12px
- 4: 16px
- 6: 24px
- 8: 32px
- 12: 48px
- 16: 64px

## Component Color Usage

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: Gray background, dark text
- **Success**: Emerald background, white text
- **Warning**: Amber background, white text
- **Danger**: Red background, white text
- **Destructive**: Red background, white text

### Status Indicators
- **Healthy**: Emerald
- **At-Risk**: Amber/Orange
- **Critical**: Red
- **Neutral**: Gray
- **Information**: Blue

### Alert/Toast
- **Success**: Emerald with white text
- **Warning**: Amber with white text
- **Error**: Red with white text
- **Info**: Blue with white text

### Sidebar
- **Background**: Slightly lighter than main background
- **Active Item**: Primary blue with blue text
- **Hover**: Subtle background highlight
- **Text**: Secondary gray for main items

## Dark Mode

The dark mode is optimized for:
- **Reduced eye strain** - Professional monitoring environment
- **High contrast** - Critical information visibility
- **Professional appearance** - Enterprise operations

Key dark mode tokens:
- Background: `oklch(0.11 0.01 250)` - Very dark, minimal flicker
- Cards: `oklch(0.15 0.01 250)` - Slightly elevated
- Text: `oklch(0.95 0.01 250)` - Bright white for readability
- Borders: `oklch(0.25 0.01 250)` - Visible without harshness

## Accessibility

### Color Contrast
- All text meets WCAG AAA standards (7:1 or higher)
- Status indicators use both color and icons
- Never rely on color alone for information

### Focus States
- Visible outline: 2px solid ring color
- Offset: 2px from element
- Works on all interactive elements

### Semantics
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support

## Usage Guidelines

### When to Use Each Color

#### Blue (Primary)
- Main CTAs
- Navigation active states
- Primary data highlight
- Spine/Twin interactions

#### Gray (Secondary)
- Neutral content
- Dividers
- Secondary actions
- De-emphasized text

#### Emerald (Success)
- Healthy status
- Completed actions
- Operational ready
- Account health

#### Amber (Warning)
- At-risk conditions
- Attention needed
- Caution states
- Renewal warnings

#### Red (Danger)
- Critical failures
- Destructive actions
- Account suspended
- Emergency alerts

#### Cyan (Accent)
- Twin recommendations
- Featured insights
- Secondary highlights
- Call to action (secondary)

## Implementation

All colors are implemented as CSS custom properties in `app/globals.css`:

```css
/* Light Mode */
--primary: oklch(0.52 0.18 260);
--success: oklch(0.57 0.15 155);
--warning: oklch(0.68 0.15 80);
--destructive: oklch(0.55 0.2 20);

/* Dark Mode */
.dark {
  --primary: oklch(0.65 0.18 260);
  --success: oklch(0.68 0.15 155);
  --warning: oklch(0.75 0.15 80);
  --destructive: oklch(0.65 0.2 20);
}
```

Use Tailwind classes directly:
- `bg-primary` / `text-primary` / `border-primary`
- `bg-success` / `text-success`
- `bg-warning` / `text-warning`
- `bg-destructive` / `text-destructive`

## Future Extensions

This design system is built for:
- **Scalability**: Easy to add new accent colors as needed
- **Consistency**: Single source of truth for all colors
- **Accessibility**: WCAG compliant from the start
- **Maintenance**: Centralized token management

For questions or extensions, refer to `globals.css` and update tokens there first, then document in this file.
