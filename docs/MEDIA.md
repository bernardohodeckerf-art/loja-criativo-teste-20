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
