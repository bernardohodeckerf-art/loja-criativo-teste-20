import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import categories from "@/data/catalog.json";
import type { Interest } from "@/lib/quote";
export function Catalog({
  items,
  setItems,
  onQuote,
  category,
  setCategory,
}: {
  items: Interest[];
  setItems: React.Dispatch<React.SetStateAction<Interest[]>>;
  onQuote: () => void;
  category: string;
  setCategory: (id: string) => void;
}) {
  const photos: Record<string, { file: string; alt: string }> = {
    "aco-barras": { file: "rebar", alt: "Barras de aço nervuradas" },
    "arame-recozido": { file: "wire", alt: "Rolo de arame metálico" },
    "tela-soldada": { file: "mesh", alt: "Malha soldada de aço" },
    pregos: { file: "nails", alt: "Pregos metálicos" },
    "malha-tela-mf": { file: "mesh", alt: "Malha de aço" },
  };
  const [search, setSearch] = useState("");
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/(\d)[,.](\d)/g, "$1.$2");
  const results = useMemo(
    () =>
      categories
        .flatMap((c) =>
          c.items.map((name, index) => ({
            id: `${c.id}-${index}`,
            category: c.name,
            categoryId: c.id,
            name,
            description: c.description,
          })),
        )
        .filter(
          (p) =>
            (!category || p.categoryId === category) &&
            normalize(`${p.name} ${p.category}`).includes(normalize(search)),
        ),
    [search, category],
  );
  function add(p: (typeof results)[number]) {
    setItems((list) =>
      list.some((i) => i.id === p.id)
        ? list
        : [
            ...list,
            {
              id: p.id,
              category: p.category,
              product: p.name,
              quantity: "1",
              unit: "",
            },
          ],
    );
  }
  return (
    <section id="catalogo" className="catalog-section container">
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / ENCONTRE O MATERIAL CERTO</p>
          <h2>
            Da medida ao
            <br />
            <em>próximo passo.</em>
          </h2>
        </div>
        <p>
          Explore o catálogo, monte sua lista e converse com quem entende de
          ferragens.
        </p>
      </div>
      <div className="catalog-tools">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Buscar por produto ou medida</span>
          <input
            type="search"
            value={search}
            maxLength={100}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busque por produto ou medida…"
          />
        </label>
        <label className="select-field">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Filtrar categoria</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="catalog-meta">
        <p role="status">
          {results.length}{" "}
          {results.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
        <button className="text-link" onClick={onQuote}>
          Minha lista ({items.length}) <ArrowUpRight size={16} />
        </button>
      </div>
      <div className="product-grid">
        {results.map((p) => {
          const selected = items.some((i) => i.id === p.id);
          return (
            <article className="product-card" key={p.id}>
              {photos[p.categoryId] && !p.name.startsWith("Grampos") && (
                <div className="product-photo">
                  <img
                    className="product-image"
                    src={`/images/${photos[p.categoryId].file}-small.webp`}
                    srcSet={`/images/${photos[p.categoryId].file}-small.webp 480w, /images/${photos[p.categoryId].file}.webp 1000w`}
                    sizes="(max-width: 760px) 45vw, 30vw"
                    width="480"
                    height="320"
                    loading="lazy"
                    alt={`${photos[p.categoryId].alt}, fotografia ilustrativa da categoria`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span>IMAGEM ILUSTRATIVA</span>
                </div>
              )}
              <p className="eyebrow">{p.category}</p>
              <h3>{p.name}</h3>
              <p className="product-price">Preço sob consulta</p>
              <details>
                <summary>Ver especificações</summary>
                <p>
                  Medida do catálogo: {p.name}.{" "}
                  {p.description ||
                    "Confirme quantidade, aplicação e disponibilidade com a equipe."}
                </p>
              </details>
              <div className="product-actions">
                <button
                  className={`add-product ${selected ? "added" : ""}`}
                  onClick={() => add(p)}
                  aria-label={
                    selected
                      ? `Na sua lista: ${p.name}`
                      : `Adicionar à lista: ${p.name}`
                  }
                  disabled={selected}
                >
                  {selected ? <Check size={16} /> : <Plus size={16} />}{" "}
                  {selected ? "Na sua lista" : "Adicionar à lista"}
                </button>
                <button
                  className="icon-button"
                  aria-label={`Consultar ${p.name}`}
                  onClick={() => {
                    add(p);
                    onQuote();
                  }}
                >
                  <ArrowUpRight size={19} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {!results.length && (
        <div className="empty-state">
          <Search size={32} />
          <h3>Vamos tentar outra medida?</h3>
          <p>Não encontramos materiais para essa busca.</p>
          <button
            className="button secondary"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
      <div className="catalog-bottom">
        <p>Não encontrou o que precisa? Envie sua lista direto na conversa.</p>
        <button className="text-link" onClick={onQuote}>
          Falar com a HLS <ArrowUpRight size={18} />
        </button>
      </div>
    </section>
  );
}
