---
version: alpha
name: RUTA Mobile design-analysis
description: >-
  A citizen-science sensor-data-collection mobile app with a dark-first,
  privacy-focused interface. The base canvas is very dark navy (`#1A1A2E`)
  with elevated cards in a slightly lighter dark navy (`#16213E`). The
  brand voltage is a muted slate blue (`#4A5A7A`) for primary CTAs, with a
  light blue accent (`#64B5F6`) reserved for interactive elements and active
  states. No light-mode — an intentional dark-only UI to maintain high
  contrast during outdoor rides. Built with React Native / Expo SDK 54.

colors:
  primary: "#4A5A7A"
  secondary: "#5E60CE"
  accent: "#64B5F6"
  background: "#1A1A2E"
  background-alt: "#16213E"
  text: "#FFFFFF"
  text-grey: "#B0B0B0"
  text-category: "#9fb3d8"
  border: "#3A3A5A"
  card-unused: "#2A2A4A"
  warning-border: "#ffb74d"
  warning-text: "#ffcc80"
  error: "#ef5350"
  success-badge: "#2e7d32"
  danger-badge: "#b71c1c"
  badge-text: "#ffffff"
  button-text: "#ffffff"
  button-disabled-text: "#CCCCCC"
  switch-thumb-off: "#B0B0B0"
  switch-thumb-on: "#ffffff"
  vehicle-disabled-border: "#556"
  vehicle-disabled-icon: "#8b8b8b"
  vehicle-disabled-text: "#9e9e9e"
  modal-overlay: "rgba(0,0,0,0.7)"
  notification-color: "#000000"

typography:
  title:
    fontFamily: Inter_700Bold
    fontSize: 24px
    fontWeight: "800"
    lineHeight: 1.2
    letterSpacing: 0
    textAlign: left
    color: "{colors.text}"
  subtitle:
    fontFamily: Inter_600SemiBold
    fontSize: 18px
    fontWeight: "700"
    lineHeight: 1.3
    letterSpacing: 0
    textAlign: left
    color: "{colors.text}"
  body:
    fontFamily: Inter_400Regular
    fontSize: 15px
    fontWeight: "500"
    lineHeight: 22px
    letterSpacing: 0
    textAlign: left
    color: "{colors.text}"
  button:
    fontFamily: Inter_600SemiBold
    fontSize: 16px
    fontWeight: bold
    lineHeight: 1.0
    letterSpacing: 0
    textAlign: center
    color: "{colors.button-text}"
  button-disabled:
    fontFamily: Inter_600SemiBold
    fontSize: 16px
    fontWeight: bold
    lineHeight: 1.0
    letterSpacing: 0
    textAlign: center
    color: "{colors.button-disabled-text}"
  caption:
    fontFamily: Inter_400Regular
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 1.4
    letterSpacing: 0
    color: "{colors.text-grey}"
  caption-uppercase:
    fontFamily: Inter_700Bold
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 1.4
    letterSpacing: 0
    color: "{colors.text}"
  stat-label:
    fontFamily: Inter_400Regular
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 1.4
    color: "{colors.text}"
  stat-value:
    fontFamily: Inter_400Regular
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 1.4
    color: "{colors.text}"
  section-title:
    fontFamily: Inter_600SemiBold
    fontSize: 16px
    fontWeight: "700"
    lineHeight: 1.3
    color: "{colors.text}"
  swipe-label:
    fontFamily: Inter_700Bold
    fontSize: 24px
    fontWeight: "800"
    lineHeight: 1.0
    color: "{colors.badge-text}"
  small-label:
    fontFamily: Inter_400Regular
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 1.4
    color: "{colors.text-grey}"
  day-badge:
    fontFamily: Inter_600SemiBold
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 1.4
    color: "{colors.badge-text}"

rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 22px
  xxl: 28px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 6px
  sm: 8px
  base: 10px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  section: 30px

