---
name: uiux-design
description: Complete UI/UX design system — from research to production components
triggers: [design, ui, ux, interface, wireframe, component, figma, visual]
---

# SKILL: UI/UX Design

## Purpose
Design interfaces that users actually want to use — not just functional, but excellent.
Covers: user research, information architecture, visual design, component systems, accessibility.

## Process

### Step 1: User Research Foundation
- Who are the users? (personas with real pain points)
- What are the top 3 jobs-to-be-done?
- What do current solutions do wrong?
- Accessibility requirements (WCAG AA minimum)

### Step 2: Information Architecture
- Site map / app flow (every screen, every path)
- Navigation structure
- Content hierarchy
- Key user journeys (drawn as flows)

### Step 3: Design Token System
Define BEFORE designing any components:
```
Colors:
  --color-primary: [hue] (accessible contrast ratio ≥ 4.5:1)
  --color-secondary
  --color-accent
  --color-neutral-50 through --color-neutral-950
  --color-error / --color-warning / --color-success

Typography:
  --font-sans: [stack]
  --font-mono: [stack]
  --text-xs: 0.75rem (12px)
  --text-sm: 0.875rem (14px)
  --text-base: 1rem (16px)
  --text-lg through --text-5xl

Spacing: 4px base grid (4, 8, 12, 16, 24, 32, 48, 64, 96)
Border radius: --radius-sm, --radius-md, --radius-lg, --radius-full
Shadows: --shadow-sm, --shadow-md, --shadow-lg
```

### Step 4: Component Library Design
Priority order (design these first):
1. Button (primary, secondary, ghost, destructive, icon)
2. Input (text, email, password, search, textarea)
3. Card
4. Navigation (header, sidebar, mobile nav)
5. Modal / Dialog
6. Form
7. Table / List
8. Badge / Tag / Status indicator
9. Toast / Alert / Notification
10. Loading states (skeleton, spinner)

### Step 5: Key Screen Designs
- Landing/home
- Authentication (login, signup, password reset)
- Dashboard/main
- Detail view
- Empty states (no data, first use)
- Error states (404, 500, network error)
- Success states
- Mobile views (all screens above, mobile-first)

### Step 6: Interaction Design
- Hover states
- Focus states (keyboard navigation)
- Loading states
- Animation guidelines (subtle, purposeful, ≤ 300ms)
- Transition patterns

### Step 7: Accessibility Audit
```
□ All images have alt text
□ Color contrast ≥ 4.5:1 for normal text, 3:1 for large text
□ Keyboard navigation works for all interactive elements
□ ARIA labels on icon-only buttons
□ Form fields have associated labels
□ Error messages are descriptive
□ Focus indicators visible
□ Screen reader tested
```

## Output
- Design token definitions (CSS variables)
- Component spec (behavior + variants + states)
- Screen specifications
- Accessibility checklist
- Handoff notes for implementation

## Quality checks
- [ ] Tokens defined before components designed
- [ ] Every component has all states designed (default, hover, focus, disabled, error)
- [ ] Mobile views exist for all screens
- [ ] Accessibility audit complete
- [ ] Empty states designed (often forgotten)
