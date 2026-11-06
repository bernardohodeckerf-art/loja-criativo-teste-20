export type HlsVideo = {
  id: string;
  src: string;
  poster: string;
  title: string;
  summary: string;
};

export const hlsVideos: HlsVideo[] = [
  {
    id: "barras-transferencia",
    src: "/videos/hls-barras-transferencia.mp4",
    poster: "/images/hls-barras-transferencia-poster.webp",
    title: "Barras de transferência na construção",
    summary:
      "A equipe da HLS apresenta as barras de transferência e explica seu papel na distribuição de cargas em pisos industriais.",
  },
  {
    id: "materiais-e-equipe",
    src: "/videos/hls-materiais-e-equipe.mp4",
    poster: "/images/hls-materiais-e-equipe-poster.webp",
    title: "Um olhar por dentro da HLS",
    summary:
      "Conheça a rotina da equipe, as telas e os rolos de aço, em um passeio pelos materiais e pela fachada da HLS.",
  },
];
