import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { ArrowUpRight, Pause, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useMotion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  googleReviews,
  googleReviewSource,
  type GoogleReview,
} from "@/data/reviews";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  autoFill?: boolean;
  decorative?: boolean;
  ariaLabel?: string;
  ariaLive?: "off" | "polite" | "assertive";
}

// Adapted from the user's vertical marquee. Only decorative repeats are hidden;
// the complete reading view below provides one stationary, accessible copy.
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 3,
  autoFill = false,
  decorative = false,
  ariaLabel,
  ariaLive = "off",
  ...props
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState(2);
  useEffect(() => {
    if (!autoFill || !ref.current) return;
    const root = ref.current;
    const measure = () => {
      const first = root.firstElementChild as HTMLElement | null;
      if (!first) return;
      const size = vertical ? first.offsetHeight : first.offsetWidth;
      const viewport = vertical ? root.clientHeight : root.clientWidth;
      if (size) setFill(Math.min(12, Math.ceil(viewport / size) + 1));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    if (root.firstElementChild) observer.observe(root.firstElementChild);
    measure();
    return () => observer.disconnect();
  }, [autoFill, vertical, children]);
  const count = autoFill ? fill : Math.max(1, Math.min(12, Math.floor(repeat)));
  const groups = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="review-marquee-track"
          aria-hidden={decorative || index > 0 ? true : undefined}
        >
          {children}
        </div>
      )),
    [count, children, decorative],
  );
  return (
    <div
      {...props}
      ref={ref}
      data-slot="marquee"
      className={cn(
        "review-marquee",
        vertical && "vertical",
        reverse && "reverse",
        pauseOnHover && "pause-on-hover",
        className,
      )}
      role={decorative ? undefined : "group"}
      aria-label={decorative ? undefined : ariaLabel}
      aria-live={decorative ? undefined : ariaLive}
      aria-hidden={decorative ? true : undefined}

      tabIndex={decorative ? undefined : 0}
    >
      {groups}
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initials = review.author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <Card className="google-review-card">
      <CardContent className="google-review-content">
        <div className="review-author">
          <Avatar className="review-avatar">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="review-author-name">{review.author}</p>
            <span>Avaliação no Google</span>
          </div>
        </div>
        <div
          className="review-stars"
          role="img"
          aria-label={`${review.rating} de 5 estrelas`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={13}
              aria-hidden="true"
              fill={i < review.rating ? "currentColor" : "none"}
              className={i < review.rating ? "rated" : "unrated"}
            />
          ))}
        </div>
        <blockquote>
          <p>{review.text}</p>
        </blockquote>
      </CardContent>
    </Card>
  );
}

export function Testimonials({
  items = googleReviews,
}: {
  items?: GoogleReview[];
}) {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(max-width: 760px)");
    const changed = () => setMobile(query.matches);
    query.addEventListener("change", changed);
    return () => query.removeEventListener("change", changed);
  }, []);
  const stationary = reduced;
  const columnCount = mobile ? 1 : Math.min(3, items.length);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    items.filter((_, n) => n % columnCount === i),
  );
  if (!items.length)
    return (
      <div className="review-link">
        <h2>Conheça outras experiências.</h2>
        <a
          className="text-link"
          href={googleReviewSource.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar avaliações públicas <ArrowUpRight size={16} />
        </a>
      </div>
    );
  return (
    <div className={cn("google-testimonials", paused && "is-paused")}>
      <div className="reviews-intro">
        <div>
          <h2>
            Confiança de quem
            <br />
            <em>constrói com a gente.</em>
          </h2>
          <p>Experiências compartilhadas por clientes no Google.</p>
        </div>
        <div className="google-score">
          <strong>
            {googleReviewSource.rating}
            <small>/ 5</small>
          </strong>
          <span>Google · {googleReviewSource.total} avaliações</span>
          <small>Registro de {googleReviewSource.recordedLabel}</small>
        </div>
      </div>
      {!stationary && (
        <>
          <div className="review-motion-controls">
            <span>Comentários de quem conhece a HLS</span>
            <button
              className="text-link"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-controls="review-animation"
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}{" "}
              {paused ? "Retomar movimento" : "Pausar movimento"}
            </button>
          </div>
          <div
            id="review-animation"
            className="review-perspective"
            aria-hidden="true"
          >
            <div className="review-columns">
              {columns.map((column, index) => (
                <Marquee
                  key={index}
                  vertical
                  reverse={index % 2 === 1}
                  repeat={3}
                  decorative
                >
                  {column.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </Marquee>
              ))}
            </div>
          </div>
        </>
      )}
      {stationary ? (
        <ul className="reviews-reading-list">
          {items.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : (
        <details className="reviews-reading-view">
          <summary>Ler avaliações sem movimento</summary>
          <ul className="reviews-reading-list">
            {items.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        </details>
      )}
      <div className="reviews-source">
        <p>
          Seleção de avaliações do Google, registrada em 06/11/2026. As
          avaliações podem mudar.
        </p>
        <a
          className="text-link"
          href={googleReviewSource.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar no Google <ArrowUpRight size={17} />
        </a>
      </div>
    </div>
  );
}