components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.button-text}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 16px
    marginTop: 10px
    width: 100%
    minHeight: 48px
    shadowColor: "#000"
    shadowOffset: "{0, 2}"
    shadowOpacity: 0.25
    shadowRadius: 3.84px
    elevation: 5
  button-disabled:
    backgroundColor: "{colors.text-grey}"
    opacity: 0.6
  button-instructions:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.button-text}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    paddingVertical: 14px
    boxShadow: "0px 4px 14px rgba(0,0,0,0.25)"
  button-back:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.button-text}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    paddingVertical: 14px
    boxShadow: "0px 4px 14px rgba(0,0,0,0.25)"
  card:
    backgroundColor: "{colors.background-alt}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    marginVertical: "{spacing.sm}"
    width: 100%
    boxShadow: "0px 2px 3px rgba(0,0,0,0.1)"
  vehicle-card:
    backgroundColor: "{colors.background-alt}"
    rounded: "{rounded.lg}"
    borderWidth: 1px
    width: 140px
    height: 120px
    padding: "{spacing.base}"
    boxShadow: "0px 6px 16px rgba(0,0,0,0.25)"
  vehicle-card-enabled:
    borderColor: "{colors.border}"
    iconColor: "{colors.text}"
    labelColor: "{colors.text}"
  vehicle-card-disabled:
    borderColor: "{colors.vehicle-disabled-border}"
    iconColor: "{colors.vehicle-disabled-icon}"
    labelColor: "{colors.vehicle-disabled-text}"
  vehicle-card-badge:
    rounded: "{rounded.sm}"
    paddingHorizontal: "{spacing.xs}"
    paddingVertical: "{spacing.xxs}"
    fontSize: 12px
    color: "{colors.badge-text}"
  vehicle-card-badge-shown:
    backgroundColor: "{colors.success-badge}"
  vehicle-card-badge-hidden:
    backgroundColor: "{colors.danger-badge}"
  swipe-to-confirm:
    trackColor: "#1e2a44"
    trackHeight: 56px
    trackRounded: "{rounded.xxl}"
    thumbColor: "{colors.accent}"
    thumbSize: 44px
    thumbRounded: "{rounded.xl}"
    labelFontSize: 24px
    labelWeight: "800"
    centerTextSize: 14px
    boxShadow: "0px 4px 12px rgba(0,0,0,0.25)"
  switch:
    trackColorFalse: "{colors.border}"
    trackColorTrue: "{colors.accent}"
    thumbColorOff: "{colors.switch-thumb-off}"
    thumbColorOn: "{colors.switch-thumb-on}"
  language-switcher:
    containerGap: "{spacing.sm}"
    buttonPaddingHorizontal: "{spacing.lg}"
    buttonPaddingVertical: "{spacing.sm}"
    buttonRounded: "{rounded.md}"
    buttonBackground: "{colors.background-alt}"
    buttonBorderColor: "{colors.background-alt}"
    buttonBorderWidth: 1px
    activeButtonBackground: "{colors.accent}"
    activeButtonBorderColor: "{colors.accent}"
    buttonTextColor: "{colors.text}"
    buttonTextOpacity: 0.7
    activeButtonTextOpacity: 1
    activeButtonTextColor: "{colors.badge-text}"
  day-badge:
    rounded: "{rounded.sm}"
    paddingHorizontal: "{spacing.sm}"
    paddingVertical: "{spacing.xxs}"
    minWidth: 32px
    activeBackground: "{colors.accent}"
    inactiveBackground: "{colors.border}"
    textColor: "{colors.badge-text}"
  ruta-logo:
    rounded: "{rounded.md}"
    sizes:
      small: 32px
      medium: 48px
      large: 80px
      xlarge: 120px
  crias-logo:
    width: 80px
    height: 80px
    opacity: 0.8
    resizeMode: contain
    logoTextSize: 12px
    logoTextOpacity: 0.6
  modal:
    overlayBackground: "{colors.modal-overlay}"
    contentPadding: "{spacing.xl}"
    contentWidth: 100%
    contentMaxWidth: 400px
  time-button:
    backgroundColor: "{colors.background-alt}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    marginTop: "{spacing.lg}"
    flexDirection: row
    gap: "{spacing.base}"
  stat-row:
    flexDirection: row
    justifyContent: space-between
    paddingVertical: "{spacing.xs}"
  section-title-component:
    marginTop: "{spacing.lg}"
    marginBottom: 4px
  delete-button:
    padding: "{spacing.sm}"
    iconColor: "{colors.error}"
