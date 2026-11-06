# Validação — 06/11/2026

Ambiente preparado com Node.js 24.22.1, npm 11.9.0, Chromium do sistema e FFmpeg. Instalação repetida com `npm ci --cache /tmp/hls-npm-cache --no-audit --no-fund`, sem modificar o lockfile. TypeScript e build de produção concluídos. Servidor Vite iniciado, reiniciado após reinstalação para renovar cache e validado com requisições e navegador.

## Testes executados

Suíte Playwright `npm test`: **13 testes passaram**, com um worker, em Chromium. Os cenários cobrem:

1. Catálogo com 73 opções, 24 pregos/grampos, busca sem acentos e com vírgula decimal, filtros, estado vazio, foto carregada e inclusão única.
2. Quantidade inválida/válida, unidade, validação de etapas, retorno preservando respostas, resumo e URL encodeURIComponent para destino fixo. Nenhuma mensagem foi enviada.
3. Axe na página e no diálogo: **zero violações detectadas**, após correção de contraste e nomes acessíveis. Isso não equivale a certificação completa WCAG.
4. Menu por teclado/Escape, retorno de foco, carrossel por setas e ausência de overflow em 320, 390, 768 e 1440 px.
5. Movimento reduzido: poster estático e nenhuma fonte de vídeo carregada automaticamente; carrossel funcional; ativos locais retornam tipos corretos. Mapa não carrega sem ação.
6. Mouse: elevação do produto, alvo externo estável no botão magnético e pausa do vídeo ao sair da hero.
7. Coverflow: paginação, arraste e cancelamento sem perder navegação.
8. Coverflow isolado no navegador: zero slides, um slide visível sem controles desnecessários e fallback de imagem com erro. O fixture intercepta apenas o módulo App dentro do teste, sem rota de demonstração no produto.
9. Orçamento vazio e remoção de produto, sem avanço sem descrição de material.
10. Contexto touch móvel do Chromium: menu, arraste horizontal no coverflow, rolagem vertical preservada e sem overflow.

Inspeção visual das capturas desktop/mobile e das imagens reais usadas (logo, pregos, barras, malha, arame e fotos dos times). Nenhuma imagem quebrada ou exceção de JavaScript no fluxo exercitado. Revisão de código: sem secrets, endpoints próprios, dangerouslySetInnerHTML, analytics ou armazenamento externo de respostas.

`npm audit` consultado com dependências de produção e desenvolvimento: zero vulnerabilidades conhecidas reportadas na consulta. Isso não garante ausência de vulnerabilidades futuras.

## Limites e próximos passos

- Testes são em Chromium Linux com mouse, teclado e emulação móvel/touch. Safari, Firefox, dispositivos físicos, leitores de tela reais e rede móvel real não foram validados.
- Os dois MP4 próprios foram recebidos e integrados posteriormente. Foram inspecionados os quadros, posters, proporções e legendas embutidas; a preservação exata das faixas codificadas de áudio e vídeo foi verificada por hash. Não foi feita uma auditoria/transcrição independente do conteúdo falado.
- Não houve envio pelo WhatsApp, publicação do site, validação de checkout/pagamento (inexistentes) ou acesso a informações privadas da empresa.
- Cabeçalhos `_headers` precisam de hosting compatível; não se afirma que Vite os aplica. Google Maps externo e destino WhatsApp dependem dos respectivos serviços.
- Sem restauração em uma nova tarefa para provar o snapshot. `install_script` e `start_skill` foram salvos no rascunho; publicação é feita nas configurações do ambiente pelo usuário.
- Pendências editoriais e fontes em CONTENT-SOURCES.md. Horários e mínimo de entrega seguem sob consulta; nenhuma promessa de estoque ou prazo foi adicionada.

Checagem adicional do build servido por `vite preview`: bundle executou em viewport móvel, 24 pregos/grampos encontrados, reprodução manual da hero sob movimento reduzido funcionou, zero overflow horizontal e zero exceções JavaScript observadas. O preview temporário foi encerrado; o servidor de desenvolvimento permanece em execução. Após associar os erros de quantidade ao respectivo input, os testes de questionário e acessibilidade foram repetidos e passaram.

## Integração dos dois vídeos enviados

A suíte completa foi executada novamente com os vídeos reais: **13 testes passaram**, incluindo três novos cenários em `tests/videos.spec.ts`. Verificados: nenhum download automático do MP4 antes do clique, posters reais, reprodução dos dois arquivos, resolução 720×1280, áudio não silenciado após ação, controles nativos, pausa mútua, mensagem de erro e tentativa posterior bem-sucedida, acionamento por teclado e enquadramento 9:16 em 390 px sem overflow. Build/TypeScript passaram; revisão Axe da página e do diálogo continuou sem violações detectadas. Capturas desktop e mobile da nova seção foram inspecionadas.

Uma execução intermediária teve timeout no teste existente do questionário enquanto também eram produzidas capturas. O teste passou isoladamente com trace e depois na suíte completa, sem alterar suas asserções. Não foi identificada uma falha funcional reproduzível no questionário.

As faixas codificadas de áudio e vídeo dos arquivos entregues são idênticas às originais, verificadas por hash após remux para faststart. Não houve recorte, recompressão, mudança de resolução ou remoção das legendas embutidas. O start_skill salvo foi atualizado para retirar a antiga pendência dos vídeos; a publicação do ambiente atualizado continua a cargo do usuário nas configurações.
