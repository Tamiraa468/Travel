# useScrollAnimation Hook - Reusable Solution

If you want to simplify scroll detection across multiple components, here's a custom hook:

## Installation

Create `hooks/useScrollAnimation.ts`:

```tsx
import { useRef } from "react";
import { useInView } from "framer-motion";

export const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "0px 0px -100px 0px",
  });

  return { ref, isInView };
};
```

## Usage Example

Instead of repeating `useRef` and `useInView` in every component, use the hook:

```tsx
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";

export default function MySection() {
  const { ref, isInView } = useScrollAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <motion.section
      ref={ref}
      animate={isInView || isAnimating ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Content */}
    </motion.section>
  );
}
```

## Benefits

✅ **DRY Code**: Define scroll detection once, use everywhere  
✅ **Consistent**: Same margin/timing across all sections  
✅ **Type-Safe**: Full TypeScript support  
✅ **Lightweight**: ~15 lines of code  
✅ **Testable**: Easy to mock in unit tests

## Customizable Hook

For even more control, create variants:

```tsx
interface UseScrollAnimationOptions {
  once?: boolean;
  margin?: string;
}

export const useScrollAnimation = (options?: UseScrollAnimationOptions) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? false,
    margin: options?.margin ?? "0px 0px -100px 0px",
  });

  return { ref, isInView };
};
```

## Usage with Options

```tsx
// Default (trigger 100px before entering viewport)
const { ref, isInView } = useScrollAnimation();

// Custom: trigger once, at viewport edge
const { ref, isInView } = useScrollAnimation({
  once: true,
  margin: "0px",
});

// Custom: trigger 200px before entering
const { ref, isInView } = useScrollAnimation({
  margin: "0px 0px -200px 0px",
});
```

---

**Your current components don't use this hook yet**, but you can refactor them to use it anytime for cleaner code!
