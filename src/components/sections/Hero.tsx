import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMotion";
import { MagneticButton } from "@/components/ui/magnetic-button";
export function Hero({ onQuote }: { onQuote: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false),
    [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  const manual = useRef(false);
  const visible = useRef(true);
  const desired = useRef(true);
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData,
  );
  useEffect(() => {
    if (reduced || saveData) {
      desired.current = false;
      ref.current?.pause();
      return;
    }
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, [reduced, saveData]);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (loaded) video.load();
    const sync = () => {
      if (
        !visible.current ||
        document.hidden ||
        !desired.current ||
        ((reduced || saveData) && !manual.current)
      )
        video.pause();
      else if (loaded) video.play().catch(() => setPlaying(false));
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [loaded, reduced, saveData]);
  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      desired.current = false;
      v.pause();
    } else {
      manual.current = true;
      desired.current = true;
      setLoaded(true);
      if (loaded) v.play().catch(() => setFailed(true));
    }
  }
  return (
    <section id="inicio" className="hero">
      <video
        ref={ref}
        poster="/images/hero-poster.webp"
        muted
        playsInline
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        aria-label="Vídeo ilustrativo de trabalho com metal"
      >
        {loaded && (
          <>
            <source
              src={
                matchMedia("(max-width: 700px)").matches
                  ? "/videos/hero-mobile.webm"
                  : "/videos/hero-desktop.webm"
              }
              type="video/webm"
            />
            <source
              src={
                matchMedia("(max-width: 700px)").matches
                  ? "/videos/hero-mobile.mp4"
                  : "/videos/hero-desktop.mp4"
              }
              type="video/mp4"
            />
          </>
        )}
      </video>
      <div className="hero-shade" />
      <div className="hero-content container">
        <p className="eyebrow light">
          <span className="tiny-square" /> FERRAGENS · BLUMENAU E REGIÃO
        </p>
        <h1>
          A força
          <br />
          da sua <em>obra.</em>
        </h1>
        <p className="hero-sub">Começa com o material certo.</p>
        <MagneticButton className="primary" onClick={onQuote}>
          Pedir orçamento <ArrowUpRight size={19} />
        </MagneticButton>
      </div>
      <div className="hero-bottom container">
        <a href="#produtos" className="scroll-hint">
          <ArrowDown size={17} /> EXPLORE A HLS
        </a>
        <span className="hero-caption">AÇO. CONFIANÇA. CONSTRUÇÃO.</span>
        <button
          className="video-toggle"
          aria-label={
            playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"
          }
          onClick={toggle}
          disabled={failed}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
          <span>
            {failed
              ? "Imagem estática"
              : playing
                ? "Pausar vídeo"
                : "Reproduzir vídeo"}
          </span>
        </button>
      </div>
    </section>
  );
}
