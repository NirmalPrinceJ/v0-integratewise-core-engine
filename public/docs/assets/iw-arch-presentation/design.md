# Design Document

## 1. Profile Baseline Declaration

- **Profile selection**: `profiles/strategic.md`
- **Selection rationale**: This is a strategic architecture review presentation for stakeholders (executives, tech leads, product owners). It requires conveying strategic height, clear storyline, and authority — matching the strategic planning profile.
- **Referenced dimensions**: Design philosophy (grand vision, key points prominent, premium feel), information density (medium-high), color guidance (steady, premium, powerful), font guidance (sans-serif bold titles + readable body), content expression (framework diagrams, milestone roadmaps).
- **Deviation notes**:
  - Using a dark background theme instead of the profile's default light backgrounds, because this is a technical architecture presentation and dark mode conveys modern tech authority.
  - Adding more diagram/flowchart-style pages than typical strategic decks, because architecture is inherently visual.

## 2. Style Baseline Declaration

- **Style anchor selection**:
  - **Stripe's developer documentation aesthetic** — clean, dark, authoritative, with amber/gold accents on deep charcoal. Referenced for: color scheme temperament, information hierarchy, and the balance between technical depth and visual clarity.
  - **McKinsey strategic reports** — structured, data-forward, confident. Referenced for: information density, page title construction (titles as core arguments), and the Objective-Path-Returns framework.
- **Referenced dimension explanation**: From Stripe: the dark-mode palette, restrained accent usage, and monospace/code-friendly aesthetic. From McKinsey: the structural rigor, big-number displays, and argument-forward page titles.

## 3. Style Details

### Color Design Principles

- **Overall tendency**: In-between — stability as foundation with local highlights. Dark backgrounds convey authority; amber accents draw attention to key architectural concepts.
- **Temperature**: Cool-neutral with warm accents. Deep charcoal (cool) + warm amber (accent) creates tension and visual interest.
- **Primary color**: `#1a1a2e` — deep charcoal with a subtle blue undertone. Not pure black; has depth. Used for backgrounds and primary surfaces.
- **Background**: `#0f0f1a` — near-black, slightly lighter than primary. Used for page backgrounds.
- **Text color**: `#e8e8f0` — off-white with a cool tint. High contrast on dark backgrounds without the harshness of pure white.
- **Secondary color**: `#4a4a6a` — muted slate. Used for dividers, secondary text, subtle borders.
- **Accent color**: `#d4a574` — warm amber/gold. Used sparingly for key data, CTAs, highlighted architectural components, and chapter dividers. Same family as primary (warm-neutral pairing).

### Font Usage Principles

- **Title font**: `Liter` — modern neo-grotesque, clean and rational. Perfect for tech architecture authority. Used with ALL CAPS + expanded letter spacing for cover and chapter titles.
- **Body font**: `QuattrocentoSans` — classic elegant sans-serif, highly readable at small sizes. Used for all body content.
- **Font size hierarchy**:
  - Cover title: 48px (Liter, ALL CAPS, letter-spacing 4px)
  - Page title: 28px (Liter, bold)
  - Subtitle/section header: 22px (Liter)
  - Body text: 18px (QuattrocentoSans, line-height 1.6)
  - Annotations/labels: 14px (QuattrocentoSans)
  - Big numbers: 56px (Liter, light weight for breathing room)

### Text Box and Container Styles

- Content separation: Primarily whitespace and font size differences. Cards used sparingly for grouping related architectural components.
- Cards: Sharp-cornered rectangles, no border, filled with `#1a1a2e` (primary) on `#0f0f1a` (background) pages. Subtle difference creates depth without heavy shadows.
- Decorative elements: Thin horizontal lines (`#4a4a6a`) as section dividers. Small amber accent bars (4px wide, full height) on left side of content blocks for visual hierarchy.

### Image Style

- **Icons**: Solid icons (fas style), used sparingly. Amber color for emphasis. Used to mark subsystem categories (e.g., database icon for Spine, brain icon for Twin).
- **Tables**: Minimal style. Dark header row with amber text. Alternating row backgrounds (`#1a1a2e` / `#151525`). No outer borders; only subtle horizontal dividers.
- **Charts**: Not heavily used in this deck; architecture diagrams built with shapes + text instead.
- **Illustrations**: No photographic illustrations. Architecture is conveyed through geometric diagrams, flowcharts built with shapes and connectors.

## 4. Layout System

### Global Layout Characteristics

- **Page size**: 1280 x 720 (16:9)
- **Page margins**: 60px left/right, 50px top, 40px bottom
- **Unified page elements**:
  - Top-left: small "IW" logo text (Liter, 14px, amber, on every page)
  - Bottom-right: page number (QuattrocentoSans, 12px, secondary color)
  - Bottom-left: document version "v1.0 ARCHITECTURE FREEZE" (12px, secondary)
  - Thin horizontal rule at y=50 across full width (secondary color, 1px) below the logo area

