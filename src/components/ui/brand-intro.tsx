import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMotion";
import "./brand-intro.css";

const storageKey = "hls:intro:seen";
function shouldShowIntro() {
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    location.hash ||
    scrollY > 24
  )
    return false;
  try {
    return sessionStorage.getItem(storageKey) !== "1";
  } catch {
    return true;
  }
}

export function BrandIntro() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(shouldShowIntro);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const dismiss = useCallback(() => setVisible(false), []);
  const active = visible && !reduced;
  useEffect(() => {
    if (reduced) dismiss();
  }, [reduced, dismiss]);

  useLayoutEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("hls-intro-active");
    return () => document.documentElement.classList.remove("hls-intro-active");
  }, [active]);

  useEffect(() => {
    if (!active) return;
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* Navigation remains available if storage is disabled. */
    }
    const timeout = window.setTimeout(dismiss, 2500);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") dismiss();
    };
    const pointer = (event: PointerEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest(".brand-intro-skip")
      )
        dismiss();
    };
    const scroll = () => {
      if (scrollY > 24) dismiss();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", pointer, { passive: true });
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", pointer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("scroll", scroll);
    };
  }, [active, dismiss]);

  if (!active || curtainOpen) return null;
  return (
    <>
      <div
        className="brand-intro"
        aria-hidden="true"
        onAnimationEnd={(event) => {
          if (event.animationName === "hls-curtain") setCurtainOpen(true);
        }}
      >
        <div className="brand-intro-center">
          <div className="brand-intro-logo-mask">
            <img
              src="/images/hls-logo.png"
              alt=""
              width="225"
              height="225"
              fetchPriority="high"
            />
          </div>
          <span className="brand-intro-line" />
          <p className="brand-intro-location">BLUMENAU · SANTA CATARINA</p>
          <p className="brand-intro-title">A força da sua obra.</p>
        </div>
        <span className="brand-intro-edge" />
      </div>
      <button className="brand-intro-skip" type="button" onClick={dismiss}>
        Pular abertura <ArrowUpRight size={15} />
      </button>
    </>
  );
}
