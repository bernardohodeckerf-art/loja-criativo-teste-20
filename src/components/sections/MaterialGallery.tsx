import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMotion";
import "./material-gallery.css";

const photos = [
  {
    file: "steel-detail",
    title: "A base de tudo.",
    category: "Aço · Barras",
    short: "Aço",
    id: "aco-barras",
    text: "Bitolas para os próximos passos da estrutura. Confira as medidas do catálogo e prepare sua lista.",
    alt: "Detalhe de barras de aço nervuradas empilhadas ao sol",
  },
  {
    file: "mesh-roll",
    title: "Força em cada conexão.",
    category: "Telas e malhas",
    short: "Telas",
    id: "tela-soldada",
    text: "Malhas e formatos para diferentes etapas. A equipe confirma a opção adequada ao que você procura.",
    alt: "Detalhe de um rolo de malha metálica",
  },
  {
    file: "coils",
    title: "Pronto para ganhar forma.",
    category: "Rolos de aço",
    short: "Rolos",
    id: "rolo",
    text: "Conheça as opções de rolo informadas pela HLS e converse sobre medidas e quantidades.",
    alt: "Rolos de fio de aço empilhados em ambiente industrial",
  },
];
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function MaterialGallery({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const root = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0),
    [staticView, setStaticView] = useState(false);
  const reduced = useReducedMotion();
  const [pinnedLayout, setPinnedLayout] = useState(
    () => matchMedia("(min-width: 901px) and (min-height: 651px)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(min-width: 901px) and (min-height: 651px)");
    const update = () => setPinnedLayout(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const stationary = reduced || staticView;

  useEffect(() => {
    const el = root.current,
      scrollTrack = track.current,
      sticky = stage.current;
    if (!el || !scrollTrack || !sticky) return;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>(".material-photo"),
    );
    if (stationary) {
      el.style.setProperty("--material-progress", "0");
      el.dataset.sceneProgress = "0";
      cards.forEach((card) => {
        card.style.removeProperty("--material-strength");
        card.style.removeProperty("--material-parallax");
        card.style.removeProperty("--material-reveal");
        card.style.removeProperty("--material-entrance");
      });
      return;
    }
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (document.hidden) return;
      const box = scrollTrack.getBoundingClientRect();
      if (box.bottom < -100 || box.top > innerHeight + 100) return;
      const stageCss = getComputedStyle(sticky);
      const pinned = stageCss.position === "sticky";
      let progress: number;
      if (pinned) {
        const top = parseFloat(stageCss.top) || 0;
        progress = clamp(
          (top - box.top) /
            Math.max(1, scrollTrack.offsetHeight - sticky.offsetHeight),
        );
      } else {
        // On touch/small screens each real photo is a normal-flow chapter.
        // Its centre drives the same sequence without a pinned or locked page.
        const railTop = cards[0].parentElement!.getBoundingClientRect().top;
        const centres = cards.map((card) => railTop + card.offsetTop + card.offsetHeight / 2);
        const target = innerHeight * 0.52;
        let position = 0;
        if (target >= centres[centres.length - 1]) position = photos.length - 1;
        else
          for (let i = 0; i < centres.length - 1; i++) {
            if (target >= centres[i] && target < centres[i + 1]) {
              position =
                i +
                (target - centres[i]) /
                  Math.max(1, centres[i + 1] - centres[i]);
              break;
            }
          }
        progress = clamp(position / (photos.length - 1));
      }
      const position = progress * (photos.length - 1);
      const next = Math.max(
        0,
        Math.min(photos.length - 1, Math.round(position)),
      );
      el.style.setProperty("--material-progress", String(progress));
      el.dataset.sceneProgress = progress.toFixed(3);
      el.dataset.sceneIndex = String(next);
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
      cards.forEach((card, index) => {
        const strength = clamp(1 - Math.abs(position - index));
        const visual = card.getBoundingClientRect();
        const rect = pinned ? visual : {
          top: card.parentElement!.getBoundingClientRect().top + card.offsetTop,
          height: card.offsetHeight,
        };
        card.style.setProperty("--material-entrance", String(pinned ? 1 : clamp((innerHeight * .94 - rect.top) / Math.min(rect.height * .4, innerHeight * .36))));
        const local = Math.max(
          -1,
          Math.min(
            1,
            (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight,
          ),
        );
        card.style.setProperty("--material-strength", String(strength));
        card.style.setProperty(
          "--material-parallax",
          `${local * (pinned ? 10 : 24)}px`,
        );
        card.style.setProperty(
          "--material-reveal",
          `${pinned ? 0 : clamp((rect.top - innerHeight * 0.72) / (innerHeight * 0.4)) * 10}%`,
        );
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.sceneVisible = String(entry.isIntersecting);
        if (entry.isIntersecting) schedule();
      },
      { rootMargin: "100px" },
    );
    observer.observe(scrollTrack);
    const resize = new ResizeObserver(schedule);
    resize.observe(scrollTrack);
    resize.observe(sticky);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [stationary, pinnedLayout]);

  function goTo(index: number) {
    const scrollTrack = track.current,
      sticky = stage.current;
    if (!scrollTrack || !sticky) return;
    if (getComputedStyle(sticky).position === "sticky" && !stationary) {
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const travel = Math.max(
        1,
        scrollTrack.offsetHeight - sticky.offsetHeight,
      );
      window.scrollTo({
        top:
          scrollTrack.getBoundingClientRect().top +
          scrollY -
          top +
          (index / (photos.length - 1)) * travel,
        behavior: reduced ? "auto" : "smooth",
      });
    } else
      root.current
        ?.querySelectorAll<HTMLElement>(".material-photo")
        [index]?.scrollIntoView({
          block: "center",
          behavior: reduced ? "auto" : "smooth",
        });
  }

  return (
    <section
      id="materiais-em-cena"
      className={`material-gallery material-experience container ${stationary ? "is-static" : ""}`}
      ref={root}
      aria-labelledby="material-gallery-title"
      data-scene-index={active}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">DA MATÉRIA-PRIMA AO PRÓXIMO PASSO</p>
          <h2 id="material-gallery-title">
            Cada material,
            <br />
            <em>uma nova possibilidade.</em>
          </h2>
        </div>
        <p>
          Acompanhe as texturas ao rolar.
          <br />
          Explore as medidas e monte sua lista.
        </p>
      </div>
      <div className="material-experience-scroll" ref={track}>
        <div className="material-experience-stage" ref={stage}>
          <div className="material-scene-toolbar">
            <div className="material-current-caption" aria-hidden="true">
              <span>0{active + 1} / 03</span>
              <strong>{photos[active].category}</strong>
            </div>
            {!reduced && (
              <button
                type="button"
                className="text-link material-static-toggle"
                aria-pressed={staticView}
                onClick={() => setStaticView((value) => !value)}
              >
                {staticView ? <Play size={14} /> : <Pause size={14} />}{" "}
                {staticView ? "Ativar animação" : "Ver sem animação"}
              </button>
            )}
          </div>
          {!stationary && (
            <nav
              className="material-stage-controls"
              aria-label="Etapas dos materiais"
            >
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={photo.file}
                  aria-current={active === index ? "step" : undefined}
                  onClick={() => goTo(index)}
                >
                  <span>0{index + 1}</span>
                  {photo.short}
                </button>
              ))}
            </nav>
          )}
          <div
            className="material-photo-rail"
            role="group"
            aria-label="Materiais em três etapas"
          >
            {photos.map((photo, index) => (
              <a
                className="material-photo"
                key={photo.file}
                href="#catalogo"
                onClick={() => onSelect(photo.id)}
                data-material-index={index}
                data-active={active === index ? "true" : "false"}
                inert={!stationary && pinnedLayout && active !== index ? true : undefined}
                aria-hidden={!stationary && pinnedLayout && active !== index ? true : undefined}
              >
                <div className="material-photo-window">
                  <img
                    src={`/images/${photo.file}-960.webp`}
                    srcSet={[480, 960, 1920, 3840]
                      .map(
                        (size) => `/images/${photo.file}-${size}.webp ${size}w`,
                      )
                      .join(", ")}
                    sizes="(max-width:900px) 100vw, 65vw"
                    width="3840"
                    height={photo.file === "steel-detail" ? 2160 : 2560}
                    alt={`${photo.alt}, fotografia ilustrativa`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="material-photo-number">0{index + 1}</span>
                </div>
                <div className="material-photo-caption">
                  <span>{photo.category}</span>
                  <h3>{photo.title}</h3>
                  <p>{photo.text}</p>
                  <span className="material-category-link">
                    Explorar medidas <ArrowUpRight size={17} />
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="material-scene-progress" aria-hidden="true">
            <i />
          </div>
          <div className="material-gallery-footer">
            <span>FOTOGRAFIAS ILUSTRATIVAS · EXPLORE AS CATEGORIAS</span>
            <span className="material-scroll-hint">
              {stationary
                ? "ESCOLHA UM MATERIAL PARA CONTINUAR"
                : "A PRÓXIMA TEXTURA VEM COM A ROLAGEM"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
