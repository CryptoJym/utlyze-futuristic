# Z-Index Style Guide

## Overview

This document defines the systematic z-index layering system used across the Utlyze website. The system uses CSS custom properties to create a predictable, maintainable stacking order that eliminates arbitrary values and prevents stacking conflicts.

## The Z-Index Scale

All z-index values are defined as CSS custom properties in `style.css` within the `:root` selector:

```css
/* Z-Index Scale - Systematic layering for UI elements */
--z-base: 0;              /* Base content layer */
--z-dropdown: 1000;       /* Dropdowns, select menus */
--z-sticky: 1100;         /* Sticky headers, navigation */
--z-fixed: 1200;          /* Fixed position elements */
--z-overlay: 1500;        /* Overlays, backdrops */
--z-modal-backdrop: 2000; /* Modal backdrop layer */
--z-modal: 2100;          /* Modal dialogs */
--z-popover: 2200;        /* Popovers, tooltips over modals */
--z-toast: 3000;          /* Toast notifications */
--z-tooltip: 4000;        /* Tooltips (highest priority) */
```

## Layer Definitions

### 1. Base Content Layer (`--z-base: 0`)

**Purpose**: Default content that doesn't need to appear above anything else.

**Use cases**:
- Regular page content
- Component-level stacking (may use numeric 1-3 for local hierarchy)
- Background decorative elements
- Hero section backgrounds

**Example**:
```css
.hero-background {
  position: absolute;
  z-index: var(--z-base);
}
```

### 2. Dropdown Layer (`--z-dropdown: 1000`)

**Purpose**: Interactive elements that appear above content but below sticky navigation.

**Use cases**:
- Form dropdown menus
- Select inputs when expanded
- Autocomplete suggestions
- Submit buttons that need to stay above content

**Example**:
```css
.submit-btn {
  position: relative;
  z-index: var(--z-dropdown);
}
```

### 3. Sticky Navigation Layer (`--z-sticky: 1100`)

**Purpose**: Navigation elements that stick to viewport edges.

**Use cases**:
- Site headers (`.site-header`)
- Sticky navigation bars
- Table of contents sidebars
- Sticky section headers

**Example**:
```css
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}
```

**Important**: Sticky elements should NOT appear above modals or overlays.

### 4. Fixed Position Layer (`--z-fixed: 1200`)

**Purpose**: Elements fixed to viewport that aren't navigation.

**Use cases**:
- Resources rail sidebar
- Mobile action bars
- Back-to-top buttons
- Fixed CTA buttons
- Floating help widgets

**Example**:
```css
.mobile-action-bar {
  position: fixed;
  bottom: 0;
  z-index: var(--z-fixed);
}
```

### 5. Overlay Layer (`--z-overlay: 1500`)

**Purpose**: General semi-transparent overlays.

**Use cases**:
- Loading overlays
- Image lightbox backgrounds
- Full-screen takeover backgrounds

**Example**:
```css
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(0, 0, 0, 0.5);
}
```

### 6. Modal Backdrop Layer (`--z-modal-backdrop: 2000`)

**Purpose**: Dark overlay behind modal content.

**Use cases**:
- Modal dialog backdrops
- Mobile menu backdrops
- Overlay that blocks interaction with page

**Example**:
```css
body.menu-open::before {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  background: rgba(0, 0, 0, 0.4);
}
```

**Critical**: Must be BELOW `--z-modal` to allow modal content to appear on top.

### 7. Modal Content Layer (`--z-modal: 2100`)

**Purpose**: Modal dialogs and full-screen panels.

**Use cases**:
- Modal dialog boxes
- Mobile menu panels
- Full-screen overlays
- Confirmation dialogs
- Newsletter signup modals

**Example**:
```css
.modal {
  position: fixed;
  z-index: var(--z-modal);
}

.nav-links {
  position: fixed;
  z-index: var(--z-modal); /* On mobile when menu is open */
}
```

### 8. Popover Layer (`--z-popover: 2200`)

