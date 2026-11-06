import { useEffect, useRef, type ComponentProps } from "react";
import { useReducedMotion } from "@/hooks/useMotion";
export function MagneticButton({
  children,
  limit = 8,
  strength = 0.16,
  radius = 180,
  returnDuration = 260,
  ...props
}: ComponentProps<"button"> & {
  limit?: number;
  strength?: number;
  radius?: number;
  returnDuration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced && ref.current) ref.current.style.transform = "none";
    return () => cancelAnimationFrame(frame.current);
  }, [reduced]);
  function reset() {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }
  return (
    <button
      {...props}
      className={`button magnetic-button ${props.className || ""}`}
      onBlur={reset}
      onPointerCancel={reset}
      onPointerLeave={reset}
      onKeyDown={reset}
      onPointerMove={(e) => {
        if (
          reduced ||
          e.pointerType !== "mouse" ||
          !matchMedia("(hover:hover) and (pointer:fine)").matches
        )
          return reset();
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2,
          y = e.clientY - r.top - r.height / 2;
        if (Math.hypot(x, y) > radius) return reset();
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          if (ref.current)
            ref.current.style.transform = `translate(${Math.max(-limit, Math.min(limit, x * strength))}px,${Math.max(-limit, Math.min(limit, y * strength))}px)`;
        });
      }}
    >
      <span
        ref={ref}
        style={{
          transition: `transform ${returnDuration}ms ease-out`,
          transform: reduced ? "none" : undefined,
        }}
      >
        {children}
      </span>
    </button>
  );
}
