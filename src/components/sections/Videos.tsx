import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { hlsVideos, type HlsVideo } from "@/data/videos";

function VideoCard({
  video,
  register,
  onPlay,
}: {
  video: HlsVideo;
  register: (node: HTMLVideoElement | null) => void;
  onPlay: (node: HTMLVideoElement) => void;
}) {
  const player = useRef<HTMLVideoElement | null>(null);
  const [activated, setActivated] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = player.current;
    if (!activated || !node) return;
    node.play().catch(() => {
      // If the browser requires another gesture, native controls stay available.
    });
    return () => node.pause();
  }, [activated]);

  return (
    <article>
      <div className="vertical-player">
        <video
          ref={(node) => {
            player.current = node;
            register(node);
          }}
          src={activated ? video.src : undefined}
          poster={video.poster}
          controls={activated}
          playsInline
          preload="none"
          width="720"
          height="1280"
          aria-label={video.title}
          aria-describedby={`${video.id}-summary`}
          onPlay={(event) => onPlay(event.currentTarget)}
          onError={() => setFailed(true)}
        />
        {!activated && (
          <button
            className="video-start"
            aria-label={`Reproduzir ${video.title}`}
            onClick={() => setActivated(true)}
          >
            <Play />
          </button>
        )}
      </div>
      <h3>{video.title}</h3>
      <p id={`${video.id}-summary`}>{video.summary}</p>
      {failed && (
        <div className="video-error">
          <p role="status">Não foi possível carregar este vídeo.</p>
          <button
            className="text-link"
            onClick={() => {
              setFailed(false);
              player.current?.load();
              player.current?.play().catch(() => {});
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
    </article>
  );
}

export function Videos({ videos = hlsVideos }: { videos?: HlsVideo[] }) {
  const players = useRef(new Map<string, HTMLVideoElement>());
  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) players.current.forEach((player) => player.pause());
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      players.current.forEach((player) => player.pause());
    };
  }, []);
  if (!videos.length) return null;
  return (
    <section
      id="videos"
      className="hls-videos container"
      aria-labelledby="videos-title"
    >
      <p className="eyebrow">POR DENTRO DA HLS</p>
      <h2 id="videos-title">
        A HLS <em>na prática.</em>
      </h2>
      <div className="hls-video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            register={(node) => {
              if (node) players.current.set(video.id, node);
              else players.current.delete(video.id);
            }}
            onPlay={(active) =>
              players.current.forEach((player) => {
                if (player !== active) player.pause();
              })
            }
          />
        ))}
      </div>
    </section>
  );
}
