# UI/UX Design System Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
- [Animations](#animations)
- [Best Practices](#best-practices)

## Overview

This document describes the unified design system for the Uber Clone project. All new components and pages should follow these guidelines to ensure visual consistency and a polished user experience.

## Color Palette

### Primary Colors
- **Primary 600 (Black)**: `#111111` - Main brand color
- **Primary 500**: `#333333` - Hover states
- **Primary 400**: `#666666` - Disabled states

### Accent Colors
#### Green (Success)
- **500**: `#10b461` - Success states, positive actions
- **600**: `#0d9651` - Hover
- **700**: `#0a7841` - Active/Pressed

#### Yellow (Warning)
- **500**: `#f3c164` - Warning states
- **600**: `#f0b84f` - Hover
- **700**: `#edad3a` - Active/Pressed

### Status Colors
- **Success**: `#10b461` - Confirmations, completed actions
- **Error**: `#ef4444` - Errors, destructive actions
- **Warning**: `#f3c164` - Warnings, cautions
- **Info**: `#3b82f6` - Information, tips

### Neutral Grays
Used for text, backgrounds, and borders:
- **Gray 50**: `#fafafa` - Light backgrounds
- **Gray 100**: `#f5f5f5` - Secondary backgrounds
- **Gray 200**: `#e5e5e5` - Borders
- **Gray 400**: `#a3a3a3` - Placeholder text
- **Gray 600**: `#525252` - Secondary text
- **Gray 900**: `#171717` - Primary text

## Typography

### Font Family
- **Primary**: Inter (via Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
| Size | Value | Line Height | Usage |
|------|-------|-------------|-------|
| xs | 0.75rem | 1rem | Captions, small labels |
| sm | 0.875rem | 1.25rem | Body text (small) |
| base | 1rem | 1.5rem | Body text |
| lg | 1.125rem | 1.75rem | Subheadings |
| xl | 1.25rem | 1.75rem | Section headers |
| 2xl | 1.5rem | 2rem | Page titles |
| 3xl | 1.875rem | 2.25rem | Hero text |
| 4xl | 2.25rem | 2.5rem | Display text |

### Font Weights
- **300**: Light (rarely used)
- **400**: Regular (body text)
- **500**: Medium (emphasis)
- **600**: Semibold (headings)
- **700**: Bold (important headings)
- **800**: Extrabold (rare, hero text)

## Spacing & Layout

### Spacing Scale
Tailwind's default spacing scale (0.25rem increments) is used:
- **1** = 0.25rem (4px)
- **2** = 0.5rem (8px)
- **3** = 0.75rem (12px)
- **4** = 1rem (16px)
- **5** = 1.25rem (20px)
- **6** = 1.5rem (24px)
- **8** = 2rem (32px)
- **10** = 2.5rem (40px)
- **12** = 3rem (48px)

### Border Radius
- **Default**: `0.25rem` (4px)
- **md**: `0.375rem` (6px)
- **lg**: `0.5rem` (8px)
- **xl**: `1rem` (16px)
- **2xl**: `1.5rem` (24px)
- **3xl**: `2rem` (32px)
- **Full**: `9999px` (circles)

### Shadows
- **soft**: `0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)`
- **medium**: `0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 15px 30px -3px rgba(0, 0, 0, 0.06)`
- **strong**: `0 10px 40px -5px rgba(0, 0, 0, 0.15), 0 20px 50px -5px rgba(0, 0, 0, 0.1)`

## Components

### Button Component
**Location**: `src/Components/Button.jsx`

#### Variants
- **primary**: Black background, white text (main actions)
- **secondary**: Gray background (secondary actions)
- **success**: Green background (confirmations)
- **warning**: Yellow background (cautions)
- **outline**: Transparent with border (tertiary actions)
- **ghost**: No background, minimal (inline actions)

#### Sizes
- **small**: Compact buttons for tight spaces
- **medium**: Standard size
- **large**: Primary CTAs and mobile-friendly

#### Props
```jsx
<Button
  variant="primary"     // Button style
  size="large"          // Button size
  fullWidth={false}     // Full width on mobile
  loading={false}       // Shows spinner
  disabled={false}      // Disabled state
  icon="ri-icon-name"   // Remix Icon class
  onClick={handleClick}
>
  Button Text
</Button>
```

### Input Component
**Location**: `src/Components/Input.jsx`

#### Features
- Floating labels
- Focus states with ring animation
- Error states with messages
- Icon support (left-aligned)
- Required field indicator

#### Props
```jsx
<Input
  label="Email address"
  type="email"
  placeholder="you@example.com"
  value={value}
  onChange={handleChange}
  required={true}
  error={errorMessage}      // Shows error state
  icon="ri-mail-line"       // Remix Icon class
/>
```

### Loading Components

#### LoadingSpinner
**Location**: `src/Components/LoadingSpinner.jsx`

```jsx
<LoadingSpinner 
  size="medium"     // small, medium, large
  text="Loading..."  // Optional loading text
/>
```

#### SkeletonLoader
**Location**: `src/Components/SkeletonLoader.jsx`

```jsx
<SkeletonLoader variant="text" />     // Text placeholder
<SkeletonLoader variant="title" />    // Title placeholder
<SkeletonLoader variant="circle" />   // Avatar placeholder
<SkeletonLoader variant="card" />     // Card placeholder

// Or use pre-built cards
<SkeletonCard />
```

### Toast Notifications
**Location**: `src/Components/Toast.jsx`

```jsx
import Toast, { useToast } from '../Components/Toast';

function MyComponent() {
  const { toast, showToast, hideToast } = useToast();

  const handleClick = () => {
    showToast('Successfully saved!', 'success');
    // Types: success, error, warning, info
  };

  return (
    <>
      <button onClick={handleClick}>Show Toast</button>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />
    </>
  );
}
```

### AnimatedPage Wrapper
**Location**: `src/Components/AnimatedPage.jsx`

Wrap page components for smooth transitions:

```jsx
import AnimatedPage from '../Components/AnimatedPage';

function MyPage() {
  return (
    <AnimatedPage className="custom-classes">
      {/* Page content */}
    </AnimatedPage>
  );
}
```

## Animations

### CSS Animations (Built-in)
Defined in `tailwind.config.js` and available as Tailwind classes:

- `animate-fadeIn`: Fade in animation (0.3s)
- `animate-slideUp`: Slide up animation (0.3s)
- `animate-slideDown`: Slide down animation (0.3s)
- `animate-scaleIn`: Scale in animation (0.2s)
- `animate-pulse-soft`: Soft pulsing for loading states
- `animate-spin-slow`: Slow rotation (3s)

### Framer Motion Animations
For more complex animations, use Framer Motion:

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Micro-interactions
- **Buttons**: Scale on hover (1.02x) and tap (0.98x)
- **Cards**: Lift on hover (-2px translateY)
- **Inputs**: Ring expansion on focus
- **Loading**: Rotating spinner or shimmer effect

## Best Practices

### Consistency
1. **Always use design tokens**: Use Tailwind classes instead of custom CSS
2. **Component reuse**: Use existing components instead of creating new ones
3. **Color consistency**: Stick to the defined color palette
4. **Spacing consistency**: Use the spacing scale (4px increments)

### Accessibility
1. **Focus states**: Ensure all interactive elements have visible focus indicators
2. **Color contrast**: Maintain WCAG AA standards (4.5:1 for text)
3. **Touch targets**: Minimum 44x44px for mobile buttons
4. **Semantic HTML**: Use proper heading hierarchy and ARIA labels

### Performance
1. **Lazy loading**: Use React lazy() for code splitting
2. **Image optimization**: Compress images and use appropriate formats
3. **Animation performance**: Use CSS transforms and opacity for smooth 60fps
4. **Skeleton loaders**: Show loading placeholders instead of spinners

### Mobile-First
1. **Responsive by default**: Design for mobile first, then scale up
2. **Touch-friendly**: Larger tap targets and spacing on mobile
3. **Safe areas**: Use `safe-top` and `safe-bottom` classes for notches
4. **Full-width on mobile**: Most buttons should be full-width on mobile

### Animation Guidelines
1. **Duration**: 
   - Fast: 200ms (micro-interactions)
   - Medium: 300ms (most UI transitions)
   - Slow: 500ms (page transitions)
2. **Easing**: 
   - Use `ease-out` for entering elements
   - Use `ease-in` for exiting elements
   - Use `ease-in-out` for movements
3. **Reduced motion**: Respect `prefers-reduced-motion` for accessibility

## File Structure

```
src/
├── Components/
│   ├── Button.jsx            # Reusable button component
│   ├── Input.jsx             # Reusable input component
│   ├── LoadingSpinner.jsx    # Loading spinner
│   ├── SkeletonLoader.jsx    # Skeleton placeholders
│   ├── Toast.jsx             # Toast notifications
│   ├── AnimatedPage.jsx      # Page wrapper with animations
│   └── ...other components
├── index.css                 # Global styles & utilities
├── App.css                   # App-specific styles
└── ...
```

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Remix Icon**: https://remixicon.com/
- **Google Fonts**: https://fonts.google.com/specimen/Inter

## Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns
2. Use Tailwind utility classes
3. Add animations for user feedback
4. Test on mobile and desktop
5. Update this documentation
6. Add JSDoc comments to your components

---

**Last Updated**: November 2025
**Version**: 1.0.0
