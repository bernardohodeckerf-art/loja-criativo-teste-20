import { useEffect } from "react";
import { useReducedMotion } from "./useMotion";
// Content remains visible without this progressive enhancement.
export function useScrollReveal() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const animation = entry.target.animate(
            [
              { opacity: 0.7, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll("h2, .about-image, .team")
      .forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduced]);
}
