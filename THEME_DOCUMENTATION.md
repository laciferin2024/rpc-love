# Theme System Documentation

## Overview

This theme system implements a lightweight, scalable design language inspired by Chain.Love, featuring clean typography, high-contrast neutrals, subtle depth, gentle radii, and support for light, dark, and system modes.

## Design Principles

- **Clarity first**: Restrained palette, clear hierarchy, generous whitespace, predictable spacing rhythm
- **Minimal yet tactile**: Thin dividers, soft elevation, gentle radii; avoid noisy borders and loud shadows
- **Functional simplicity**: Minimal switches and toggles; defaults do the right thing for most users
- **Consistency over customization**: One semantic token system powering all components

## Theme Modes

The theme system supports three modes:

1. **Light**: High-contrast light mode with near-white backgrounds
2. **Dark**: Dark mode with near-black backgrounds and subtle warmth
3. **System**: Automatically follows the user's `prefers-color-scheme` preference

The theme preference is persisted in `localStorage` and applied early via an inline script to prevent flash-of-wrong-theme (FOUC).

## Semantic Token System

### Colors

All colors use semantic naming to enable easy theme switching and future brand pivots:

#### Background & Surfaces

- `background`: Primary app canvas
- `surface`: Default card/panel background layered over background
- `surface-alt`: Secondary surface for headers, sticky bars, or highlighted containers

#### Text

- `text-primary`: Primary text color (high contrast)
- `text-secondary`: Secondary text color
- `text-muted`: Muted text color for less important content

#### Borders & Dividers

- `border`: Standard border color
- `divider`: Divider color with reduced opacity for subtle separation

#### Accent

- `accent`: Primary accent color (used sparingly for CTAs, active states)
- `accent-contrast`: Text color that contrasts with accent background

#### Semantic Colors

- `success` / `success-on`: Success state colors
- `warning` / `warning-on`: Warning state colors
- `danger` / `danger-on`: Error/danger state colors

#### Interactive States

- `focus-ring`: Focus indicator color with opacity
- `selection`: Text selection background color
- `hover`: Hover overlay color
- `active`: Active/pressed overlay color

### Typography

- **Font families**:

  - `font-family-sans`: UI font stack (Inter, system fonts)
  - `font-family-mono`: Code font stack (JetBrains Mono, Fira Code, Consolas)

- **Sizes**: xs, sm, md, lg, xl (with corresponding line heights)
- **Weights**: regular (400), medium (500), semibold (600)

### Spacing

Scale: 2, 4, 6, 8, 12, 16, 24, 32 (in rem units)

### Radii

- `radius-sm`: 4px
- `radius-md`: 8px
- Default radius: 8px (0.5rem)

### Elevation

- `shadow-none`: No shadow
- `shadow-xs`: Subtle shadow for slight elevation
- `shadow-sm`: Soft shadow for cards and panels

### Transitions

- Default duration: 150ms
- Slow duration: 200ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

## Usage

### Using the Theme Hook

```tsx
import { useTheme } from "@/hooks/use-theme"

function MyComponent() {
  const { theme, setTheme, resolvedTheme, isDark } = useTheme()

  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (actual theme being used)
  // isDark: boolean (convenience)
  // setTheme: (mode: ThemeMode) => void
}
```

### Using the Theme Toggle Component

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// Select variant (default)
<ThemeToggle />

// Button variant (cycles through themes)
<ThemeToggle variant="button" />
```

### Using Semantic Tokens in Components

#### Tailwind Classes

```tsx
// Backgrounds
<div className="bg-background">Primary canvas</div>
<div className="bg-surface">Card surface</div>
<div className="bg-surface-alt">Header surface</div>

// Text
<p className="text-text-primary">Primary text</p>
<p className="text-text-secondary">Secondary text</p>
<p className="text-text-muted">Muted text</p>

// Borders
<div className="border border-border">With border</div>
<div className="border-t border-divider">Divider</div>

// Accent
<button className="bg-accent text-accent-contrast">CTA Button</button>

// Semantic colors
<div className="bg-success text-success-on">Success</div>
<div className="bg-warning text-warning-on">Warning</div>
<div className="bg-danger text-danger-on">Error</div>
```

#### CSS Variables

```css
.my-component {
  background: hsl(var(--surface));
  color: hsl(var(--text-primary));
  border: 1px solid hsl(var(--border));
}

