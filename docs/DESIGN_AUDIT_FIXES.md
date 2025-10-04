# Design Consistency Audit & Fixes

## Problems Identified

### 1. Trust Signals (Hero Section - 3 Bullets)
**Current State:**
- Plain white background `rgba(255, 255, 255, 0.8)`
- Basic border `1px solid rgba(0, 0, 0, 0.1)`
- Inconsistent with glass-card pattern used elsewhere

**Should Be:**
- Glass-card effect to match benefit cards
- Consistent border and shadow treatment

### 2. Certification Badges
**Current State:**
- Gradient background `linear-gradient(135deg, rgba(0, 91, 255, 0.08), rgba(255, 122, 0, 0.08))`
- Different styling from trust signals
- Different from glass-card pattern

**Should Be:**
- Match glass-card pattern for consistency

### 3. Design System Patterns

**Primary Pattern (Glass Card):**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
```

**Should Apply To:**
- Benefit cards ✅ (already correct)
- Trust signals ❌ (needs fix)
- Certification badges ❌ (needs fix)
- Trust metrics ✅ (already glass-card)

## Fixes Applied

1. Convert `.trust-signal` to use glass-card base
2. Convert `.certification-badge` to use glass-card base
3. Ensure consistent padding, borders, and effects
4. Maintain hover states with consistent behavior
5. Remove gradient backgrounds in favor of glass effect
