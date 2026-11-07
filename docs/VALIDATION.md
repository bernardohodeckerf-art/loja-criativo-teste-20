# Validação

## Resultado atual: entradas por rolagem e intro industrial

Build de produção passou. A suíte completa `npm test` passou com **33 testes em Chromium e um worker**, em aproximadamente 1,5 minuto. Este é o resultado mais recente; os registros seguintes são de versões anteriores.

`tests/reveal.spec.ts` verifica que fotos, títulos, patrocínios e contato começam com opacidade zero fora da tela, aguardam sua própria rolagem e usam quatro movimentos distintos no percurso exercitado em 1440 e 390 px. Um gesto CDP de toque faz o próximo título aparecer no contexto móvel real emulado, mantendo a rolagem vertical. Testados foco imediato, mudança dinâmica de movimento reduzido e clique durante a entrada: o alvo fica estável enquanto pressionado e abre o questionário.

Na galeria desktop, apenas uma das três cenas permanece visível e interativa; as outras ficam ocultas/inert. Navegação por etapas, categoria Rolos, opção estática, fontes 3840w e entradas móveis com opacidade final 1 passaram. A intro foi verificada com desenho SVG, duas linhas de palavras, três recortes fotográficos, saída automática diagonal, chave por sessão, skip e preferência reduzida. Capturas em 320×740, 390×844, 844×390 e 1440×900 foram inspecionadas.

Uma gravação contínua em 390×844 percorreu os 16.099 px de rolagem disponíveis após a intro. Resultado: zero overflow horizontal, nenhum bloco com entrada pendente ao final, nenhuma imagem de `main` quebrada e nenhuma exceção JavaScript observada. Arquivos de demonstração são temporários, fora do repositório. Não houve teste em aparelho físico ou benchmark de taxa de quadros.

As verificações iniciais identificaram máscaras completamente fechadas que impediam a observação de interseção e uma mudança de posição ao focar um botão durante a entrada. A preparação usa uma faixa transparente de área observável e os efeitos pausam durante o pressionamento, mantendo a revelação imediata para teclado. Animações de cena aguardam a seção entrar na tela. Após as correções, todos os 33 testes passaram juntos, incluindo Axe sem violações detectadas no escopo da página e do diálogo, catálogo, questionário, avaliações e vídeos.

## Versão anterior: questionário, mobile, intro e cenas

`npm run build` e a suíte completa `npm test` passaram naquela versão com **29 testes em Chromium, um worker, 58,5 s**.

- Miniquestionário em três etapas: opção de orientação sem bitola, categoria sem descrição obrigatória, contexto da obra, lista e quantidades, edição do resumo, respostas preservadas ao voltar/reabrir, nome obrigatório, Enter sem abrir WhatsApp e mensagem codificada para o número oficial. Nenhuma mensagem foi enviada.
- Site móvel completo em 320×740, 390×844, 768×1024 e 844×390: seções sem corte lateral, menu com contato alcançável, controles principais de toque, diálogo sem overflow, campos de pelo menos 16 px e players 9:16. Em paisagem curta os controles da cena continuam alcançáveis e a rolagem segue alterando o vídeo.
- Intro com logo real: saída automática, uma vez por aba, skip imediato em touch/teclado, preferência reduzida e link direto. A escala inicial da hero não amplia a página. O conteúdo não depende da conclusão de downloads.
- Galeria: mudanças reais de etapa 0→1→2 em desktop e celular, fotos locais carregadas com fontes 3840w, controles diretos de etapa, link que seleciona Rolos e suas cinco medidas, opção estática e movimento reduzido. Inspeção visual em desktop e celular; ajuste também conferido em desktop de 768 px de altura.
- Regressões: 73 produtos, catálogo compacto, avaliações com deslocamento real e pausa, vídeo controlado por rolagem/toque, três players com áudio após ação, teclado e coverflow. Axe na página e no diálogo: zero violações detectadas no escopo automatizado.

