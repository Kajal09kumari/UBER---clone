# UI/UX Quick Reference Guide

## 🎨 Quick Color Reference

```css
/* Primary Brand */
bg-primary-600      /* Black #111111 */
text-primary-600    /* Black text */

/* Success / Captain */
bg-accent-green-500 /* Green #10b461 */
text-white          /* White on green */

/* Warning */
bg-accent-yellow-500 /* Yellow #f3c164 */

/* Error */
bg-error            /* Red #ef4444 */
text-error          /* Red text */

/* Gray Scale */
bg-gray-50          /* Lightest bg */
bg-gray-100         /* Light bg */
text-gray-600       /* Secondary text */
text-gray-900       /* Primary text */
border-gray-200     /* Default border */
```

## 📐 Common Spacing

```css
p-4      /* Padding 1rem (16px) */
p-6      /* Padding 1.5rem (24px) */
m-4      /* Margin 1rem */
gap-4    /* Gap 1rem */

space-y-4  /* Vertical spacing between children */
space-x-4  /* Horizontal spacing between children */
```

## 🔘 Button Quick Start

```jsx
// Primary action
<Button variant="primary" size="large" fullWidth>
  Continue
</Button>

// Secondary action
<Button variant="secondary" size="medium">
  Cancel
</Button>

// Success action (Captain/Green)
<Button variant="success" fullWidth icon="ri-steering-2-line">
  Sign in as Captain
</Button>

// With loading state
<Button loading={isLoading} variant="primary">
  {isLoading ? 'Signing in...' : 'Sign In'}
</Button>
```

## 📝 Input Quick Start

```jsx
// Basic input
<Input
  label="Email address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

// Input with icon
<Input
  label="Email"
  icon="ri-mail-line"
  value={email}
  onChange={handleChange}
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  value={password}
  onChange={handleChange}
/>
```

## 🎬 Animation Quick Start

```jsx
// Wrap page components
import AnimatedPage from '../Components/AnimatedPage';

<AnimatedPage>
  {/* Your page content */}
</AnimatedPage>

// Use Tailwind animation classes
<div className="animate-fadeIn">Fades in</div>
<div className="animate-slideUp">Slides up</div>
<div className="animate-pulse-soft">Pulses softly</div>

// Framer Motion for custom animations
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## ⌛ Loading States

```jsx
// Spinner
import LoadingSpinner from '../Components/LoadingSpinner';

<LoadingSpinner size="medium" text="Loading..." />

// Skeleton
import SkeletonLoader, { SkeletonCard } from '../Components/SkeletonLoader';

{loading ? <SkeletonCard /> : <YourContent />}

<SkeletonLoader variant="text" />
<SkeletonLoader variant="title" />
<SkeletonLoader variant="circle" />
```

## 🔔 Toast Notifications

```jsx
import Toast, { useToast } from '../Components/Toast';

function MyComponent() {
  const { toast, showToast, hideToast } = useToast();

  const handleSuccess = () => {
    showToast('Successfully saved!', 'success');
  };

  return (
    <>
      <button onClick={handleSuccess}>Save</button>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
```

## 📱 Responsive Design

```css
/* Mobile First - Base styles are for mobile */

/* Tablet and up */
md:text-lg        /* Medium screens 768px+ */
md:p-6

/* Desktop */
lg:text-xl        /* Large screens 1024px+ */
lg:p-8

/* Full width on mobile, fixed on desktop */
w-full md:w-96

/* Hide on mobile, show on desktop */
hidden md:block

/* Show on mobile, hide on desktop */
block md:hidden
```

## 🎨 Common Patterns

### Card with Hover
```jsx
<div className="bg-white rounded-2xl shadow-soft p-4 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
  Card content
</div>
```

### Glass Effect
```jsx
<div className="glass rounded-2xl p-6">
  Content with glass effect
</div>
```

### Gradient Background
```jsx
<div className="bg-gradient-to-br from-gray-50 to-gray-100">
  Content
</div>
```

### Custom Scrollbar
```jsx
<div className="overflow-y-auto custom-scrollbar max-h-96">
  Scrollable content
</div>
```

## 🔧 Utility Classes

```css
/* Shadows */
shadow-soft         /* Light shadow */
shadow-medium       /* Medium shadow */
shadow-strong       /* Strong shadow */

/* Border Radius */
rounded-xl          /* 1rem */
rounded-2xl         /* 1.5rem */
rounded-3xl         /* 2rem */

/* Transitions */
transition-all duration-200    /* All properties, 200ms */
transition-colors duration-300 /* Colors only, 300ms */

/* Hover Effects */
hover:scale-105     /* Grow on hover */
hover:opacity-80    /* Fade on hover */
hover:-translate-y-0.5  /* Lift on hover */

/* Focus Rings */
focus:ring-2 focus:ring-primary-500  /* Primary focus */
focus:outline-none                    /* Remove default outline */
```

## 🎯 Common Icons (Remix Icon)

```html
<!-- User/Profile -->
<i className="ri-user-line"></i>
<i className="ri-user-3-fill"></i>

<!-- Location -->
<i className="ri-map-pin-line"></i>
<i className="ri-map-pin-user-fill"></i>

<!-- Navigation -->
<i className="ri-arrow-right-line"></i>
<i className="ri-arrow-down-line"></i>

<!-- Actions -->
<i className="ri-close-line"></i>
<i className="ri-check-line"></i>
<i className="ri-add-line"></i>

<!-- Communication -->
<i className="ri-mail-line"></i>
<i className="ri-phone-line"></i>

<!-- Security -->
<i className="ri-lock-line"></i>
<i className="ri-shield-check-line"></i>

<!-- Status -->
<i className="ri-error-warning-line"></i>
<i className="ri-checkbox-circle-line"></i>
<i className="ri-information-line"></i>

<!-- Vehicles -->
<i className="ri-car-line"></i>
<i className="ri-steering-2-line"></i>
```

## ⚡ Performance Tips

1. **Use Tailwind classes** instead of custom CSS
2. **Lazy load images** with React.lazy()
3. **Use Skeleton loaders** instead of blank states
4. **Optimize animations** with CSS transforms
5. **Debounce inputs** for search/filter
6. **Memoize expensive computations** with useMemo

## ✅ Checklist for New Components

- [ ] Use existing design tokens (colors, spacing, etc.)
- [ ] Add hover/focus states
- [ ] Include loading states
- [ ] Test on mobile and desktop
- [ ] Add animations for user feedback
- [ ] Use semantic HTML
- [ ] Ensure proper accessibility (ARIA labels)
- [ ] Document props with JSDoc
- [ ] Follow naming conventions

---

**Need more details?** See `UI_DESIGN_SYSTEM.md` for complete documentation.
