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
- Avaliações: adaptado o Marquee vertical enviado pelo usuário com Card e Avatar shadcn. Três colunas em perspectiva discreta, sentidos alternados, máscaras nas bordas, pausa por botão/hover/foco. A camada animada e suas repetições são decorativas (`aria-hidden`, sem links, botões ou outros elementos focáveis); uma leitura completa e estática é acessível em “Ler avaliações sem movimento”. No mobile há uma coluna animada, e no desktop três. Só a preferência de movimento reduzido troca automaticamente pela lista estática. Fonte: nove comentários legíveis das capturas do Google enviadas; avatares por iniciais, sem fotos fictícias.
- Questionário em dialog nativo: foco contido pelo navegador, título focado por etapa, Escape, retorno ao acionador, labels persistentes, erros associados e respostas em memória. Não armazena dados em serviços ou localStorage.

## Catálogo compacto

Uma imagem ilustrativa pequena por categoria, sem repetir a foto em cada medida. As 73 opções permanecem separadamente selecionáveis em linhas de aproximadamente 76 px no desktop e 60 px no mobile. Grid 4 colunas em telas largas, 3 no desktop intermediário, 2 no tablet e 1 no celular. Categoria, preço sob consulta e observações são mostrados uma vez por grupo. Busca, filtros, consulta de uma medida e seleção para a lista permanecem funcionais. Estilos em `.catalog-group`, `.category-heading`, `.category-photo` e `.product-card`.

O Marquee usa `--duration:45s` e `--gap:16px`; parâmetros `vertical`, `reverse`, `pauseOnHover`, `repeat` e `autoFill`. As animações usam somente transform. A referência tinha o nome `3d-testimonails.tsx`; foi adaptada no caminho já usado pelo projeto, `3d-testimonials.tsx`. Não foram incluídos os autores, avatares e textos genéricos da demo.

## Movimento revisado e cena industrial

Corrigida a pausa ampla das avaliações: o cursor sobre o título, a nota ou qualquer espaço do bloco não congela mais a animação. A pausa por hover se limita aos cards em mouse fino; o botão funciona para pausar e retomar mesmo com foco. A leitura estática por teclado ainda pausa o movimento. A coluna móvel anima por padrão (65 s por grupo) e as três colunas desktop por 28 s, com direção alternada. Não foi usado um simples teste de play-state: o deslocamento real por transform foi medido no navegador.

Galeria: três fotografias com fontes acima de 4K, parallax discreto via transform/rAF e links de categoria. A evolução atual usa capítulos verticais no celular, descritos abaixo. Preservado o catálogo compacto.

Cena `#em-movimento`: uma composição sticky de aproximadamente duas alturas de viewport, sem capturar roda/toque. O progresso ajusta frame do vídeo, luz, deslocamento discreto e três capítulos. Atualização por rAF, listeners passivos, ResizeObserver, IntersectionObserver, limpeza e pausa ao ocultar a aba. O estado React só muda na troca de capítulo; não há setState por pixel. O seek controla currentTime com tolerância e aguarda seeked.

No celular, o vídeo continua 9:16 e os mesmos recursos de rolagem funcionam com composição mais curta. Pausa manual, dados reduzidos, fallback e movimento reduzido permanecem disponíveis. A referência visual antiga inspirou o movimento; não foi copiada a marca, história ou implementação da perfumaria.

O carregamento por proximidade tem fallback por rAF/scroll para posições móveis restauradas antes do callback do IntersectionObserver. O fallback se remove assim que a seção se aproxima; não mantém leituras de layout para o carregamento durante toda a página.

## Miniquestionário personalizado da HLS

A chamada “O material certo. O próximo passo é seu.” conduz ao CTA “Quero cotar minha obra”. O orçamento anterior foi reduzido a três etapas, com revisão dentro da terceira: materiais (incluindo lista editável do catálogo e orientação), cidade/entrega/previsão e nome/resumo. A etapa da obra é opcional: fundação, estrutura, laje, reforma/ampliação, reposição ou planejamento.

Não é necessário preencher descrição técnica quando já há categoria, itens ou pedido de orientação. As respostas permanecem ao voltar, editar e reabrir. O resumo incorpora as categorias dos itens escolhidos, contexto e só campos preenchidos. O CTA final “Quero cotar no WhatsApp” só se torna link com destino fixo depois da validação de todas as etapas; antes disso é um botão que valida o nome. Enter no nome valida e leva foco ao link, sem abrir outra aba automaticamente.

Os seletores `.quote-invitation`, `.quote-steps`, `.quote-guidance`, `.quote-review-heading` e `.quote-field-grid` controlam a apresentação. O progresso real vai de 1 a 3. Há foco no título, Escape, retorno ao acionador e erros associados. Sem promessa de estoque, menor preço, prazo ou envio automático.

## Adaptação móvel integral

`src/mobile.css`, importado após os estilos gerais, consolida a adaptação do site. Revisadas larguras de 320/390/768 px e 844×390 em paisagem: gutters e safe-area, menu rolável, controles e links com área de toque de pelo menos 44 px nos alvos principais, campos de 16 px para evitar zoom involuntário do iOS, catálogo compacto, vídeos verticais e rodapé livre da barra do sistema. Tablets usam duas colunas de vídeo e centralizam o terceiro.

Em telas baixas (até 550 px de altura), hero e cena de rolagem passam a um fluxo que mantém conteúdo e controles alcançáveis. A cena sai do sticky, mas continua controlando o frame pela rolagem normal com um cálculo específico; não se perde a animação. Movimento reduzido e pausa manual permanecem respeitados.

## Intro de marca

A referência pública Studio Harmony foi inspecionada em seu HTML/CSS. Ela usa marca centralizada, revelação por máscara, linha crescente e uma cortina subindo; a HLS ganhou uma interpretação com a logo real local e marinho/turquesa, sem usar textos, imagem ou identidade da clínica. A cortina sai em aproximadamente 1,9 s; a entrada das linhas da hero termina em seguida, com failsafe total de 2,5 s. Não é um loader de vídeo ou progresso real de download.

`BrandIntro` aparece só no primeiro carregamento da aba (`sessionStorage` guarda apenas o indicador `hls:intro:seen`, nunca as respostas do orçamento). Links com hash, movimento reduzido e posições restauradas pulam a intro. Botão “Pular abertura”, Escape, Tab, ponteiro ou rolagem permitem continuar imediatamente. Sem trava de body/scroll e sem espera por fontes/vídeos. A camada é decorativa e fica fora da árvore acessível; o botão é acessível. O zoom do vídeo é recortado apenas pela hero, evitando overflow lateral durante a entrada.

## Materiais que mudam com a rolagem

A referência Churrasco no Prato inspirou uma nova sequência própria na galeria `#materiais-em-cena`: aço, telas e rolos. No desktop largo e alto, a composição fica sticky durante um trecho de rolagem nativa, mudando foto em destaque, saturação, profundidade, legenda e progresso. As três fotos e os textos continuam disponíveis. Botões permitem ir direto a cada etapa; os links das fotos abrem a categoria correspondente do catálogo.

Até 900 px de largura ou 650 px de altura, a galeria fica no fluxo normal. No celular, cada fotografia ocupa um capítulo vertical e o centro da tela controla a ênfase, a revelação e o parallax. Não há captura de roda, bloqueio de toque ou trilho que exija arrastar lateralmente. “Ver sem animação” recolhe o trecho sticky e remove os efeitos; movimento reduzido aplica essa apresentação automaticamente. Listeners passivos, rAF, observação de tamanho e limpeza evitam atualizações React por pixel. Estilos isolados em `material-gallery.css`.