---

## Overview

RUTA Mobile is a **dark-only** citizen science mobile app for collecting sensor data (accelerometer, gyroscope, magnetometer, GPS) during vehicle rides. The interface is built exclusively for a dark theme — no light mode is supported. This is intentional: the app is used outdoors where a dark UI reduces glare, preserves battery on OLED screens, and keeps the interface readable in direct sunlight.

The aesthetic is **utilitarian and data-focused**. The very dark navy canvas (`{colors.background}` — #1A1A2E) paired with slightly lighter elevated surfaces (`{colors.background-alt}` — #16213E) creates a quiet, non-distracting backdrop for real-time sensor data. The branding is restrained — a single muted slate blue primary (`{colors.primary}` — #4A5A7A) for CTAs, with a light blue accent (`{colors.accent}` — #64B5F6) reserved for interactive elements (toggles, active states, swipe gesture thumbs). Text is pure white (`{colors.text}` — #FFFFFF) at maximum contrast.

The strongest visual signature is the **all-dark interface** — no light surfaces exist anywhere in the app. Cards use subtle `1px` borders (`{colors.border}` — #3A3A5A) and soft drop shadows instead of background color changes for hierarchy.

**Key Characteristics:**
- Dark-only — no light mode, no `useColorScheme()` usage.
- Very dark navy (#1A1A2E) primary canvas, slightly lighter dark navy (#16213E) for elevated surfaces.
- Single primary CTA: muted slate blue at `{rounded.lg}` (10px).
- Light blue accent (#64B5F6) for interactive elements only — not for CTAs.
- Inter as the single sans family (400/600/700 weights).
- Pure white text at maximum contrast.
- All component styling via React Native `StyleSheet.create()` — no CSS.
- Data stored as CSV files in `FileSystem.documentDirectory/rides/{rideId}/`.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #4A5A7A): Muted slate blue — primary CTA fill, back buttons, default button backgrounds.
- **Secondary** (`{colors.secondary}` — #5E60CE): Medium purple-blue — instructions/primary action buttons.
- **Accent** (`{colors.accent}` — #64B5F6): Light blue — toggle active track, SwipeToConfirm thumb, day badges active state, language switcher active state, activity indicators. Never used as a CTA fill.

### Surface
- **Background** (`{colors.background}` — #1A1A2E): Very dark navy — main screen backgrounds, `ScrollView` canvases, safe area fills.
- **Background Alt** (`{colors.background-alt}` — #16213E): Dark navy — card backgrounds, alternate surfaces, time button backgrounds.
- **Border** (`{colors.border}` — #3A3A5A): Dark gray-blue — card outlines, Switch track in false state, day badge inactive state.

### Text
- **Text** (`{colors.text}` — #FFFFFF): Pure white — all primary body, headings, labels.
- **Text Grey** (`{colors.text-grey}` — #B0B0B0): Medium gray — disabled UI, muted text, secondary labels, description text.
- **Text Category** (`{colors.text-category}` — #9fb3d8): Light slate — vehicle category labels.
- **Button Text Disabled** (`{colors.button-disabled-text}` — #CCCCCC): Light gray — disabled button label text.
- **Badge Text** (`{colors.badge-text}` — #ffffff): White — badge labels, day badge text, swipe label text.

### Semantic & State
- **Warning Border** (`{colors.warning-border}` — #ffb74d): Amber — low-storage and permission warning card borders.
- **Warning Text** (`{colors.warning-text}` — #ffcc80): Light amber — warning message text inside warning cards.
- **Error** (`{colors.error}` — #ef5350): Red — delete/trash icon color.
- **Success Badge** (`{colors.success-badge}` — #2e7d32): Green — "Shown" vehicle visibility badge.
- **Danger Badge** (`{colors.danger-badge}` — #b71c1c): Dark red — "Hidden" vehicle visibility badge.
- **Vehicle Disabled Border** (`{colors.vehicle-disabled-border}` — #556): Dimmed — vehicle card border when disabled.
- **Vehicle Disabled Icon** (`{colors.vehicle-disabled-icon}` — #8b8b8b): Dimmed gray — vehicle icon when disabled.
- **Vehicle Disabled Text** (`{colors.vehicle-disabled-text}` — #9e9e9e): Medium gray — vehicle label when disabled.

### Interactive Elements
- **Switch Thumb Off** (`{colors.switch-thumb-off}` — #B0B0B0): Gray — Switch thumb in false/disabled position.
- **Switch Thumb On** (`{colors.switch-thumb-on}` — #ffffff): White — Switch thumb in true/enabled position.

### Overlay & Chrome
- **Modal Overlay** (`{colors.modal-overlay}` — rgba(0,0,0,0.7)): Semi-transparent black — modal backdrop.
- **Notification Color** (`{colors.notification-color}` — #000000): Android notification channel light color for foreground service.

## Typography

### Font Family
**Inter** is the single sans family across every text role, loaded via `@expo-google-fonts/inter`. Three weights: Inter_400Regular, Inter_600SemiBold, Inter_700Bold. No custom typeface — the brand trusts Inter's readability at small mobile sizes.

### Hierarchy

| Token | Size | Weight | Line Height | Family | Use |
|---|---|---|---|---|---|
| `{typography.title}` | 24px | 800 | 1.2 | Inter_700Bold | Page titles, screen headers |
| `{typography.subtitle}` | 18px | 700 | 1.3 | Inter_600SemiBold | Section headings |
| `{typography.section-title}` | 16px | 700 | 1.3 | Inter_600SemiBold | Card section headers (feedback) |
| `{typography.body}` | 15px | 500 | 22px | Inter_400Regular | Default body text, descriptions |
| `{typography.button}` | 16px | bold | 1.0 | Inter_600SemiBold | CTA labels |
| `{typography.stat-label}` | 14px | 400 | 1.4 | Inter_400Regular | Trip statistic labels |
| `{typography.stat-value}` | 14px | 600 | 1.4 | Inter_400Regular | Trip statistic values |
| `{typography.small-label}` | 13px | 400 | 1.4 | Inter_400Regular | Disclaimer text, descriptions |
| `{typography.caption}` | 12px | 400 | 1.4 | Inter_400Regular | Vehicle category labels, badge text |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | Inter_700Bold | Reserved (not currently used) |
| `{typography.day-badge}` | 11px | 600 | 1.4 | Inter_600SemiBold | Day-of-week abbreviation pills |
| `{typography.swipe-label}` | 24px | 800 | 1.0 | Inter_700Bold | Swipe-to-confirm arrow/checkmark |

### Principles
- **Title weight stays at 800** — bold enough to anchor a screen at small mobile sizes.
- **Body at 15px** — slightly larger than standard mobile body (14px) for readability during motion.
- **No negative letter-spacing** — mobile type benefits from default spacing for legibility at small sizes.
- **All text is pure white** (`{colors.text}`) at maximum contrast against the dark canvas.
- **Font loading is blocking** — app shows a loading spinner until Inter is fully loaded via `useFonts`.

## Layout

### Spacing System
- **Base unit:** 2px.
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 6px · `{spacing.sm}` 8px · `{spacing.base}` 10px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 20px · `{spacing.xxl}` 24px · `{spacing.section}` 30px.

### Screen Layout
- **Safe area:** Emulated insets — iOS top 47px / bottom 20px, Android top 40px / bottom 0px.
- **Content padding:** `{spacing.xl}` (20px) on all screens.
- **Card grid:** 2-column flexbox grid for vehicle selection with `gap: 12px`.
- **Feedback screen:** Single-column list layout with stat rows (label left, value right).
- **Settings screen:** Single-column form-style layout with labeled rows.

### Whitespace Philosophy
Generous but not wasteful. Cards are spaced at `{spacing.sm}` (8px) vertical margin. Content sections use `{spacing.xl}` (20px) padding. The dark canvas provides visual breathing room without needing additional whitespace. Key action areas (modal buttons) use `{spacing.xxl}` (24px) separation.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Canvas | `{colors.background}` (#1A1A2E) | Screen backgrounds |
| Card surface | `{colors.background-alt}` (#16213E) | Content cards |
| Hairline border | 1px `{colors.border}` | Card outlines |
| Soft drop | `boxShadow: 0px 2px 3px rgba(0,0,0,0.1)` | Default cards |
| Medium drop | `boxShadow: 0px 4px 12px rgba(0,0,0,0.25)` | Swipe-to-confirm track |
| Strong drop | `boxShadow: 0px 4px 14px rgba(0,0,0,0.25)` | Buttons |
| Strongest drop | `boxShadow: 0px 6px 16px rgba(0,0,0,0.25)` | Vehicle cards |
| Native elevation | `shadowColor #000` + `elevation: 5` | Primary button (React Native) |
| Modal overlay | `rgba(0,0,0,0.7)` | Full-screen modal backdrop |

### Decorative Depth
- No atmospheric gradients or backgrounds — the dark canvas is intentionally flat.
- No parallax or scroll-driven depth effects.
- Shadow intensity correlates with interactivity: buttons (medium-strong) > cards (soft).

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.sm}` | 6px | VehicleCard badges, day badges |
| `{rounded.md}` | 8px | RUTALogo image, LanguageSwitcher buttons |
| `{rounded.lg}` | 10px | All buttons, cards, VehicleCard, time picker buttons |
| `{rounded.xl}` | 22px | SwipeToConfirm thumb (circular) |
| `{rounded.xxl}` | 28px | SwipeToConfirm track (pill-shaped) |
| `{rounded.pill}` | 9999px | Not used (reserved) |

A single `{rounded.lg}` (10px) radius defines the entire component system — buttons, cards, inputs all share the same corner radius. Pill geometry (`{rounded.xxl}` = 28px) is used only for the swipe-to-confirm gesture affordance.

## Components

### Button

**`button`** — Muted slate blue primary action button. Background `{colors.primary}`, text `{colors.button-text}`, type `{typography.button}` (16px / bold / Inter_600SemiBold), padding 16px all sides, width 100%, min-height 48px (WCAG AAA touch target). Rounded `{rounded.lg}` (10px). Elevation: native `shadowColor #000` + `elevation: 5`; web `boxShadow: 0px 4px 14px rgba(0,0,0,0.25)`.

**`button-disabled`** — Background `{colors.text-grey}` (#B0B0B0), opacity 0.6, text `{colors.button-disabled-text}` (#CCCCCC).

**`button-instructions`** — Variant for primary action instructions. Background `{colors.secondary}` (#5E60CE). Same text and shape as `button`.

**`button-back`** — Variant for back/navigation actions. Background `{colors.primary}` (#4A5A7A). Same text and shape as `button`.

**State rules:**
- Default: full opacity, primary bg.
- Disabled: grey bg + opacity 0.6 + grey text.
- No distinct hover or press state in the design system (handled by React Native `Pressable` opacity by default).

### Card

**`card`** — Standard information grouping surface. Background `{colors.background-alt}` (#16213E), 1px border `{colors.border}` (#3A3A5A), rounded `{rounded.lg}` (10px), padding `{spacing.md}` (12px), margin-vertical `{spacing.sm}` (8px), width 100%. Web shadow: `0px 2px 3px rgba(0,0,0,0.1)`. Used for terms, settings groups, trip stats, and informational sections.

### Vehicle Card

**`vehicle-card`** — Selectable vehicle icon card in a 2-column grid. Fixed 140×120px, background `{colors.background-alt}`, rounded `{rounded.lg}`, border 1px, padding `{spacing.base}` (10px). Web shadow: `0px 6px 16px rgba(0,0,0,0.25)`. Uses Ionicons at size 34 for vehicle icons.

**`vehicle-card-enabled`** — Border `{colors.border}`, icon/text `{colors.text}`.

**`vehicle-card-disabled`** — Border `{colors.vehicle-disabled-border}` (#556), icon `{colors.vehicle-disabled-icon}` (#8b8b8b), label `{colors.vehicle-disabled-text}` (#9e9e9e).

**`vehicle-card-badge`** — Absolute-positioned corner badge (top-right). Rounded `{rounded.sm}` (6px), text 12px white, padding 2px horizontal / 6px vertical.

- `badge-shown`: Background `{colors.success-badge}` (#2e7d32), label "Shown".
- `badge-hidden`: Background `{colors.danger-badge}` (#b71c1c), label "Hidden".

### Swipe To Confirm

**`swipe-to-confirm`** — Horizontal swipe gesture to start a trip recording. Full-width pill track (56px height) in `#1e2a44`, rounded `{rounded.xxl}` (28px). Circular thumb (44×44px, fully circular at 22px radius) in `{colors.accent}` (#64B5F6), inset 6px from the left edge. Web shadow: `0px 4px 12px rgba(0,0,0,0.25)`. Label shows a right-arrow (→) transitioning to a checkmark (✓) on completion. Center text ("Desliza para iniciar" / "Swipe to start") sits centered in the track, rendered behind the thumb. Built with `react-native-gesture-handler` Pan gesture + Reanimated.

### Switch / Toggle

**`switch`** — Standard React Native `Switch` component. Track: `{colors.border}` (#3A3A5A) for false, `{colors.accent}` (#64B5F6) for true. Thumb: `{colors.switch-thumb-off}` (#B0B0B0) for disabled/false, `{colors.switch-thumb-on}` (#ffffff) for enabled/true. Used for background GPS toggle and notification scheduling toggle.

### Language Switcher

**`language-switcher`** — Horizontal row of two language buttons (ES / EN). Buttons: background `{colors.background-alt}`, 1px border matching background, rounded `{rounded.md}` (8px), padding 8px vertical / 16px horizontal. Text: `{colors.text}` at 14px / 600 weight / opacity 0.7. Active button: background and border become `{colors.accent}` (#64B5F6), text goes to full opacity at `{colors.badge-text}` (#ffffff). Container uses `gap: 8px` between buttons.

### Day Badge

**`day-badge`** — Small day-of-week abbreviation pill (L/M/M/J/V/S/D). Rounded `{rounded.sm}` (6px), padding 2px vertical / 8px horizontal, min-width 32px, text 11px / 600 weight / white. Background toggles: active = `{colors.accent}`, inactive = `{colors.border}`. Container uses `gap: 6px` between badges.

### RUTALogo

**`ruta-logo`** — App logo image. Rounded `{rounded.md}` (8px). Available in five sizes:

| Size Prop | Dimensions | File |
|---|---|---|
| `small` | 32×32 | Logo PNG |
| `medium` | 48×48 | Logo PNG |
| `large` | 80×80 | Logo PNG |
| `xlarge` | 120×120 | Logo PNG |
| default | 48×48 | `assets/images/b8ffb960-...png` |

### CRIASLogo

**`crias-logo`** — Organization branding logo. Fixed 80×80px, opacity 0.8, `resizeMode: contain`. Below it, `{typography.caption}` text "Powered by CRIAS Solutions" at 12px / opacity 0.6. Displayed at the bottom of screen layouts.

### Modal

**`modal`** — Full-screen overlay for settings (notification time picker, day picker). Overlay: `rgba(0,0,0,0.7)`, flexbox centered. Content: `{colors.background}` canvas, padding `{spacing.xl}` (20px), max-width 400px. Action buttons at `margin-top: 24px` in a horizontal row.

### Stat Row & Section Title

**`stat-row`** — Row layout for trip summary dashboard. Label (left-aligned, `{typography.stat-label}`) + value (right-aligned, `{typography.stat-value}`, font-weight 600). Padding vertical 6px.

**`section-title-component`** — Section header within trip feedback cards. `{typography.section-title}` (16px / 700), margin-top 16px, margin-bottom 4px.

## Do's and Don'ts

### Do
- Use `{colors.primary}` (#4A5A7A) for all primary CTAs and navigation buttons.
- Use `{colors.accent}` (#64B5F6) for interactive state indicators — toggle tracks, active badges, swipe thumbs.
- Keep all surfaces dark — never introduce a light or white surface.
- Use `{rounded.lg}` (10px) consistently for all buttons, cards, and inputs.
- Use Inter exclusively via Expo Google Fonts — no other typefaces.
- Set all body text to `{colors.text}` (#ffffff) for maximum contrast.
- Use `{colors.border}` (#3A3A5A) as the only card border color.
- Store sensor data as CSV files under `rides/{rideId}/` directory.

### Don't
- Don't introduce a light mode or `useColorScheme()` switching. The app is dark-only.
- Don't use `{colors.accent}` (#64B5F6) as a CTA button background — it's for interactive states only.
- Don't use `{colors.secondary}` (#5E60CE) outside of the instructions button variant.
- Don't use font weights above 800 — Inter_700Bold is the heaviest used.
- Don't introduce additional border radius values — stick to the `{rounded}` scale.
- Don't use pill-shaped buttons — pills are only for the swipe-to-confirm gesture track.
- Don't add atmospheric gradients, hero imagery, or decorative illustrations. The UI is utilitarian.
- Don't reference `{colors.card}` (#2A2A4A) — it is defined but unused.
- Don't add box shadows that exceed `6px 16px rgba(0,0,0,0.25)` — the strongest shadow is for vehicle cards only.

## Responsive Behavior

### Platform Targets
- **Primary:** iOS and Android native via React Native.
- **Secondary:** Web via `react-native-web` (Expo web).
- **Desktop:** Not a target — screen layouts are mobile-first.

### Web Breakpoints

| Width | Key Changes |
|---|---|
| < 480px | Single-column layout (default mobile) |
| 480–768px | Content fills viewport width at 20px padding |
| > 768px | Content width capped by flex layout (no max-width wrapper) |

### Touch Targets
- All buttons: minimum 48px height (WCAG AAA).
- Switch: native component (WCAG AA compliant).
- SwipeToConfirm: 56px height track (exceeds AAA).
- Language buttons: 32px+ height (WCAG AA).
- Day badges: 24px+ height (smallest interactive element).

### Collapsing Strategy
- Vehicle grid: 2-column → single column at narrow widths.
- Modal: Full-width content at < 400px, centered max-width 400px at wider views.
- Settings: Standard vertical form layout at all widths — no multi-column.

## Iteration Guide

1. All color tokens live in `styles/commonStyles.ts` — edit there first, then components consume via import.
2. Buttons default to `{rounded.lg}` (10px). Cards use `{rounded.lg}` (10px). Badges use `{rounded.sm}` (6px).
3. Component variants are defined as separate entries.
4. Use token references exclusively — never inline hex values.
5. Hover states are not defined — mobile is touch-first.
6. Inter 400 for body, Inter 600 for button/section headers, Inter 700 for titles.
7. `{colors.accent}` stays for interactive states only — never on a CTA.

## Known Gaps

- Inter is loaded via `@expo-google-fonts/inter` — no licensing concerns.
- Animation timings (swipe gesture transitions, screen transitions) are handled by Reanimated but not captured as design tokens.
- In-app sensor data visualization surfaces (real-time charts/meters) not yet built — no component tokens available.
- Form validation states beyond the Switch component not documented.
- Loading states: only a centered `ActivityIndicator` (accent color) pattern is used — no skeleton screens.
- Error states: no dedicated error banner component — console.log + conditional text rendering is the current pattern.
