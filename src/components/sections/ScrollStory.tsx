import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMotion";

const chapters = [
  [
    "Material que dá estrutura.",
    "Aço e ferragens para os próximos passos da sua construção.",
  ],
  [
    "Gente que faz acontecer.",
    "Uma conversa direta para encontrar as medidas que sua obra precisa.",
  ],
  [
    "Sua obra segue em frente.",
    "Prepare sua lista. A equipe confirma disponibilidade, prazo e condições.",
  ],
];

export function ScrollStory({ onQuote }: { onQuote: () => void }) {
  const root = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    player = useRef<HTMLVideoElement>(null);
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false),
    [paused, setPaused] = useState(false),
    [manual, setManual] = useState(false),
    [failed, setFailed] = useState(false);
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData,
  );
  const loaded = near && !reduced && (!saveData || manual);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    let confirmed = false;
    const cleanup = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    const reveal = () => {
      if (confirmed) return;
      confirmed = true;
      setNear(true);
      cleanup();
    };
    const check = () => {
      frame = 0;
      if (confirmed) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight + 500 && rect.bottom > -500) reveal();
    };
    const schedule = () => {
      if (!frame && !confirmed) frame = requestAnimationFrame(check);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { rootMargin: "500px" },
    );
    observer.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Handles a restored/deep-linked mobile scroll position before IO delivers.
    schedule();
    return cleanup;
  }, []);
  useEffect(() => {
    const el = root.current,
      sticky = stage.current,
      video = player.current;
    if (!el || !sticky || !video) return;
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (document.hidden || reduced || paused) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > innerHeight + 100) return;
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const travel = Math.max(1, el.offsetHeight - sticky.offsetHeight);
      const progress = Math.min(1, Math.max(0, (top - rect.top) / travel));
      el.style.setProperty("--story-progress", String(progress));
      el.dataset.scrollProgress = progress.toFixed(3);
      const nextPhase = Math.min(2, Math.floor(progress * 3));
      if (nextPhase !== phaseRef.current) {
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      }
      if (
        loaded &&
        !failed &&
        video.readyState >= 1 &&
        !video.seeking &&
        Number.isFinite(video.duration)
      ) {
        const target = 0.75 + progress * Math.max(0, video.duration - 1);
        if (Math.abs(video.currentTime - target) > 0.065)
          video.currentTime = target;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) schedule();
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    observer.observe(sticky);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    video.addEventListener("loadedmetadata", schedule);
    video.addEventListener("loadeddata", schedule);
    video.addEventListener("seeked", schedule);
    schedule();
    if (reduced) {
      el.style.removeProperty("--story-progress");
      el.dataset.scrollProgress = "0";
    }
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      video.removeEventListener("loadedmetadata", schedule);
      video.removeEventListener("loadeddata", schedule);
      video.removeEventListener("seeked", schedule);
    };
  }, [reduced, paused, loaded, failed]);
  return (
    <section
      ref={root}
      id="em-movimento"
      className={`scroll-story ${reduced ? "is-reduced" : ""}`}
      aria-labelledby="story-title"
    >
      <div ref={stage} className="story-stage">
        <div className="story-ambient" aria-hidden="true">
          <img
            src="/images/steel-detail-1920.webp"
            alt=""
            width="1920"
            height="1080"
            loading="lazy"
          />
        </div>
        <div className="container story-layout">
          <div className="story-copy">
            <p className="eyebrow light">DA HLS À SUA PRÓXIMA OBRA</p>
            <h2 id="story-title">
              A força que
              <br /> <em>segue com você.</em>
            </h2>
            <p className="story-intro">
              Cada obra tem um próximo passo.
              <br /> Vamos encontrar o seu.
            </p>
            <ol className="story-chapters">
              {chapters.map(([title, text], i) => (
                <li
                  className="story-chapter"
                  data-active={i === phase ? "true" : "false"}
                  key={title}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <button className="button primary" onClick={onQuote}>
              Conversar sobre minha obra <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="story-film">
            <div className="story-film-frame">
              <video
                ref={player}
                src={loaded ? "/videos/hls-carga-scroll.mp4" : undefined}
                poster="/images/hls-carga-poster.webp"
                muted
                playsInline
                preload={loaded ? "auto" : "none"}
                width="540"
                height="960"
                aria-label="Caminhão da HLS com carga de ferragens; as imagens avançam com a rolagem"
                onError={() => setFailed(true)}
              />
              <div className="story-film-caption">
                <span>HLS EM MOVIMENTO</span>
                <span>BLUMENAU · SC</span>
              </div>
            </div>
            <div className="story-film-controls">
              {!reduced && (
                <button
                  className="text-link"
                  aria-pressed={paused}
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? <Play size={14} /> : <Pause size={14} />}{" "}
                  {paused ? "Retomar animação" : "Pausar animação"}
                </button>
              )}
              <a className="text-link" href="#video-carga">
                Assistir com áudio <ArrowUpRight size={14} />
              </a>
            </div>
            {saveData && !manual && !reduced && (
              <button className="text-link" onClick={() => setManual(true)}>
                Carregar vídeo
              </button>
            )}
            {failed && (
              <p className="story-status" role="status">
                O vídeo não carregou. Você ainda pode conhecer os materiais e
                pedir orçamento.
              </p>
            )}
            <div className="story-progress" aria-hidden="true">
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
