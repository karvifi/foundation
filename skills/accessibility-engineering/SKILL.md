---
name: accessibility-engineering
description: Build accessible products — WCAG 2.1 AA compliance, keyboard navigation, screen readers
triggers: [accessibility, WCAG, a11y, screen reader, keyboard, ADA, inclusive, accessible]
---

# SKILL: Accessibility Engineering

## Why It Matters
Accessibility is not "nice to have" — it's:
- Legal requirement (ADA in US, AODA in Canada, EN 301 549 in EU)
- Market: 15% of world has disabilities (1.3B people)
- Better UX for everyone: captions help in noisy environments

## WCAG 2.1 Level AA Requirements

### 1. Perceivable (users can see/hear content)

```
□ Color: information not communicated by color alone
  ✗ "Click the red button" (colorblind users won't know which button)
  ✓ "Click the red button labeled 'Submit'" or use icons + text

□ Contrast: text has min 4.5:1 ratio (on backgrounds)
  ✗ Gray text (#999) on white (#FFF) = 2:1 ratio = fail
  ✓ Dark gray (#666) on white = 4.5:1 = pass
  Tool: WebAIM contrast checker

□ Text Alternatives: images must have alt text
  ✗ <img src="dashboard.png" />
  ✓ <img src="dashboard.png" alt="Sales dashboard showing 15% growth in Q4" />
  
  Alt text rules:
  - Decorative images: alt="" (empty)
  - Charts: describe the data, not "chart"
  - Logo: alt="Company Name"
  - Screenshot: describe what it shows

□ Audio & Video: captions required
  ✗ <video src="demo.mp4"> (no captions)
  ✓ <video src="demo.mp4">
      <track kind="captions" src="demo.vtt" />
    </video>
```

### 2. Operable (users can navigate with keyboard)

```
□ Keyboard navigation: all functionality accessible via keyboard
  ✗ Hover-only menus (keyboard users can't access)
  ✓ Tab key navigates to all interactive elements
    Enter/Space activates buttons
    Escape closes modals
    Arrow keys navigate lists

□ Focus indicator: visible focus on all interactive elements
  ✗ :focus { outline: none; }  // DON'T DO THIS
  ✓ :focus { outline: 3px solid #4A90E2; }  // visible outline
  
  Or customize:
  :focus {
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
  }

□ Skip link: bypass repetitive content
  ✓ <a href="#main-content" class="skip-link">Skip to main content</a>
    At top of page, visible on focus
    Allows keyboard users to skip navigation

□ No keyboard traps: users can navigate away from any element
  ✗ Modal that traps focus (can't Tab out)
  ✓ Modal with proper focus management (can Tab out or press Escape)
```

### 3. Understandable (content is clear)

```
□ Language: identify page language
  ✓ <html lang="en">

□ Labels: form inputs have associated labels
  ✗ <input type="email" placeholder="Email" />
  ✓ <label for="email">Email address</label>
     <input type="email" id="email" />

□ Headings: proper hierarchy (h1, h2, h3...)
  ✗ <h1>Product Name</h1>
     <h3>Details</h3>  (skip h2)
  ✓ <h1>Product Name</h1>
     <h2>Details</h2>
     <h3>Price</h3>

□ Instructions: error messages are helpful
  ✗ "Invalid input"
  ✓ "Email must be in format: user@example.com"
```

### 4. Robust (works with assistive technology)

```
□ ARIA (Accessible Rich Internet Applications): when HTML isn't enough
  <button aria-label="Close menu">✕</button>
  <div role="alert">Error message</div>
  <nav aria-label="Main navigation">...</nav>

□ Semantic HTML: use correct elements
  ✗ <div onclick="...">Click me</div>  (not keyboard accessible)
  ✓ <button>Click me</button>

□ Form validation: announce errors to screen readers
  ✗ Just show error text
  ✓ <span role="alert">Email is required</span>
     <input aria-describedby="email-error" />
     <span id="email-error">Email is required</span>
```

## Testing for Accessibility

### Automated Tools (catches ~30% of issues)
```bash
# Install
npm install --save-dev @axe-core/react

# Use in tests
import { axe } from 'jest-axe'

test('homepage is accessible', async () => {
  const { container } = render(<Homepage />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

# Or CLI
npx axe https://yoursite.com
```

### Manual Testing (catches the rest)

**Keyboard navigation test:**
```
1. Unplug mouse
2. Use only Tab, Shift+Tab, Enter, Space, Arrows
3. Can you access every button, link, form field?
4. Is focus visible?
5. Can you exit any modal?
```

**Screen reader test:**
```
1. Install NVDA (Windows) or VoiceOver (Mac)
2. Close browser tab and start over
3. Navigate by headings (H key)
4. Tab through form fields
5. Hear proper labels and instructions?
```

**Color contrast test:**
```bash
# Check every color combination
npx pa11y https://yoursite.com

# Or manually: https://webaim.org/resources/contrastchecker/
```

## Common Accessibility Patterns

### Accessible Button
```jsx
// ✗ WRONG
<div onClick={handleClick} style={{cursor: 'pointer'}}>
  Click me
</div>

// ✓ RIGHT
<button onClick={handleClick}>
  Click me
</button>
```

### Accessible Modal
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm action</h2>
  <p>Are you sure?</p>
  <button>Yes</button>
  <button>Cancel</button>
</div>

// Focus management:
// 1. Move focus INTO modal when opens
// 2. Trap focus (Tab stays in modal)
// 3. Move focus BACK when closes
```

### Accessible Form
```jsx
<form>
  <div>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" aria-describedby="email-help" />
    <span id="email-help">We'll never share your email</span>
  </div>
  
  <div role="alert">
    {errors.email && <span>{errors.email}</span>}
  </div>
</form>
```

## Quality checks
- [ ] Color contrast ≥ 4.5:1 verified (automated + manual check)
- [ ] All images have alt text (meaningful descriptions)
- [ ] All form inputs have labels
- [ ] Keyboard navigation tested (no traps)
- [ ] Focus indicator visible on all interactive elements
- [ ] Semantic HTML used (button, input, nav, etc)
- [ ] Heading hierarchy proper (h1, h2, h3, not skipped)
- [ ] Tested with NVDA / VoiceOver screen reader
- [ ] Automated accessibility scan passes (axe-core)
- [ ] Skip link included (for keyboard users)
