import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { LocationMap } from "@/components/sections/LocationMap";
import { Videos } from "@/components/sections/Videos";
import { Hero } from "@/components/sections/Hero";
import { Catalog } from "@/components/sections/Catalog";
import { Quote } from "@/components/sections/Quote";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { Testimonials } from "@/components/ui/3d-testimonials";
import { GlassEffect } from "@/components/ui/liquid-glass";
import { company } from "@/data/company";
import type { Interest } from "@/lib/quote";
const links = [
  ["inicio", "Início"],
  ["produtos", "Produtos"],
  ["sobre", "Sobre"],
  ["patrocinios", "Patrocínios"],
  ["contato", "Contato"],
];
const slides = [
  {
    src: "/images/rebar.webp",
    alt: "Barras de aço para construção, fotografia ilustrativa",
    title: "Aço · Barras",
    subtitle: "A base de uma estrutura forte.",
    meta: [
      { label: "Bitolas do catálogo", value: "4,2 a 25 mm" },
      { label: "Categoria", value: "Aço – Barras" },
    ],
  },
  {
    src: "/images/nails.webp",
    alt: "Pregos metálicos, fotografia ilustrativa",
    title: "Pregos e grampos",
    subtitle: "Os detalhes que fazem a diferença.",
    meta: [
      { label: "Modelos no catálogo", value: "24 opções" },
      { label: "Medidas", value: "10x10 a 26x84 e mais" },
    ],
  },
  {
    src: "/images/mesh.webp",
    alt: "Malha de aço para construção, fotografia ilustrativa",
    title: "Telas soldadas",
    subtitle: "Conexões para dar forma à sua obra.",
    meta: [
      { label: "Linhas", value: "POP, VIP e Q" },
      { label: "Medidas", value: "Consulte o catálogo" },
    ],
  },
  {
    src: "/images/wire.webp",
    alt: "Rolo de arame metálico, fotografia ilustrativa",
    title: "Arame recozido",
    subtitle: "Versatilidade em cada amarração.",
    meta: [
      { label: "Opções", value: "Arame 10 a 18" },
      { label: "Fios", value: "1,25 a 3,40" },
    ],
  },
];
const faq = [
  [
    "Como pedir orçamento?",
    "Selecione materiais no catálogo ou abra o orçamento rápido. Ao terminar, você poderá revisar e enviar sua mensagem no WhatsApp.",
  ],
  [
    "Quais medidas estão disponíveis?",
    "O catálogo reúne as medidas informadas pela HLS. Nossa equipe confirma aplicação, disponibilidade e outras medidas na conversa.",
  ],
  [
    "Posso enviar minha lista de materiais?",
    "Sim. Abra uma conversa no WhatsApp e envie sua lista diretamente por lá, como texto, imagem ou documento.",
  ],
  [
    "A HLS entrega na minha região?",
    "Consulte o atendimento para sua cidade e bairro. Condições, valor mínimo e frete são confirmados com a equipe.",
  ],
  [
    "Como consultar prazo e disponibilidade?",
    "Informe os materiais e quando precisa deles no orçamento. A HLS confirma prazo, preço e disponibilidade antes de você decidir.",
  ],
];
export default function App() {
  useScrollReveal();
  const [menu, setMenu] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [current, setCurrent] = useState("inicio"),
    [quote, setQuote] = useState(false),
    [items, setItems] = useState<Interest[]>([]),
    [category, setCategory] = useState("aco-barras");
  const menuButton = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const quoteTrigger = useRef<HTMLElement | null>(null);
  const openQuote = () => {
    quoteTrigger.current = document.activeElement as HTMLElement;
    setMenu(false);
    setQuote(true);
  };
  const closeQuote = () => {
    setQuote(false);
    requestAnimationFrame(() => quoteTrigger.current?.focus());
  };
  useEffect(() => {
    let raf = 0;
    const scroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        const max = document.documentElement.scrollHeight - innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        }),
      { rootMargin: "-20% 0px -55% 0px" },
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menu) {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [menu]);
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <div className="scroll-progress" ref={progress} />
      <header
        className={scrolled || menu ? "site-header solid" : "site-header"}
      >
        <div className="header-inner container">
          <a href="#inicio" aria-label="HLS Ferragens · Início">
            <img
              className="brand"
              src="/images/hls-logo.png"
              alt="HLS Ferragens"
              width="225"
              height="225"
            />
          </a>
          <nav
            className={`main-nav ${menu ? "is-open" : ""}`}
            id="main-nav"
            aria-label="Navegação principal"
          >
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={current === id ? "location" : undefined}
                onClick={() => setMenu(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <button className="header-quote" onClick={openQuote}>
            Orçamento rápido <ArrowUpRight size={16} />
          </button>
          <button
            className="menu-toggle icon-button"
            ref={menuButton}
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menu}
            aria-controls="main-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <Hero onQuote={openQuote} />
        <div className="intro-strip container">
          <span>PARA CADA ETAPA, A FERRAGEM CERTA.</span>
          <p>Da estrutura ao próximo passo da sua obra.</p>
          <a href="#produtos" aria-label="Conhecer os produtos">
            <ArrowDownIcon />
          </a>
        </div>
        <section id="produtos" className="products-showcase">
          <div className="container section-heading">
            <div>
              <p className="eyebrow">01 / MATERIAIS QUE CONSTROEM</p>
              <h2>
                Força em cada
                <br />
                <em>detalhe.</em>
              </h2>
            </div>
            <p>
              Aço, telas, arames e muito mais.
              <br />
              Conheça a matéria-prima do seu próximo projeto.
            </p>
          </div>
          <div className="carousel-shell">
            <CoverflowCarousel
              slides={slides}
              rotate={28}
              depth={0.32}
              perspective={4}
              fade={0.22}
              cardWidth="clamp(230px, 36vw, 460px)"
              gap={0.12}
              showCaption
              showNavigation
              showPagination
              label="Categorias de ferragens"
            />
          </div>
          <div className="container showcase-footer">
            <span>FOTOGRAFIAS ILUSTRATIVAS DOS MATERIAIS</span>
            <a className="text-link" href="#catalogo">
              Ver catálogo completo <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <Catalog
          items={items}
          setItems={setItems}
          onQuote={openQuote}
          category={category}
          setCategory={setCategory}
        />
        <section id="sobre" className="about-section">
          <div className="container about-layout">
            <div className="about-image">
              <img
                src="/images/rebar.webp"
                srcSet="/images/rebar-small.webp 480w, /images/rebar.webp 1000w"
                sizes="(max-width: 760px) 90vw, 45vw"
                width="1000"
                height="750"
                alt="Detalhe de barras de aço nervuradas, imagem ilustrativa"
                loading="lazy"
              />
              <span className="image-label">A ESSÊNCIA ESTÁ NA ESTRUTURA.</span>
            </div>
            <div className="about-copy">
              <p className="eyebrow">03 / FEITA DE CONFIANÇA</p>
              <h2>
                Material certo.
                <br />
                Obra em <em>movimento.</em>
              </h2>
              <p>
                Ferragens para construção civil, com atendimento próximo em
                Blumenau e região.
              </p>
              <p>
                Há mais de três décadas, a HLS faz parte de quem constrói. Uma
                conversa direta, a medida que você precisa e atenção ao próximo
                passo da sua obra.
              </p>
              <div className="about-features">
                {[
                  [
                    "01",
                    "Atendimento de perto",
                    "Converse diretamente com a equipe pelo WhatsApp.",
                  ],
                  [
                    "02",
                    "Medidas para sua obra",
                    "Variedade de bitolas e opções no catálogo.",
                  ],
                  [
                    "03",
                    "Conexões que fortalecem",
                    "Telas fornecidas pela Telas Indaial, empresa do grupo.",
                  ],
                ].map(([n, t, d]) => (
                  <div key={n}>
                    <span>{n}</span>
                    <div>
                      <h3>{t}</h3>
                      <p>{d}</p>
                    </div>
                    <Check size={17} />
                  </div>
                ))}
              </div>
              <button className="text-link" onClick={openQuote}>
                Vamos conversar sobre sua obra <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </section>
        <Videos />
        <section className="practice-section container">
          <div>
            <p className="eyebrow">POR PERTO, TAMBÉM NO DIGITAL</p>
            <h2>
              Acompanhe
              <br />a <em>HLS.</em>
            </h2>
          </div>
          <p>
            Materiais, novidades e o dia a dia da marca. Encontre a HLS no
            Instagram.
          </p>
          <a
            className="button secondary"
            href={company.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={19} /> @hlsferragens <ArrowUpRight size={17} />
          </a>
        </section>
        <section id="patrocinios" className="sponsors-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">04 / ORGULHO DA NOSSA CIDADE</p>
                <h2>
                  A força de Blumenau
                  <br />
                  também entra <em>em campo.</em>
                </h2>
              </div>
              <p>
                Dentro e fora das obras, a HLS apoia quem representa a nossa
                cidade.
              </p>
            </div>
            <div className="teams-grid">
              {[
                {
                  name: "Clube Atlético Metropolitano",
                  sport: "FUTEBOL · TEMPORADA 2026",
                  logo: "logo-metro.png",
                  image: "time.png",
                },
                {
                  name: "Blumenau Futsal",
                  sport: "FUTSAL · TEMPORADA 2026",
                  logo: "logo-blumenau.png",
                  image: "u3w9kc1x-time.png",
                },
              ].map((t) => (
                <article className="team" key={t.name}>
                  <div className="team-photo">
                    <img
                      src={`/images/${t.image.replace(".png", ".webp")}`}
                      alt={`${t.name} com uniforme patrocinado pela HLS`}
                      width="960"
                      height="640"
                      loading="lazy"
                    />
                  </div>
                  <div className="team-info">
                    <img
                      src={`/images/${t.logo.replace(".png", ".webp")}`}
                      alt={`Escudo do ${t.name}`}
                      width="64"
                      height="64"
                      loading="lazy"
                    />
                    <div>
                      <p className="eyebrow">{t.sport}</p>
                      <h3>{t.name}</h3>
                    </div>
                    <span>
                      HLS
                      <br />
                      PATROCINA
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="reviews-section container">
          <p className="eyebrow">CONFIANÇA SE CONSTRÓI TODOS OS DIAS</p>
          <Testimonials />
        </section>
        <section className="faq-section container">
          <div>
            <p className="eyebrow">ANTES DE COMEÇAR</p>
            <h2>
              Conversa simples.
              <br />
              <em>Dúvidas resolvidas.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="contato" className="contact-section">
          <div className="container">
            <p className="eyebrow light">05 / O PRÓXIMO PASSO COMEÇA AQUI</p>
            <div className="contact-heading">
              <h2>
                Vamos dar força
                <br />à sua <em>obra?</em>
              </h2>
              <button className="button primary" onClick={openQuote}>
                Montar meu orçamento <ArrowUpRight size={19} />
              </button>
            </div>
            <div className="contact-grid">
              <div>
                <MapPin />
                <h3>Venha até a HLS</h3>
                <address>
                  {company.address}
                  <br />
                  {company.district} · {company.city}
                  <br />
                  CEP {company.postalCode}
                </address>
                <a
                  className="text-link"
                  href={company.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Traçar rota no Google Maps <ArrowUpRight size={16} />
                </a>
              </div>
              <div>
                <Phone />
                <h3>Uma conversa resolve</h3>
                <a className="phone" href={company.phoneHref}>
                  {company.phone}
                </a>
                <a
                  className="text-link"
                  href={company.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversar no WhatsApp <ArrowUpRight size={16} />
                </a>
                <p>Consulte os horários pelo WhatsApp.</p>
              </div>
              <div>
                <Instagram />
                <h3>Acompanhe a HLS</h3>
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @hlsferragens <ArrowUpRight size={15} />
                </a>
                <p>
                  Ferragens para construção civil.
                  <br />
                  Blumenau e região.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="container">
          <LocationMap />
        </div>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#inicio" aria-label="Voltar ao início">
            <img
              className="footer-logo"
              src="/images/hls-logo.png"
              alt="HLS Ferragens"
              width="225"
              height="225"
            />
          </a>
          <p>
            Material que sustenta.
            <br />
            Confiança que permanece.
          </p>
          <span>© {new Date().getFullYear()} HLS Ferragens</span>
          <a href="#inicio" className="text-link">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
      {items.length > 0 && (
        <GlassEffect
          className="interest-float"
          role="complementary"
          aria-label="Sua lista de materiais"
        >
          <button onClick={openQuote}>
            <span>{items.length}</span> Minha lista <ArrowUpRight size={17} />
          </button>
        </GlassEffect>
      )}
      <nav aria-label="Atendimento rápido">
        <a
          className="whatsapp-float"
          href={company.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar com a HLS no WhatsApp"
        >
          <MessageCircle size={25} />
        </a>
      </nav>
      <Quote
        open={quote}
        onClose={closeQuote}
        items={items}
        setItems={setItems}
      />
    </>
  );
}
function ArrowDownIcon() {
  return <ArrowRight className="down-arrow" size={24} />;
}