.my-accent-button {
  background: hsl(var(--accent));
  color: hsl(var(--accent-contrast));
}
```

## Accessibility

### Contrast Requirements

- Text and interactive elements: ≥ 4.5:1 contrast ratio
- Large text/icons: ≥ 3:1 contrast ratio
- Dividers/borders: ≥ 1.5:1 contrast ratio

All color combinations have been tested to meet WCAG AA standards.

### Focus States

All interactive elements have visible focus rings using the `focus-ring` token:

- 2px outline with sufficient contrast
- Visible on both light and dark surfaces
- Keyboard-only navigation supported

### Reduced Motion

The theme system respects `prefers-reduced-motion`:

- Animations are disabled or minimized
- Transitions are reduced to near-instant
- Scroll behavior is set to auto

### Hit Targets

Interactive elements maintain minimum 40×40 logical pixels where feasible.

## Component Coverage

### App Shell

- Top bar uses `surface-alt`
- Sidebar uses `surface` with clear divider
- Content area uses `background`

### Navigation

- Active tabs use `accent` color
- Hover states use subtle overlay
- Focus states use `focus-ring`

### Buttons

- **Primary**: `accent` background, `accent-contrast` text
- **Secondary**: `surface-alt` background with border
- **Ghost**: Transparent with hover overlay
- All variants include proper focus rings

### Inputs

- Neutral `surface` background
- 1px `border`
- Focus ring replaces heavy inset glows
- Error state uses `danger` tokens

### Tables and Lists

- Sticky headers on `surface-alt`
- Compact row height
- Visible selection state
- Keyboard focus on cells/rows

### Tooltips and Overlays

- Darkened surface in light mode (vice-versa in dark)
- Small radius (`radius-sm`)
- `shadow-sm` elevation
- Delayed fade for readability

### Code Surfaces

- Monospace font family
- Syntax tokens mapped from semantic palette
- Careful contrast for comments/strings across modes

## Migration Guide

### Adding New Components

1. **Use semantic tokens only**: Never hard-code colors
2. **Follow the token naming**: Use `text-primary` not `text-gray-900`
3. **Include focus states**: All interactive elements need focus rings
4. **Test both themes**: Ensure components work in light and dark modes
5. **Respect reduced motion**: Use CSS variables for transition durations

### Example: Creating a New Card Component

```tsx
// ✅ Good - Uses semantic tokens
<div className="bg-surface border border-border rounded-md shadow-sm p-4">
  <h3 className="text-text-primary font-semibold">Title</h3>
  <p className="text-text-secondary">Content</p>
</div>

// ❌ Bad - Hard-coded colors
<div className="bg-white border border-gray-200 rounded-md shadow p-4">
  <h3 className="text-gray-900 font-semibold">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

## Do's and Don'ts

### Do

- ✅ Keep typography tight and legible
- ✅ Prefer medium weight for headings, regular for body
- ✅ Use 1px dividers and subtle shadows for separation
- ✅ Use semantic tokens for all colors
- ✅ Test accessibility (contrast, focus, keyboard navigation)
- ✅ Respect reduced motion preferences

### Don't

- ❌ Introduce saturated background fills or harsh gradients
- ❌ Rely on color alone to indicate state (pair with shape/weight/position)
- ❌ Hard-code colors in components
- ❌ Use heavy borders or loud shadows
- ❌ Ignore accessibility requirements
- ❌ Create theme-specific component variants

## Troubleshooting

### Theme not applying on page load

- Ensure the inline script in `index.html` runs before paint
- Check that `localStorage` is available
- Verify the script runs synchronously

### Colors not updating

- Clear browser cache and `localStorage`
- Check that CSS variables are defined in `:root` and `.dark`
- Verify Tailwind config includes the new color tokens

### Focus rings not visible

- Check that `focus-visible` pseudo-class is used
- Verify `focus-ring` token has sufficient contrast
- Ensure focus styles aren't being overridden

## Future Enhancements

- Per-user theme customization (if needed)
- Additional semantic color variants
- Extended spacing/radii scales
- Animation system with reduced-motion support
