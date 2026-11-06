# Conteúdo, fontes e pendências

Consulta em 06/11/2026. Dados confirmados abaixo significam encontrados no site público, não auditoria independente da empresa.

## Confirmado na fonte oficial

Páginas: https://ferragenshls.com.br/, https://ferragenshls.com.br/produtos e https://ferragenshls.com.br/patrocinios. O HTML inicial só contém o shell React. O conteúdo foi obtido do recurso público `/static/js/main.80b7480e.js`, incluindo a coleção `Ka` do catálogo e as informações dos patrocínios.

- HLS Ferragens; ferragens para construção civil; site afirma mais de 30 anos. Usado “Há mais de três décadas”.
- WhatsApp `https://wa.me/554733306633`, telefone (47) 3330-6633.
- Rua Johann G. H. Hadlich, 1852, Passo Manso, Blumenau–SC, CEP 89032-400.
- Telas Indaial como empresa do grupo e fornecedora de telas.
- Dez categorias, 73 opções e medidas preservadas em `src/data/catalog.json`. A indicação de 120 MTS em Tela MF foi preservada, sem reinterpretar sua especificação.
- Patrocínio HLS → Clube Atlético Metropolitano (futebol) e Blumenau Futsal, identificado no site como temporada 2026. A data está explícita; não se afirma vínculo permanente.

Logo real: https://ferragenshls.com.br/imagens/image.png. Baixada e inspecionada: símbolo HLS turquesa, FERRAGENS branco e fundo grafite. Proporções e fundo preservados. A imagem do Instagram citada no briefing não foi recebida, portanto comparação visual com ela permanece pendente.

Escudos/fotos baixados e inspecionados: `/imagens/logo-metro.png`, `/imagens/logo-blumenau.png`, `/imagens/time.png` (três jogadores com uniforme HLS), `/imagens/u3w9kc1x-time.png` (elenco do futsal), `/imagens/patrocinio.png`. São ativos oficiais, não conteúdo de banco. Fotos em uso têm conversões WebP; o enquadramento dos times é preservado. A publicação desses ativos deve ser validada pela empresa titular; não foi localizada licença aberta específica.

## Fotografias da internet

Todas baixadas, inspecionadas visualmente e servidas localmente, em WebP com versões de 480 e 1000 px. Pexels permite uso e edição sob sua licença; páginas de origem e licença consultadas. Sem alegar endosso dos fotógrafos ou disponibilidade de produtos.

| Arquivo | Conteúdo | Autor na página | Fonte |
| --- | --- | --- | --- |
| `nails*.webp` | Pregos metálicos | Willians Huerta | https://www.pexels.com/photo/36398239/ |
| `rebar*.webp` | Barras de aço nervuradas | Pixabay | https://www.pexels.com/photo/46167/ |
| `mesh*.webp` | Malha de aço para construção | tom analogicus | https://www.pexels.com/photo/37426459/ |
| `wire*.webp` | Rolo de arame metálico | Collab Media | https://www.pexels.com/photo/15059762/ |

Licença: https://www.pexels.com/license/. Fotografias ilustram famílias de materiais; não são fotografias de cada SKU ou da HLS. Sem foto identificada adequadamente para treliça, coluna pronta, estribo ou BTG: esses itens conservam medidas textuais, sem usar fotos de produtos diferentes como substituto.

Vídeo da hero: https://www.pexels.com/video/professional-welding-steel-6046358/ (licença Pexels). Cena ilustrativa de trabalho com metal, sem atribuí-la às instalações da HLS ou anunciar serviço de soldagem. Fonte 4K indicada no briefing baixada; detalhes em MEDIA.md.

## Avaliações e redes sociais

https://www.instagram.com/hlsferragens/ respondeu com a página do perfil; não se extraíram informações privadas nem se autenticou a conta. Não se usaram dados de curtidas, seguidores ou supostos depoimentos.