**Purpose**: Elements that must appear above modals.

**Use cases**:
- Navigation toggle button (must stay clickable when menu is open)
- Close buttons on modals
- Context menus within modals
- Dropdown menus within modals

**Example**:
```css
.nav-toggle {
  z-index: var(--z-popover);
}
```

**Note**: This is above `--z-modal` to ensure the hamburger menu button remains clickable when the mobile menu is open.

### 9. Toast Notification Layer (`--z-toast: 3000`)

**Purpose**: Temporary notifications and accessibility features.

**Use cases**:
- Success/error toast messages
- Skip-to-main link (accessibility)
- Keyboard navigation indicator
- Temporary notifications
- Mobile calculate button (when fixed on small screens)
- Sticky demo bars

**Example**:
```css
.skip-to-main:focus {
  z-index: var(--z-toast);
}

.keyboard-nav-indicator {
  z-index: var(--z-toast);
}
```

**Important**: Accessibility features should use this layer to ensure visibility when focused.

### 10. Tooltip Layer (`--z-tooltip: 4000`)

**Purpose**: Context-sensitive help that appears above everything.

**Use cases**:
- Tooltips on hover
- Help bubbles
- Field hints
- Inline documentation

**Example**:
```css
.tooltip {
  position: absolute;
  z-index: var(--z-tooltip);
}
```

## Usage Guidelines

### DO:

✅ **Use CSS custom properties** instead of hardcoded numeric values:
```css
/* Good */
.modal {
  z-index: var(--z-modal);
}

/* Bad */
.modal {
  z-index: 9999;
}
```

✅ **Choose the semantic layer** that matches your element's purpose:
- Is it a modal? Use `--z-modal`
- Is it sticky navigation? Use `--z-sticky`
- Is it a notification? Use `--z-toast`

✅ **Keep component-level stacking numeric** for local hierarchies:
```css
/* Good - local stacking within a component */
.card-background {
  z-index: 1;
}
.card-content {
  z-index: 2;
}
```

✅ **Document any exceptions** with inline comments:
```css
.special-case {
  z-index: var(--z-overlay);
  /* Needs overlay layer to appear above fixed sidebar on mobile */
}
```

### DON'T:

❌ **Never use extreme values** like 999999, 10000, or MAX_INT (2147483647):
```css
/* Bad - creates unpredictable stacking */
.header {
  z-index: 999999 !important;
}
```

❌ **Don't mix hardcoded and custom property z-index** in the same layer:
```css
/* Bad - inconsistent */
.modal-backdrop {
  z-index: 2000;
}
.modal-content {
  z-index: var(--z-modal);
}

/* Good - consistent */
.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}
.modal-content {
  z-index: var(--z-modal);
}
```

❌ **Don't add z-index without position**:
```css
/* Bad - z-index has no effect on static elements */
.element {
  z-index: var(--z-sticky);
}

/* Good */
.element {
  position: relative; /* or absolute, fixed, sticky */
  z-index: var(--z-sticky);
}
```

❌ **Don't use !important** unless absolutely necessary:
```css
/* Bad - makes debugging difficult */
.header {
  z-index: var(--z-sticky) !important;
}

/* Good - fix the underlying issue instead */
.header {
  z-index: var(--z-sticky);
}
```

## Common Patterns

### Mobile Menu System

The mobile menu requires careful layering to ensure all parts work together:

```css
/* Backdrop - behind the menu panel */
body.menu-open::before {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  background: rgba(0, 0, 0, 0.4);
}

/* Menu panel - above the backdrop */
.nav-links {
  position: fixed;
  z-index: var(--z-modal);
}

/* Toggle button - above the menu so it's clickable */
.nav-toggle {
  z-index: var(--z-popover);
}

/* Header - matches modal layer when menu is open */
body.menu-open .site-header {
  z-index: var(--z-modal);
}
```

**Stacking order**: backdrop (2000) < menu panel (2100) < toggle button (2200)

### Sticky Elements with Modals

