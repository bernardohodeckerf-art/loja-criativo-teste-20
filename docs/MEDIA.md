# Mídias

Fonte da hero: vídeo 6046358, Pexels, 3840×2160, 24 fps, duração original 34,92 s, aproximadamente 104 MB. A página associa o vídeo à licença https://www.pexels.com/license/.

Entregues trechos decorativos de 12 s sem áudio: MP4 H.264 (1280×720 desktop, 640×360 mobile), WebM VP9 nas mesmas resoluções e poster WebP 1600×900 extraído do segundo 3. Fonte 4K mantida apenas em `/tmp/hls-source.mp4` durante preparo, fora do bundle. Conversões com 2 threads para limitar consumo.

Comandos para reproduzir as conversões, a partir da fonte baixada com TLS válido:

```sh
ffmpeg -ss 3 -i /tmp/hls-source.mp4 -frames:v 1 -vf scale=1600:-2 public/images/hero-poster.webp
ffmpeg -i /tmp/hls-source.mp4 -t 12 -an -vf scale=1280:-2 -c:v libx264 -crf 27 -preset fast -threads 2 -movflags +faststart public/videos/hero-desktop.mp4
ffmpeg -i /tmp/hls-source.mp4 -t 12 -an -vf scale=640:-2 -c:v libx264 -crf 28 -preset fast -threads 2 -movflags +faststart public/videos/hero-mobile.mp4
ffmpeg -i /tmp/hls-source.mp4 -t 12 -an -vf scale=1280:-2 -c:v libvpx-vp9 -crf 38 -b:v 0 -threads 2 -row-mt 1 public/videos/hero-desktop.webm
ffmpeg -i public/videos/hero-mobile.mp4 -an -c:v libvpx-vp9 -crf 38 -b:v 0 -threads 2 -row-mt 1 public/videos/hero-mobile.webm
```

O HTML começa com poster e `preload="none"`; fontes entram após o primeiro frame do conteúdo. Escolhe resolução móvel na inicialização. Vídeo muted/playsInline/loop; botão pausa/reproduz, tratamento de play rejeitado e erro, pausa por IntersectionObserver ou aba oculta. Economia de dados e movimento reduzido priorizam poster; reprodução manual é possível. Não atribuir as cenas à HLS.

## Vídeos próprios recebidos e integrados

Os dois MP4 enviados pelo usuário foram inspecionados por amostragem visual ao longo de toda a duração. São 720×1280 (9:16), H.264 com áudio AAC. Os títulos e resumos descrevem somente o conteúdo observado, sem criar transcrições.

- `hls-barras-transferencia.mp4`: 13,19 s; colaboradora apresenta barras de transferência e sua aplicação em pisos industriais. Poster extraído em 1,5 s.
- `hls-materiais-e-equipe.mp4`: 22,92 s; equipe, telas, rolos de aço e fachada. Poster extraído em 1,5 s.

Os arquivos já tinham resolução adequada. Foram reempacotados com `-c copy -movflags +faststart`, sem recorte, esticamento, alteração de velocidade ou recompressão. Os hashes das faixas codificadas de vídeo e áudio foram comparados aos originais e permaneceram idênticos. O áudio AAC e todas as legendas embutidas na imagem foram preservados. Posters WebP de 540×960 reservam a composição vertical antes de qualquer download do MP4.

Comandos aplicados para cada arquivo original:

```sh
ffmpeg -i original.mp4 -map 0:v:0 -map '0:a?' -c copy -movflags +faststart -map_metadata -1 public/videos/nome.mp4
ffmpeg -ss 1.5 -i original.mp4 -frames:v 1 -vf scale=540:-2 public/images/nome-poster.webp
```

`docs/video-assets.json` registra nomes originais, SHA-256, bytes e arquivos de destino. As tentativas iniciais de recompressão não trouxeram ganho suficiente; a entrega conserva as faixas originais e usa carregamento por clique para evitar transferências desnecessárias.

`Videos.tsx` mantém os players em 9:16 com object-fit contain, sem autoplay, preload none e sem src até a ação do visitante. Controles nativos e áudio ficam disponíveis após o clique. Iniciar um player pausa o outro; ocultar a aba pausa ambos. Erro de rede exibe uma mensagem e botão de nova tentativa. Há resumos textuais fiéis e legendas já presentes nos próprios vídeos; não foi criado arquivo de transcrição/legendas separado.

## Terceiro vídeo — carga em movimento

Arquivo fornecido posteriormente pelo usuário: `SaveClip.App_AQOejTOvMrNO0wgCxE8bs67yqsxBQibVNK5d4pvF1Hh7CGQkZrAXPcJzN2n3cXVxprZVwR_gb1TFvKuT-99WPJtj3Ihjo0gb1_9WQSw.mp4`. Inspeção visual ao longo do clipe: caminhão com marca HLS, carga de ferragens e texto embutido “Saindo mais uma CARGA”. Fonte 720×1280, H.264/AAC, cerca de 8,31 s e 1,2 MB. Não é um vídeo 4K e não foi apresentado como tal.

- `hls-carga-em-movimento.mp4`: remux faststart, com as faixas codificadas originais preservadas por hash. Terceiro player vertical com áudio por clique, controles e pausa mútua com os demais.
- `hls-carga-scroll.mp4`: derivação decorativa 540×960, sem áudio, H.264 CRF 24 e keyframes a cada 15 quadros, otimizada para seek em aparelhos móveis. É o mesmo enquadramento vertical, sem esticar nem recortar.
- `hls-carga-poster.webp`: frame do segundo 5, 720×1280.

A cena `ScrollStory` só carrega o vídeo ao se aproximar da tela; economia de dados exige ação. Com rolagem normal, o vídeo permanece pausado e seu currentTime segue o progresso da cena, avançando e retrocedendo. O botão pausa/retoma esse comportamento; há caminho para o player com áudio. Movimento reduzido mantém poster e conteúdo estático, sem uma seção longa ou sticky obrigatória. Nenhuma trilha sonora começa automaticamente.

## Três fotografias de alta resolução

Páginas Pexels e metadata inspecionados; licença https://www.pexels.com/license/. Fotos ilustrativas, sem atribuição às instalações/estoque da HLS. Autores, URLs e resolução estão em `photography-assets.json`.

- `steel-detail`: barras nervuradas ao sol, Pexels 35598610, Serhii Barkanov; fonte com largura 6000 px.
- `mesh-roll`: rolo de malha de aço, Pexels 36398139, Willians Huerta; fonte 5826×3884.
- `coils`: rolos de fio de aço, Pexels 36397790, Willians Huerta; fonte de largura 6000 px.

Entregues masters WebP de largura 3840 px, sem ampliação artificial, mais variantes 480/960/1920. O srcset/sizes considera o recorte visual de object-fit cover para evitar baixa resolução aparente; celulares recebem a variante adequada, não 4K obrigatoriamente. Novas fotos não se repetem nas 73 linhas do catálogo compacto.