A primeira execução encontrou uma divergência entre o texto visível dos botões de etapa e seus nomes acessíveis. Os rótulos redundantes foram removidos para usar o próprio texto visível; build e os 29 testes foram executados novamente e passaram. Isso não substitui revisão com leitor de tela ou dispositivos físicos. Os limites de Chromium/emulação e as fontes datadas das avaliações permanecem os mesmos.

## Histórico do ambiente e das versões anteriores

Ambiente preparado com Node.js 24.22.1, npm 11.9.0, Chromium do sistema e FFmpeg. Instalação repetida com `npm ci --cache /tmp/hls-npm-cache --no-audit --no-fund`, sem modificar o lockfile. TypeScript e build de produção concluídos. Servidor Vite iniciado, reiniciado após reinstalação para renovar cache e validado com requisições e navegador.

## Testes executados

Suíte Playwright `npm test`: **18 testes passaram**, com um worker, em Chromium. Os cenários cobrem:

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

## Catálogo compacto e avaliações Google

Atualização de 06/11/2026: **15 testes passaram** na suíte completa. Os novos testes em `tests/reviews-catalog.spec.ts` percorrem as dez categorias, confirmam 73 medidas, no máximo uma foto ilustrativa por categoria (cinco imagens no total), nenhuma foto repetida dentro dos itens e linhas de até 90 px no desktop. Os 24 pregos/grampos cabem em um único grupo de aproximadamente 688 px de altura no viewport 1440×1000, em vez de cards grandes com imagem repetida. A seleção e a consulta de Estribo 7x17 também foram verificadas.

Para avaliações, verificados registro datado, seleção de nove comentários, notas de 3 e 4 estrelas preservadas, botão de pausa, camada decorativa inert/aria-hidden, leitura estática acessível, preferência dinâmica de movimento reduzido e apresentação sem animação no mobile. A revisão Axe da página e do diálogo passou. Capturas desktop/mobile do catálogo e das avaliações foram revisadas.

As avaliações foram verificadas nas capturas fornecidas pelo usuário, não em uma integração ativa com a API Google. A nota 4,7 e as 63 avaliações são identificadas como registro de 06/11/2026; não se afirma atualização automática.

## Cena de rolagem, mobile e imagens 4K

A suíte completa após a atualização passou com **18 testes**. Três novos cenários em `tests/scroll-motion.spec.ts` verificam deslocamento real das avaliações em 1440 e 390 px (transform muda), pausa/retomada pelo botão, vídeo que avança e retrocede com a rolagem em ambos os tamanhos, pausa da animação, ausência de overflow, vídeo decorativo muted/paused e preferência de movimento reduzido sem carregamento automático. O terceiro player real foi testado com reprodução e áudio habilitado após ação. A suíte existente validou os três players e a pausa mútua.

Build/TypeScript e Axe passaram. As 12 variantes novas foram verificadas com Pillow, incluindo largura real de 3840 px dos masters. As três fotos e os quadros ao longo do vídeo foram inspecionados visualmente. Capturas desktop/mobile da galeria, cena e avaliações foram revisadas; foram corrigidos espaçamento entre palavras no título móvel e atualização do capítulo ativo após renderizações. Após esses ajustes, os testes de cena e acessibilidade foram repetidos.

A revisão cobre Chromium Linux, viewport móvel e touch emulado. Não se afirma benchmark de 60 fps em todos os aparelhos, validação em Safari/iOS físico ou aumento comprovado de conversão/vendas. O vídeo recebido é 720p; só as novas fontes fotográficas são de resolução superior a 4K.

O teste adicional de toque real emulado inicialmente expôs uma falha intermitente de carregamento antes do primeiro callback de IntersectionObserver. Foi acrescentada uma checagem de proximidade por rAF/scroll para posições restauradas ou links internos em mobile; ela se desliga após confirmar a proximidade. A animação também verifica a geometria visível antes de pintar, em vez de depender exclusivamente de um callback anterior do observer. Após a correção, os quatro testes de movimento passaram, incluindo o gesto CDP: rolagem vertical real e avanço do vídeo sem prender a página. São 19 cenários distintos validados no total (suíte de 18 mais o cenário de toque; o conjunto de movimento foi reexecutado após a correção).
