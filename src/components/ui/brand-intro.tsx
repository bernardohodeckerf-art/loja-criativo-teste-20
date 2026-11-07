import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMotion";
import "./brand-intro.css";

const storageKey = "hls:intro:construction:seen";
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
    const timeout = window.setTimeout(dismiss, 3400);
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
          if (event.animationName === "hls-opening-exit") setCurtainOpen(true);
        }}
      >
        <div className="brand-intro-grid" />
        <div className="brand-intro-top">
          <img src="/images/hls-logo.png" alt="" width="225" height="225" fetchPriority="high" />
          <span>HLS FERRAGENS<br />BLUMENAU · SC</span>
        </div>
        <svg className="brand-intro-structure" viewBox="0 0 600 600" fill="none">
          <g className="intro-drawing">
            <path pathLength="1" d="M110 490V160L300 60L490 160V490L300 570Z M110 160L300 270L490 160 M300 270V570 M110 325L300 435L490 325 M205 110V540 M395 110V540 M110 490L490 160 M110 160L490 490" />
            <path pathLength="1" d="M80 490H30V160H80 M520 160H570V490H520 M110 125V95L300 0L490 95V125" />
          </g>
          <g className="intro-drawing-points">
            <circle cx="110" cy="160" r="7" /><circle cx="300" cy="270" r="7" />
            <circle cx="490" cy="160" r="7" /><circle cx="300" cy="435" r="7" />
          </g>
        </svg>
        <div className="brand-intro-center">
          <p className="brand-intro-kicker">DA PRIMEIRA IDEIA À ESTRUTURA.</p>
          <div className="brand-intro-words">
            <span className="intro-word-mask"><span>SUA OBRA.</span></span>
            <span className="intro-word-mask"><span>NOSSA <em>FORÇA.</em></span></span>
          </div>
          <div className="brand-intro-materials">
            {[
              ["steel-detail", "01 / AÇO"],
              ["mesh-roll", "02 / CONEXÃO"],
              ["coils", "03 / POSSIBILIDADES"],
            ].map(([file, label], index) => (
              <div className={`intro-material intro-material-${index}`} key={file}>
                <img src={`/images/${file}-480.webp`} width="480" height="320" alt="" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="brand-intro-bottom">
          <span>MATÉRIA QUE DÁ FORMA AO SEU PROJETO.</span>
          <span className="intro-build-line"><i /></span>
          <span>EXPLORE A HLS ↓</span>
        </div>
        <span className="brand-intro-edge" />
      </div>
      <button className="brand-intro-skip" type="button" onClick={dismiss}>
        Pular abertura <ArrowUpRight size={15} />
      </button>
    </>
  );
}
