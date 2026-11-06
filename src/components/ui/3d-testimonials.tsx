import { useState } from "react";
export type Testimonial = {
  text: string;
  author: string;
  source: string;
  url: string;
};
export function Testimonials({ items = [] }: { items?: Testimonial[] }) {
  const [paused, setPaused] = useState(false);
  if (!items.length)
    return (
      <div className="review-link">
        <p>Uma boa escolha começa com confiança.</p>
        <h3>Conheça outras experiências.</h3>
        <a
          className="text-link"
          href="https://www.google.com/maps/search/?api=1&query=HLS+Ferragens+Blumenau"
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar avaliações públicas ↗
        </a>
      </div>
    );
  return (
    <div className={`testimonials ${paused ? "paused" : ""}`}>
      <button onClick={() => setPaused(!paused)}>
        {paused ? "Retomar movimento" : "Pausar movimento"}
      </button>
      {items.map((item) => (
        <blockquote key={item.url + item.author}>
          <p>{item.text}</p>
          <cite>{item.author}</cite>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.source}
          </a>
        </blockquote>
      ))}
    </div>
  );
}