https://www.planetabrasileiro.com/blumenau/ferragens retornou HTTP 403. A consulta automática não forneceu depoimentos verificáveis. Posteriormente o usuário enviou cinco capturas do painel de avaliações do Google da HLS, com nome e endereço correspondentes ao site oficial. Foram transcritas nove entradas com autor, texto e estrelas legíveis. A interface agora apresenta essa seleção e o registro da nota 4,7 / 63 avaliações, datado do recebimento das capturas (06/11/2026); não há sincronização em tempo real.

## Atualização dos vídeos

Os dois vídeos próprios estão disponíveis na seção “A HLS na prática”, com posters reais, legendas embutidas e áudio originais preservados. O carregamento depende de ação do visitante; iniciar um pausa o outro.

- **Vídeos concluídos:** os dois MP4 foram recebidos em 06/11/2026 e integrados após inspeção visual. “Barras de transferência na construção” apresenta a explicação da equipe sobre distribuição de cargas; “Um olhar por dentro da HLS” mostra equipe, materiais e fachada. Fontes, hashes e preservação das faixas estão em `video-assets.json`; não há transcrição inventada. Os arquivos foram fornecidos pelo usuário para esta implementação, sem atribuir a eles uma licença aberta.

## Pendente antes da publicação

- Confirmar com a HLS divergência entre (47) 3330-5579 (relatado no briefing sobre Instagram) e (47) 3330-6633 (confirmado no site). Priorizado apenas o número oficial do site, centralizado.
- O site informa mais de 30 anos; briefing relata print com mais de 25. Usada apenas a informação atual do site; empresa deve aprovar a redação final.
- Pedido mínimo de R$ 1.000,00 e tabela datada de 10/04/2026 não foram apresentados como condições/preços atuais. Valores, frete, prazos e estoque ficam sob consulta.
- Dias, intervalos e horários completos não foram comprovados. Interface: “Consulte os horários pelo WhatsApp”. Sem indicador de aberto/fechado.
- As referências originais `3d-testimonials.tsx` e `liquid-glass.tsx` e a imagem da construtora citadas no briefing não foram anexadas; foram implementados componentes próprios com esses nomes. O coverflow original efetivamente recebido foi integrado e adaptado.
- Definir URL final, revisão da empresa sobre textos, usos de marca e imagens, atualização de patrocínio após temporada 2026 e eventual imagem Open Graph oficial.

## Avaliações Google — fonte fornecida pelo usuário

As cinco capturas enviadas nesta conversa mostram o painel HLS Ferragens, Rua Johann G. H. Hadlich, 1852, Passo Manso, Blumenau–SC, 89032-400. A nota 4,7 e o total de 63 avaliações são um registro das capturas, não uma consulta atualizada por API. Autores/textos/estrelas transcritos estão centralizados em `src/data/reviews.ts`. Não foram calculadas datas exatas a partir de “há X anos”, nem usados os avatares pequenos/ilegíveis ou fotos de banco. Os avatares exibem apenas iniciais dos nomes.

Selecionadas apenas entradas com autoria e texto inteiros legíveis: felipe gabriel mantovani sardagna (5), The Rookie Driver (5), Marcus Vinícius Pitz (5), Rodnei Alves (5), Guilherme (5), programming tools (5), Sidnei Oliveira Da Rosa (3), Cleiso Porto (4) e Rogerio Bernardi (5). Textos sem autoria visível, cartões cortados e entradas sem comentário foram omitidos. O teor favorável dos comentários de 3/4 estrelas não foi usado para alterar suas notas. As afirmações nos comentários são dos autores e não se transformam em promessas comerciais da HLS.

Não foi fornecido um link compartilhável individual de cada avaliação. O botão “Consultar no Google” abre uma busca de Maps pelo nome/endereço; não se apresenta como link direto a uma avaliação específica. Não se publicou AggregateRating em dados estruturados.

A tentativa de adicionar a CA oficial do ambiente ao armazenamento NSS do Chromium foi rejeitada pela revisão automática por exigir alteração de confiança persistente. Nenhuma alteração de certificados foi efetuada, a verificação TLS não foi desativada e a fonte utilizada para as avaliações foi o material enviado pelo usuário. As requisições HTTPS de texto continuaram com a verificação normal ativa.
