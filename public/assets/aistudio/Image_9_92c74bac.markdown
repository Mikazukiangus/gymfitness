---
name: Kinetic Obsidian
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#c5c9ac'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#8f9378'
  outline-variant: '#444932'
  surface-tint: '#b0d500'
  primary: '#ffffff'
  on-primary: '#2a3400'
  primary-container: '#caf300'
  on-primary-container: '#596c00'
  inverse-primary: '#536600'
  secondary: '#ffb59c'
  on-secondary: '#5c1900'
  secondary-container: '#ff5708'
  on-secondary-container: '#511500'
  tertiary: '#ffffff'
  on-tertiary: '#00363a'
  tertiary-container: '#7df4ff'
  on-tertiary-container: '#006f77'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#caf300'
  primary-fixed-dim: '#b0d500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#822700'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-display-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  data-display-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-ui:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses relentless kinetic precision, athletic intensity, and quantitative progression. Designed for serious strength athletes, lifters, and individuals pursuing systematic body recomposition, the aesthetic balances high-contrast technical instrumentation with dark tactical ergonomics.

The visual style fuses **Technical Brutalism** and **Tactile Modernism**:
- Deep graphite substrates eliminate visual noise in gym environments under harsh overhead lighting.
- High-luminance electric volt accents command instant focus for active timers, rep targets, and completion triggers.
- Ember and coral indicators denote personal records (PRs), strain warnings, and anaerobic thresholds.
- Information architecture treats every workout session as a high-precision telemetry stream: dense, scannable, and devoid of ornamental fluff.

## Colors

The palette leverages pure functional chromatic hierarchy against deep, calibrated slate bases.

- **Primary (`#D4FF00` - Electric Volt):** The core driver of action. Applied to primary interactive triggers, active exercise progress rings, completed set checkmarks, and primary numerical values in rest timers.
- **Secondary (`#FF5500` - Kinetic Ember):** Used strictly for high-arousal metabolic achievements: Personal Record (PR) medals, 1RM milestones, target heart rate peaks, and calorie surplus indicators.
- **Tertiary (`#00F0FF` - Cryo Cyan):** Data analytics, target velocity curves, protein target markers, and recovery tracking.
- **Neutral Foundation:**
  - `Canvas / Background Base`: `#0D1117` (Deep Obsidian Slate)
  - `Surface Tier 1 (Cards, Modules)`: `#161B22` (Graphite Layer)
  - `Surface Tier 2 (Elevated, Inputs)`: `#21262D` (Structural Slate)
  - `Borders & Rules`: `#30363D` (Subtle boundary definition)
  - `Text High-Contrast`: `#F0F6FC`
  - `Text Muted / Secondary`: `#8B949E`

## Typography

Typography drives athletic focus through three distinct structural roles:

1. **Space Grotesk (Display & Section Headlines):** Geometric, mechanical, and authoritative. Conveys raw engineered power without sacrificing layout economy.
2. **Inter (Body & General Interface):** Hyper-legible, unpretentious neutral workhorse ensuring effortless reading of instructions, exercise notes, and macro logs.
3. **JetBrains Mono (Data & Telemetry):** Monospaced precision for weights (kg/lbs), reps, RPE values, rest timers, and split times. Ensures tabular data aligns cleanly in matrix log grids without visual wobble during live countdowns.

## Layout & Spacing

The spatial architecture is optimized for single-handed thumb-zone operation while carrying a high density of telemetry.

- **Grid Architecture:** 
  - Mobile (Default): 4-column fluid layout, 16px (`1rem`) outer margins, 12px horizontal gutters between metric tiles.
  - Tablet/Foldable: 8-column layout, 24px margins, splitting active set logging on the left and historical load curves on the right.
- **Rhythm & Cadence:** Strict 4px/8px modular base. 
  - Dense grouping (`space-xs` to `space-sm`) binds paired metrics (e.g., set number directly next to weight input).
  - Component gaps (`space-md`) separate individual exercise blocks.
  - Breakout gaps (`space-xl`) isolate session transitions (e.g., Warmup block to Working Sets).
- **Edge Restraints:** Sticky bottom action drawers reserve a minimum 88px clearance above safe areas to prevent thumb collisions with bottom bar controls during fatigue.

## Elevation & Depth

This design system avoids traditional blurry drop-shadows, which muddy dark interfaces. Hierarchy is achieved via **Tonal Tiering** combined with **Technical Edge Illumination**:

- **Layer 0 (Canvas Base):** `#0D1117` — The infinite depth foundation.
- **Layer 1 (Modular Exercise Containers):** `#161B22` with a `1px` continuous border in `#30363D`.
- **Layer 2 (Active/Selected Set Row):** `#21262D` accented by a `1px` border in `#D4FF00` with an ambient glow: `box-shadow: 0 0 16px -4px rgba(212, 255, 0, 0.25)`.
- **Layer 3 (Overlays, Rest Modals, Timer Drawers):** `#161B22` at 92% opacity with `backdrop-filter: blur(16px)` and a top border highlight in `rgba(240, 246, 252, 0.12)`.

## Shapes

The shape system adopts a **Soft Industrial (`roundedness: 1`)** specification. 

- UI elements feature tight, controlled corners (`4px` base radius) that evoke precision-machined sports hardware and aerospace digital displays rather than toy-like rounded bubbles.
- Larger cards and bottom sheets step up to `8px` (`rounded-lg`), retaining structural rigidity and maximizing usable screen estate for numerical data columns.
- Fully circular radii are restricted exclusively to status indicators, progress rings, and check-toggles.

## Components

### Buttons
- **Primary Kinetic Action (Complete Set / Finish Workout):** Full-bleed or fixed-width, background `#D4FF00`, text `#0D1117`, font weight 700. Active state scales to `98%` with zero transition lag for instantaneous haptic feedback.
- **Secondary / Ghost (Add Set / Warmup):** Transparent surface with a `1px` `#30363D` border, hovering/active states shifting to `#21262D` with text `#F0F6FC`.
- **Destructive / Reset:** Bordered `#FF5500` with muted label text, converting to full `#FF5500` background upon confirmation.

### Data Chips & Badges
- **PR Achievement Badge:** High-intensity `#FF5500` tinted surface (`rgba(255, 85, 0, 0.15)`), solid `#FF5500` outline, uppercase `label-mono` typography, paired with a miniature flame/spark vector.
- **RPE / RIR Chips:** Rectangular `4px` radius tags using `#21262D` backing with `#00F0FF` text denoting proximity to failure.

### Workout Logging Grids
- Tabular set lists with four standardized columns: `[SET]`, `[PREVIOUS]`, `[KG / LBS]`, `[REPS]`, and `[STATUS]`.
- Numeric inputs are built using `data-display-md` in `JetBrains Mono`. Inputs feature a recessed `#0D1117` background with a subtle inset shadow to indicate tactile depth.
- Completion trigger is an oversized `36x36px` square button with rounded `4px` edges; tapping transitions the tile from dark slate to brilliant `#D4FF00` with a sharp black checkmark.

### Progress Rings & Chronometers
- SVG/Canvas-driven circular tracks with a track base of `#21262D` (4px stroke) and active stroke in `#D4FF00` (6px stroke, flat cap).
- Center displays monospaced countdown clock with glowing micro-indicators when resting window hits its final 10-second mark.

### Nutrition & Macro Bars
- Segmented linear split bars: Protein (`#00F0FF`), Carbs (`#D4FF00`), Fats (`#FF5500`).
- Integrated numeric readouts pairing actual grams vs. target grams in `label-mono`.