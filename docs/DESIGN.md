# Design e parâmetros

Linguagem editorial industrial: títulos grandes e leves, grelha espaçosa, linhas finas e fotografia de materiais. Logo real com fundo grafite intacto. Sem decoração laranja/vermelha, estatísticas ou depoimentos fabricados.

- Marinho `#102b36`, tinta `#18333e`, turquesa `#44c5cf`, fundo `#f5f6f3`, aço `#e6ece9`.
- Tipografia: Arial/Helvetica/sans-serif de sistema, sem bloqueio por fonte externa. Rótulos monoespaçados.
- Container até 1280 px; gutters 56 px desktop e 20 px mobile. Breakpoints: 360, 760, 1000 e 1600 px. Grid compacto de produtos 4/3/2/1 colunas.
- Hero estável com svh e fallback em pixels, foto poster imediata, texto e CTA independentes do vídeo. `object-position` por breakpoint em `.hero video`.
- `.product-card`: hover apenas em mouse fino; -6 px, escala 1.015, 260 ms e curva `cubic-bezier(.22,1,.36,1)`. Foco mantém borda/sombra; movimento reduzido remove transform.
- `.magnetic-button`: alvo externo estável; conteúdo interno move via rAF. Props `limit` (8), `strength` (.16), `radius` (180), `returnDuration` (260). Desativa em touch, teclado e movimento reduzido; cancela rAF e reseta ao sair/perder foco.
- Coverflow enviado: `src/components/ui/coverflow-carousel.tsx`. Atualização direta no DOM, rAF, ResizeObserver, limpeza, arraste com `touch-action: pan-y`, teclado e paginação. Parâmetros usados em App: rotação 28°, depth .32, perspective 4, fade .22, gap .12, largura `clamp(230px,36vw,460px)`. Zero slides retorna vazio; um slide permanece visível e sem controles desnecessários. Erro de imagem tem fallback textual. Movimento reduzido assenta imediatamente. Legendas e medidas ficam fora da perspectiva. Todos os itens continuam no catálogo.
- `useScrollReveal`: animação progressiva via IntersectionObserver e Web Animations, sem ocultar conteúdo por CSS. Movimento reduzido cancela animações ativas. Progresso de rolagem usa scaleX e rAF; sem scroll hijacking.
- Vidro em `.interest-float` com fundo translúcido legível mesmo sem backdrop-filter. Componentes tipados `GlassEffect`, `GlassButton`, `GlassFilter`; IDs de filtro SVG únicos via useId, sem camada interativa decorativa.
- Avaliações: adaptado o Marquee vertical enviado pelo usuário com Card e Avatar shadcn. Três colunas em perspectiva discreta, sentidos alternados, máscaras nas bordas, pausa por botão/hover/foco. A camada animada e suas repetições são decorativas (`aria-hidden` e `inert`); uma leitura completa e estática é acessível em “Ler avaliações sem movimento”. No mobile e com movimento reduzido, só a lista estática é renderizada. Fonte: nove comentários legíveis das capturas do Google enviadas; avatares por iniciais, sem fotos fictícias.
- Questionário em dialog nativo: foco contido pelo navegador, título focado por etapa, Escape, retorno ao acionador, labels persistentes, erros associados e respostas em memória. Não armazena dados em serviços ou localStorage.

## Catálogo compacto

Uma imagem ilustrativa pequena por categoria, sem repetir a foto em cada medida. As 73 opções permanecem separadamente selecionáveis em linhas de aproximadamente 76 px no desktop e 60 px no mobile. Grid 4 colunas em telas largas, 3 no desktop intermediário, 2 no tablet e 1 no celular. Categoria, preço sob consulta e observações são mostrados uma vez por grupo. Busca, filtros, consulta de uma medida e seleção para a lista permanecem funcionais. Estilos em `.catalog-group`, `.category-heading`, `.category-photo` e `.product-card`.

O Marquee usa `--duration:45s` e `--gap:16px`; parâmetros `vertical`, `reverse`, `pauseOnHover`, `repeat` e `autoFill`. As animações usam somente transform. A referência tinha o nome `3d-testimonails.tsx`; foi adaptada no caminho já usado pelo projeto, `3d-testimonials.tsx`. Não foram incluídos os autores, avatares e textos genéricos da demo.
