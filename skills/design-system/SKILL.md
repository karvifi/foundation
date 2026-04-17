---
name: design-system
description: Build a complete, production-ready component library with tokens and documentation
triggers: [design system, component library, tokens, storybook, shadcn, tailwind components]
---

# SKILL: Design System

## Purpose
Build a consistent, scalable component library that every project inherits.

## The Token-First Approach
Design tokens before components. Components before pages.

## Token Definition (CSS Variables)
```css
:root {
  /* Color Palette */
  --color-primary-50: [lightest];
  --color-primary-500: [base];
  --color-primary-900: [darkest];
  
  /* Semantic Colors */
  --color-background: [page bg];
  --color-surface: [card bg];
  --color-border: [dividers];
  --color-text-primary: [main text];
  --color-text-secondary: [muted text];
  --color-accent: [call-to-action];
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing (4px base) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-4: 1rem;     /* 16px */
  --space-8: 2rem;     /* 32px */
  --space-16: 4rem;    /* 64px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## Core Components (Priority Order)
1. **Button** — primary, secondary, ghost, destructive, icon-only; all sizes
2. **Input** — text, email, password, search, with label + error state
3. **Card** — default, interactive, with header/footer
4. **Badge/Tag** — status indicators
5. **Modal/Dialog** — with overlay, close button, accessible focus trap
6. **Dropdown/Select** — searchable, multi-select variants
7. **Table** — sortable, paginated, with empty state
8. **Navigation** — header, sidebar, mobile drawer
9. **Form** — field grouping, validation messages
10. **Toast/Alert** — success, error, warning, info variants

## Component Documentation Template
```markdown
# [ComponentName]

## Purpose
[What this component does]

## Variants
- default
- [variant 2]
- [variant 3]

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | "default" | Visual style |
| size | "sm" | "md" | "lg" | "md" | Component size |

## Usage
[Code example]

## Accessibility
- [ARIA attributes]
- [Keyboard behavior]

## Do / Don't
✅ Do: [correct usage]
❌ Don't: [incorrect usage]
```

## Quality checks
- [ ] All tokens defined before any components built
- [ ] Every component has all states (default, hover, focus, disabled, error)
- [ ] Dark mode tokens defined
- [ ] Accessibility verified (WCAG AA)
- [ ] Documentation covers usage + do/don't