### Special Page Layouts

- **Cover**: Full dark background. Centered large title (48px, ALL CAPS, amber). Subtitle below (22px, off-white). Thin amber horizontal line separating title from subtitle. Bottom: version badge.
- **Table of Contents**: Left side large "CONTENTS" vertical text (Liter, 72px, rotated 90°, secondary color). Right side: 4 chapter entries in a grid, each with number (amber, 36px) + title (22px) + one-line description (16px).
- **Chapter dividers**: Dark background with large chapter number (120px, amber, Liter) on left. Chapter title (36px, off-white) right-aligned. Thin amber accent line. Minimal, high-impact.
- **Final page**: Similar to cover. Centered "ARCHITECTURE FREEZE v1.0" in large amber text. Below: the three key stats (35 documents, 00–34, Complete).

### Content Page Layout Patterns

- **Pattern A — Left-right split**: Left 40% = title + key bullets. Right 60% = architecture diagram built with shapes.
- **Pattern B — Full-width flow**: Title at top. Horizontal flow diagram across middle (shapes connected by lines). Annotations below.
- **Pattern C — Card grid**: Title at top. 3-4 equal cards in a row, each with icon + title + 2-3 bullets.
- **Pattern D — Big number + detail**: Left 30% = one big number/stat. Right 70% = explanatory content.

## 5. Style Usage Rules

- **$title** textStyle: Used for all page titles (28px, Liter, off-white).
- **$subtitle** textStyle: Used for section headers within pages (22px, Liter, off-white).
- **$body** textStyle: Used for all body content (18px, QuattrocentoSans, off-white, line-height 1.6).
- **$caption** textStyle: Used for annotations, labels, page numbers (14px, QuattrocentoSans, secondary color).
- **$bigNumber** textStyle: Used for stats and KPIs (56px, Liter, amber).
- **$chapterNumber** textStyle: Used for chapter divider numbers (120px, Liter, amber).
- **Primary color ($primary)**: Card fills, shape fills for primary elements.
- **Background color ($background)**: Page backgrounds.
- **Accent color ($accent)**: Chapter numbers, big stats, key highlights, icon fills, accent bars.
- **Secondary color ($secondary)**: Dividers, subtle borders, captions, secondary text.
- **Text color ($text)**: All primary text content.

## 6. Risk Prohibitions

- [ ] **NO blue/cyan colors** — this is a dark+amber palette; do not introduce blue accents.
- [ ] **NO rounded rectangles** — use sharp corners throughout for architectural rigor.
- [ ] **NO body text below 18px** — minimum 18px for readability on dark backgrounds.
- [ ] **NO annotation text below 12px** — minimum 12px for captions.
- [ ] **NO title text below 28px** — page titles must be 28px minimum.
- [ ] **NO more than 3 colors on any page** — stick to background, text, and one accent.
- [ ] **NO gradients on text** — solid colors only; gradients on backgrounds only if very subtle.
- [ ] **NO photographic images** — this is a technical architecture deck; use shapes, icons, and diagrams only.
- [ ] **NO center-aligned body text** — left-align all body content for readability.
- [ ] **NO pages with only title + 2 lines** — every content page must have substantial information (minimum 4-6 key points or a full diagram).

## 7. Theme Definition

```yaml
theme:
  colors:
    primary: "#1a1a2e"
    secondary: "#4a4a6a"
    accent: "#d4a574"
    background: "#0f0f1a"
    text: "#e8e8f0"
    darktext: "#0f0f1a"
  textStyles:
    title:
      fontSize: 28
      color: "$text"
      fontFamily: "Liter"
      lineHeight: 1.3
    subtitle:
      fontSize: 22
      color: "$text"
      fontFamily: "Liter"
      lineHeight: 1.3
    body:
      fontSize: 18
      color: "$text"
      fontFamily: "QuattrocentoSans"
      lineHeight: 1.6
    caption:
      fontSize: 14
      color: "$secondary"
      fontFamily: "QuattrocentoSans"
      lineHeight: 1.4
    bigNumber:
      fontSize: 56
      color: "$accent"
      fontFamily: "Liter"
      lineHeight: 1.1
    chapterNumber:
      fontSize: 120
      color: "$accent"
      fontFamily: "Liter"
      lineHeight: 1.0
  tableStyles:
    default:
      fontSize: 16
      fontFamily: "QuattrocentoSans"
      headerFill: "$primary"
      headerColor: "$accent"
      headerBold: true
      bodyFill: ["#1a1a2e", "#151525"]
      bodyColor: "$text"
      border:
        style: solid
        width: 1
        color: "#4a4a6a40"
```
