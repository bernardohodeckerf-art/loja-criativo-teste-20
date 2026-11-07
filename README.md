# HLS Ferragens

Frontend em português, React + TypeScript + Vite + Tailwind CSS 4. Sem backend, cadastro, checkout ou envio automático de mensagens.

## Rodar

Requer Node.js >=22.12 (ambiente validado com 24.22.1) e npm.

```sh
cd /workspace/loja-criativo-teste-20
npm ci --cache /tmp/hls-npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

```sh
npm run typecheck
npm run build
npm test
```

Os testes Playwright usam `/usr/bin/chromium` quando disponível. Em outra máquina, instale Chromium com `npx playwright install chromium` ou defina `CHROMIUM_PATH`. A suíte inicia o servidor se ele ainda não estiver executando. Não precisa de secrets nem variáveis para desenvolver.

## Estrutura e conteúdo

- `src/components/ui/`: coverflow enviado, vidro, botão magnético e avaliações.
- `src/components/sections/`: hero, catálogo, orçamento, vídeos e mapa sob demanda.
- `src/data/catalog.json`: 73 entradas extraídas do catálogo oficial, com as medidas das capturas fornecidas.
- `src/data/company.ts`: único lugar para configurar contatos e endereço.
- `src/components/sections/ScrollStory.tsx`: cena do caminhão que avança e retrocede com o scroll em desktop/celular; player completo com áudio em `#video-carga`.
- `src/components/sections/MaterialGallery.tsx` e `material-gallery.css`: três cenas que aparecem uma por vez no desktop e se revelam em capítulos verticais no celular, com controles de etapa e opção estática. Fotografias locais com variantes WebP 480/960/1920/3840 px e carregamento lazy.
- `src/data/reviews.ts`: nove avaliações transcritas das capturas do Google enviadas, com notas originais e data do registro. Sem atualização automática.
- `src/lib/quote.ts`: mensagem e validação do miniquestionário de 3 etapas (materiais, local/previsão e nome/revisão). Opção de orientação sem exigir bitola, contexto da obra opcional e dados apenas em memória.
- `src/components/ui/brand-intro.tsx` e `brand-intro.css`: abertura com desenho animado de estrutura, palavras em movimento, montagem de fotos e saída diagonal. Uma vez por aba, pulável e sem esperar downloads. Movimento reduzido e links diretos não passam pela intro.
- `src/hooks/useScrollReveal.ts`: blocos que aguardam a rolagem para entrar com movimentos diferentes; atende conteúdo dinâmico, foco de teclado e preferência reduzida.
- `src/components/sections/QuoteCTA.tsx`: chamada personalizada “Quero cotar minha obra”, conectada ao mesmo orçamento e à lista do catálogo.
- `src/data/videos.ts`: os três vídeos HLS fornecidos, inspecionados e integrados, com títulos, resumos e posters extraídos. Reprodução por clique, enquadramento 9:16, áudio original e pausa mútua.
- `public/images/` e `public/videos/`: mídia servida localmente. Fotos de banco são ilustrativas da categoria, não demonstram estoque, marca ou a medida exata de cada item. Grampos não recebem foto de pregos.
- Alias `@/` e `components.json` preparados para shadcn/ui. Os componentes desta entrega não exigem providers adicionais.

A adaptação móvel é consolidada em `src/mobile.css`, com safe-area, controles para toque, campos de 16 px e tratamento de telas horizontais baixas sem cortar a cena de rolagem.

Consulte [fontes e pendências](docs/CONTENT-SOURCES.md), [design e efeitos](docs/DESIGN.md), [vídeos](docs/MEDIA.md) e [validação](docs/VALIDATION.md).

## Publicação

Esta implementação é uma prévia privada, com `noindex,nofollow` e `robots.txt` bloqueando indexação. Antes de publicar, confirme os itens pendentes do documento de conteúdo, substitua as regras de indexação e defina canonical, imagem Open Graph, sitemap e dados estruturados com a URL final aprovada. Não há domínio de produção inventado. O site oficial permanece inalterado.

`public/_headers` fornece cabeçalhos para hostings compatíveis (ex.: Netlify/Cloudflare Pages). Outros hostings exigem configuração equivalente; Vite não aplica esse arquivo em desenvolvimento. O Google Maps só é carregado por ação do visitante. O WhatsApp abre com texto para revisão, sem enviar pedido ou confirmar orçamento.
