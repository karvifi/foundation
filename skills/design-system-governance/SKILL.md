---
name: design-system-governance
description: Maintain design system quality — versioning, documentation, contribution guidelines, deprecation
triggers: [design system, component library maintenance, versioning, deprecation, documentation]
---

# SKILL: Design System Governance

## Versioning Strategy (Semantic Versioning)

```
Version format: MAJOR.MINOR.PATCH

MAJOR: Breaking changes (v1.0.0 → v2.0.0)
  - Component API changes
  - Prop renames/removals
  - Visual breaking changes
  
MINOR: New features (v1.0.0 → v1.1.0)
  - New components
  - New variants/props (backwards compatible)
  - New utility functions
  
PATCH: Bug fixes (v1.0.0 → v1.0.1)
  - Bug fixes
  - Performance improvements
  - Documentation updates

Example:
v1.2.3 → v1.2.4 (patch: fixed Button hover state)
v1.2.4 → v1.3.0 (minor: added Card component)
v1.3.0 → v2.0.0 (major: renamed Button's `variant` prop to `appearance`)
```

## Component Documentation Template
```mdx
# Button

A clickable element that triggers an action.

## Usage

\`\`\`tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Click me</Button>
\`\`\`

## Variants

### Default
<Button variant="default">Default</Button>

### Destructive  
<Button variant="destructive">Delete</Button>

### Outline
<Button variant="outline">Cancel</Button>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default" \| "destructive" \| "outline"` | `"default"` | Visual style |
| size | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| disabled | `boolean` | `false` | Disable button |

## Accessibility

- Uses semantic `<button>` element
- Keyboard accessible (Enter/Space to activate)
- Focus visible
- ARIA attributes for state

## Examples

### With Icon
\`\`\`tsx
<Button>
  <Icon name="plus" />
  Add Item
</Button>
\`\`\`
```

## Deprecation Process

```tsx
// Step 1: Mark as deprecated (still works)
/** @deprecated Use `appearance` prop instead. Will be removed in v2.0.0 */
type ButtonProps = {
  variant?: string  // ⚠️ Deprecated
  appearance?: string  // ✅ New prop
}

// Step 2: Console warning
function Button({ variant, appearance, ...props }: ButtonProps) {
  if (variant) {
    console.warn('Button: `variant` prop is deprecated. Use `appearance` instead.')
  }
  
  const finalAppearance = appearance || variant || 'default'
  // ...
}

// Step 3: Migration guide in changelog
/*
## v2.0.0 Breaking Changes

### Button: `variant` → `appearance`

**Before:**
<Button variant="primary">Click</Button>

**After:**
<Button appearance="primary">Click</Button>

**Migration:** Find-replace `variant=` with `appearance=`
*/

// Step 4: Remove in next major version (v2.0.0)
```

## Contribution Guidelines

```markdown
# Contributing to Design System

## Adding a New Component

1. **Proposal**: Open issue describing component
2. **Design Review**: Get design approval
3. **Implementation**: Follow patterns
4. **Documentation**: Add to Storybook/docs
5. **Tests**: Write component tests
6. **Accessibility**: Test with screen reader
7. **PR**: Submit for review

## Code Standards

- TypeScript strict mode
- All props typed
- Accessibility required (ARIA, keyboard)
- Tests required (>80% coverage)
- Documentation required
```

## Quality Checks
- [ ] Semantic versioning followed
- [ ] Changelog maintained
- [ ] All components documented
- [ ] Deprecations communicated (warnings + migration guide)
- [ ] Contribution guidelines clear
- [ ] Breaking changes in major versions only
- [ ] Design tokens centralized
- [ ] Component library published to npm
