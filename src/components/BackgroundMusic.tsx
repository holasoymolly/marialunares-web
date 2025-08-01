import { useState, useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  soundcloudUrl: string;
}

export default function BackgroundMusic({ soundcloudUrl }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);



  useEffect(() => {
    // Auto-play when component mounts
    setIsPlaying(true);
  }, []);







  // URL del álbum "De Noche" con autoplay
  const albumUrl = "https://api.soundcloud.com/playlists/1922801791";

  return (
    <div className="fixed bottom-32 right-8 z-30">
      {/* SoundCloud Embed - Álbum "De Noche" */}
      <iframe
        ref={iframeRef}
        width="300"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(albumUrl)}&color=%23ff5500&auto_play=${isPlaying}&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
        style={{
          borderRadius: '8px',
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
} 