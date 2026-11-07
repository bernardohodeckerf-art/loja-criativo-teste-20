import { useLayoutEffect } from "react";
import { useReducedMotion } from "./useMotion";

type Reveal = "rise" | "left" | "right" | "image" | "tilt" | "scale";
const choreography: [string, Reveal][] = [
  [".intro-strip > *, .showcase-footer > *, .catalog-meta, .category-note", "rise"],
  [".section-heading .eyebrow, .section-heading h2, #videos > .eyebrow, #videos > h2", "rise"],
  [".section-heading > p, .catalog-tools > label:first-child, .category-heading", "left"],
  [".catalog-tools > label:last-child", "right"],
  [".carousel-shell, .about-image", "image"],
  [".product-card", "rise"],
  [".quote-invitation-copy > *, .about-copy > :not(.about-features), .practice-section > *", "rise"],
  [".quote-invitation-panel, .hls-video-grid > article, .team", "tilt"],
  [".about-features > div, .faq-list > details", "left"],
  ["#avaliacoes > .eyebrow, .reviews-intro > div, .faq-section > div:first-child > *", "rise"],
  [".review-perspective, .contact-grid > div", "scale"],
  [".contact-section .eyebrow, .contact-heading > *, .location-map", "right"],
];

function keyframes(kind: Reveal, mobile: boolean): Keyframe[] {
  const distance = mobile ? 38 : 64;
  const end = { opacity: 1, transform: "none", clipPath: "inset(0% 0% 0% 0% round 0px)" };
  const from: Record<Reveal, Keyframe> = {
    rise: { opacity: 0, transform: `translateY(${distance}px)`, clipPath: "inset(0% 0% 0% 0%)" },
    left: { opacity: 0, transform: "translateY(18px)", clipPath: "inset(0% 99% 0% 0%)" },
    right: { opacity: 0, transform: "translateY(18px)", clipPath: "inset(0% 0% 0% 99%)" },
    image: { opacity: 0, transform: "scale(.9)", clipPath: "inset(22% 8% 22% 8% round 160px)" },
    tilt: { opacity: 0, transform: `translateY(${distance}px) rotate(-3deg) scale(.9)`, clipPath: "inset(0% 0% 0% 0%)" },
    scale: { opacity: 0, transform: "translateY(25px) scale(.86)", clipPath: "inset(0% 0% 0% 0%)" },
  };
  return [from[kind], end];
}

// Only enhanced elements wait for their entrance. React content remains visible
// when the effect is unavailable; focus/reduced motion reveal immediately.
export function useScrollReveal() {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const main = document.querySelector("main");
    if (!main || reduced || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    const records = new Map<HTMLElement, Animation>();
    const held = new Set<Animation>();
    let scanFrame = 0, releaseFrame = 0, pointerDown = false;
    const finish = (el: HTMLElement) => {
      records.get(el)?.cancel();
      records.delete(el);
      el.dataset.revealState = "seen";
      observer.unobserve(el);
    };
    const observer = new IntersectionObserver((entries) => {
      let lastTop = -Infinity, stagger = 0;
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((entry) => {
          const el = entry.target as HTMLElement;
          const animation = records.get(el);
          if (!animation || el.dataset.revealState !== "pending") return;
          const top = entry.boundingClientRect.top;
          stagger = Math.abs(top - lastTop) < 90 ? Math.min(stagger + 85, 255) : 0;
          lastTop = top;
          animation.effect?.updateTiming({ delay: stagger });
          el.dataset.revealState = "entering";
          if (!held.has(animation)) animation.play();
          animation.onfinish = () => finish(el);
          observer.unobserve(el);
        });
    // Keep a transparent sliver in side masks: fully clipped elements have no
    // intersection area. Opacity zero still conceals the entire waiting block.
    }, { threshold: 0, rootMargin: "0px 0px -3% 0px" });
    const scan = () => {
      scanFrame = 0;
      for (const el of records.keys()) {
        if (!el.isConnected) finish(el);
      }
      const mobile = innerWidth <= 900;
      for (const [selector, kind] of choreography) {
        main.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (el.dataset.revealState || el.closest("[hidden], dialog")) return;
          el.dataset.reveal = kind;
          const rect = el.getBoundingClientRect();
          if (!rect.height || rect.bottom < 0 || rect.top < 120) {
            el.dataset.revealState = "seen";
            return;
          }
          el.dataset.revealState = "pending";
          const animation = el.animate(keyframes(kind, mobile), {
            duration: kind === "image" ? 1150 : kind === "rise" ? 780 : 950,
            easing: "cubic-bezier(.2,.75,.25,1)",
            fill: "both",
          });
          animation.pause();
          animation.currentTime = 0;
          records.set(el, animation);
          observer.observe(el);
        });
      }
    };
    const queueScan = () => {
      if (!scanFrame) scanFrame = requestAnimationFrame(scan);
    };
    const focused = (event: Event) => {
      if (pointerDown || !(event.target instanceof Element)) return;
      for (const el of records.keys()) {
        if (el.contains(event.target)) finish(el);
      }
    };
    const hold = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      pointerDown = true;
      cancelAnimationFrame(releaseFrame);
      for (const [el, animation] of records) {
        if (el.contains(event.target)) {
          animation.pause();
          held.add(animation);
        }
      }
    };
    const release = () => {
      releaseFrame = requestAnimationFrame(() => {
        pointerDown = false;
        for (const [el, animation] of records) {
          if (held.has(animation) && el.dataset.revealState === "entering") animation.play();
        }
        held.clear();
      });
    };
    const mutation = new MutationObserver(queueScan);
    mutation.observe(main, { childList: true, subtree: true });
    main.addEventListener("focusin", focused);
    main.addEventListener("beforematch", focused);
    main.addEventListener("pointerdown", hold, { capture: true, passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    scan();
    return () => {
      cancelAnimationFrame(scanFrame);
      cancelAnimationFrame(releaseFrame);
      observer.disconnect();
      mutation.disconnect();
      main.removeEventListener("focusin", focused);
      main.removeEventListener("beforematch", focused);
      main.removeEventListener("pointerdown", hold, true);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      records.forEach((animation) => animation.cancel());
      main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        delete el.dataset.reveal;
        delete el.dataset.revealState;
      });
    };
  }, [reduced]);
}
