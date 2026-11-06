# Design e parâmetros

Linguagem editorial industrial: títulos grandes e leves, grelha espaçosa, linhas finas e fotografia de materiais. Logo real com fundo grafite intacto. Sem decoração laranja/vermelha, estatísticas ou depoimentos fabricados.

- Marinho `#102b36`, tinta `#18333e`, turquesa `#44c5cf`, fundo `#f5f6f3`, aço `#e6ece9`.
- Tipografia: Arial/Helvetica/sans-serif de sistema, sem bloqueio por fonte externa. Rótulos monoespaçados.
- Container até 1280 px; gutters 56 px desktop e 20 px mobile. Breakpoints: 360, 760, 1000 e 1600 px. Grid de produtos 3/2/1 colunas.
- Hero estável com svh e fallback em pixels, foto poster imediata, texto e CTA independentes do vídeo. `object-position` por breakpoint em `.hero video`.
- `.product-card`: hover apenas em mouse fino; -6 px, escala 1.015, 260 ms e curva `cubic-bezier(.22,1,.36,1)`. Foco mantém borda/sombra; movimento reduzido remove transform.
- `.magnetic-button`: alvo externo estável; conteúdo interno move via rAF. Props `limit` (8), `strength` (.16), `radius` (180), `returnDuration` (260). Desativa em touch, teclado e movimento reduzido; cancela rAF e reseta ao sair/perder foco.
- Coverflow enviado: `src/components/ui/coverflow-carousel.tsx`. Atualização direta no DOM, rAF, ResizeObserver, limpeza, arraste com `touch-action: pan-y`, teclado e paginação. Parâmetros usados em App: rotação 28°, depth .32, perspective 4, fade .22, gap .12, largura `clamp(230px,36vw,460px)`. Zero slides retorna vazio; um slide permanece visível e sem controles desnecessários. Erro de imagem tem fallback textual. Movimento reduzido assenta imediatamente. Legendas e medidas ficam fora da perspectiva. Todos os itens continuam no catálogo.
- `useScrollReveal`: animação progressiva via IntersectionObserver e Web Animations, sem ocultar conteúdo por CSS. Movimento reduzido cancela animações ativas. Progresso de rolagem usa scaleX e rAF; sem scroll hijacking.
- Vidro em `.interest-float` com fundo translúcido legível mesmo sem backdrop-filter. Componentes tipados `GlassEffect`, `GlassButton`, `GlassFilter`; IDs de filtro SVG únicos via useId, sem camada interativa decorativa.
- Depoimentos: estado atual honesto com link externo. O componente só recebe falas/autores após verificação; não há clones decorativos focáveis. Movimento desativa no mobile e por preferência.
- Questionário em dialog nativo: foco contido pelo navegador, título focado por etapa, Escape, retorno ao acionador, labels persistentes, erros associados e respostas em memória. Não armazena dados em serviços ou localStorage.
