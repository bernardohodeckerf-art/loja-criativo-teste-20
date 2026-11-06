export type GoogleReview = {
  id: string;
  author: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

// Transcribed only from complete, legible entries in the Google screenshots
// supplied by the user on 2026-11-06. This is a dated record, not a live API feed.
export const googleReviewSource = {
  name: "Google",
  recordedOn: "2026-11-06",
  recordedLabel: "06/11/2026",
  rating: "4,7",
  total: 63,
  url: "https://www.google.com/maps/search/?api=1&query=HLS+Ferragens+Rua+Johann+G.+H.+Hadlich+1852+Blumenau",
};

export const googleReviews: GoogleReview[] = [
  {
    id: "felipe-gabriel",
    author: "felipe gabriel mantovani sardagna",
    rating: 5,
    text: "Atendimento bom entrega rápida",
  },
  {
    id: "rookie-driver",
    author: "The Rookie Driver",
    rating: 5,
    text: "Fui muito bem atendido recomendo a todos",
  },
  {
    id: "marcus-pitz",
    author: "Marcus Vinícius Pitz",
    rating: 5,
    text: "Ótimo atendimento e pós venda. Em questão de ferros eles tem o melhor preço da região de Blumenau, após algumas pesquisas e orçamentos que eu realizei.",
  },
  {
    id: "rodnei-alves",
    author: "Rodnei Alves",
    rating: 5,
    text: "Muito bom o atendimento e a qualidade",
  },
  {
    id: "guilherme",
    author: "Guilherme",
    rating: 5,
    text: "Atendimento otimo e material de qualidade!!!",
  },
  {
    id: "programming-tools",
    author: "programming tools",
    rating: 5,
    text: "Ótima qualidade e valores maravilhosos para o nosso bolso",
  },
  {
    id: "sidnei-rosa",
    author: "Sidnei Oliveira Da Rosa",
    rating: 3,
    text: "Ótimo atendimento",
  },
  {
    id: "cleiso-porto",
    author: "Cleiso Porto",
    rating: 4,
    text: "Entregas rápidas e valores competitivos!",
  },
  {
    id: "rogerio-bernardi",
    author: "Rogerio Bernardi",
    rating: 5,
    text: "Excelente",
  },
];
