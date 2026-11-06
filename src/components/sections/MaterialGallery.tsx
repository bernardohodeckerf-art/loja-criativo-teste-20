import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMotion";
const photos = [
  {
    file: "steel-detail",
    title: "A base de tudo.",
    category: "Aço · Barras",
    id: "aco-barras",
    alt: "Detalhe de barras de aço nervuradas empilhadas ao sol",
  },
  {
    file: "mesh-roll",
    title: "Força em cada conexão.",
    category: "Telas e malhas",
    id: "tela-soldada",
    alt: "Detalhe de um rolo de malha metálica",
  },
  {
    file: "coils",
    title: "Pronto para ganhar forma.",
    category: "Rolos de aço",
    id: "rolo",
    alt: "Rolos de fio de aço empilhados em ambiente industrial",
  },
];
export function MaterialGallery({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const root = useRef<HTMLElement>(null),
    rail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduced) {
      el.style.removeProperty("--photo-offset");
      return;
    }
    let frame = 0,
      visible = false;
    const draw = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const rect = el.getBoundingClientRect();
      const p = Math.max(
        -1,
        Math.min(
          1,
          (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight,
        ),
      );
      el.style.setProperty("--photo-offset", `${p * 22}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      el.style.removeProperty("--photo-offset");
    };
  }, [reduced]);
  function move(direction: number) {
    rail.current?.scrollBy({
      left: direction * rail.current.clientWidth * 0.9,
      behavior: reduced ? "auto" : "smooth",
    });
  }
  return (
    <section
      className="material-gallery container"
      ref={root}
      aria-labelledby="material-gallery-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">A MATÉRIA-PRIMA DO SEU PRÓXIMO PROJETO</p>
          <h2 id="material-gallery-title">
            De perto,
            <br />
            <em>a força de cada material.</em>
          </h2>
        </div>
        <p>
          Texturas, formas e possibilidades.
          <br />
          Encontre a medida certa para construir.
        </p>
      </div>
      <div
        className="material-photo-rail"
        ref={rail}
        tabIndex={0}
        role="group"
        aria-label="Fotografias de materiais"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        {photos.map((photo, i) => (
          <a
            className="material-photo"
            key={photo.file}
            href="#catalogo"
            onClick={() => onSelect(photo.id)}
          >
            <img
              src={`/images/${photo.file}-960.webp`}
              srcSet={[480, 960, 1920, 3840]
                .map((size) => `/images/${photo.file}-${size}.webp ${size}w`)
                .join(", ")}
              sizes="(max-width:760px) 130vw, 48vw"
              width="3840"
              height={photo.file === "steel-detail" ? 2160 : 2560}
              alt={`${photo.alt}, fotografia ilustrativa`}
              loading="lazy"
              decoding="async"
            />
            <span className="material-photo-number">0{i + 1}</span>
            <div className="material-photo-caption">
              <span>{photo.category}</span>
              <h3>{photo.title}</h3>
              <ArrowUpRight size={22} />
            </div>
          </a>
        ))}
      </div>
      <div className="material-gallery-footer">
        <span>FOTOGRAFIAS ILUSTRATIVAS · EXPLORE AS CATEGORIAS</span>
        <div className="gallery-controls">
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label="Fotos anteriores"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Próximas fotos"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
