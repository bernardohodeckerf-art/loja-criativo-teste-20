import { useId, type ComponentProps } from "react";
export function GlassFilter() {
  const id = useId().replace(/:/g, "");
  return (
    <svg width="0" height="0" aria-hidden="true" className="glass-filter">
      <defs>
        <filter id={`glass-${id}`}>
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>
    </svg>
  );
}
export function GlassEffect({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return <div className={`glass ${className}`} {...props} />;
}
export function GlassButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return <button className={`button glass ${className}`} {...props} />;
}