Sticky headers should appear below modals:

```css
/* Sticky header */
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky); /* 1100 */
}

/* Modal appears above sticky header */
.modal {
  position: fixed;
  z-index: var(--z-modal); /* 2100 */
}
```

### Accessibility Features

Skip links and keyboard indicators need maximum visibility:

```css
.skip-to-main {
  position: fixed;
  top: -100px;
  z-index: var(--z-toast); /* 3000 - above modals */
}

.skip-to-main:focus {
  top: 16px; /* Slides into view */
}

.keyboard-nav-indicator {
  position: fixed;
  z-index: var(--z-toast); /* Always visible when active */
}
```

## Troubleshooting

### Problem: Element not appearing above another

**Solution**: Check if both elements are using the correct z-index layer:

1. Verify both elements have `position: relative|absolute|fixed|sticky`
2. Check that the element that should be on top uses a higher layer
3. Look for parent elements creating new stacking contexts (transform, opacity, filter)

### Problem: Mobile menu toggle not clickable

**Solution**: Ensure toggle button uses `--z-popover`:

```css
.nav-toggle {
  z-index: var(--z-popover); /* Above menu panel */
}
```

### Problem: Modal appears below sticky header

**Solution**: Headers should use `--z-sticky` (1100), modals use `--z-modal` (2100):

```css
.site-header {
  z-index: var(--z-sticky); /* Not higher */
}

.modal {
  z-index: var(--z-modal); /* Correctly above header */
}
```

### Problem: Stacking context issues

Elements with these properties create new stacking contexts:
- `transform` (except `none`)
- `opacity` (less than 1)
- `filter` (except `none`)
- `will-change`
- `isolation: isolate`

If z-index isn't working as expected, check parent elements for these properties.

## Migration from Legacy Values

The following replacements were made during the z-index refactor:

| Old Value | New Value | Notes |
|-----------|-----------|-------|
| 2147483647 (MAX_INT) | `var(--z-toast)` | Used on mobile calculate button |
| 2147483000 | `var(--z-toast)` | Pricing demo bar |
| 1000000 | `var(--z-popover)` | Nav toggle button |
| 999999 | `var(--z-modal)` | Mobile menu header |
| 999998 | `var(--z-modal)` | Mobile menu panel |
| 999997 | `var(--z-modal-backdrop)` | Mobile menu backdrop |
| 10000 | `var(--z-toast)` or `var(--z-modal)` | Context-dependent |
| 9999 | `var(--z-toast)` | Keyboard indicator |
| 1000-1001 | `var(--z-sticky)` or `var(--z-dropdown)` | Based on element type |

## Files Using Z-Index

The z-index system is used in these files:

1. **style.css** - Main stylesheet with :root definitions and 13 implementations
2. **navigation-cleanup.css** - Mobile menu system (4 uses)
3. **roi/index.html** - ROI calculator inline styles (5 uses)
4. **pricing/index.html** - Pricing page sticky bar (1 use)
5. **assets/exported/utlyze-roi-modern-ui.css** - Component styles (numeric values for local stacking)

## Best Practices Summary

1. **Always use CSS custom properties** for global z-index values
2. **Choose semantic layers** based on element purpose
3. **Avoid extreme values** (999999, MAX_INT, etc.)
4. **Document exceptions** with comments
5. **Test stacking** on mobile and desktop
6. **Check accessibility** features appear above all content
7. **Maintain consistency** across the codebase

## Questions?

If you're unsure which z-index layer to use, ask:

1. **What is this element's purpose?** (navigation, modal, notification, etc.)
2. **Should it appear above or below modals?** (most things: below)
3. **Is it an accessibility feature?** (use `--z-toast`)
4. **Does it need to work on mobile?** (test with mobile menu open)

When in doubt, refer to this guide or check existing similar elements in the codebase.

---

**Last Updated**: October 2, 2025
**Version**: 1.0
**Related Tasks**: Task 4 - Implement Z-Index Scale
