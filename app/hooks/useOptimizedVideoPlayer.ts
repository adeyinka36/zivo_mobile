import { useRef, useEffect, useState } from 'react';
import { useVideoPlayer } from 'expo-video';

interface UseOptimizedVideoPlayerOptions {
  url: string;
  shouldPlay: boolean;
  loop?: boolean;
  muted?: boolean;
  onReady?: () => void;
  onEnd?: () => void;
}

const  useOptimizedVideoPlayer = ({
  url,
  shouldPlay,
  loop = false,
  muted = true,
  onReady,
}: UseOptimizedVideoPlayerOptions) => {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  const player = useVideoPlayer(url, (player) => {
    playerRef.current = player;

    player.loop = loop;
    player.muted = muted;

    setIsReady(true);
    onReady?.();

    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  });

  useEffect(() => {
    if (playerRef.current && isReady) {
      if (shouldPlay) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [shouldPlay, isReady]);

  useEffect(() => {
    return () => {
      // Clean up player when component unmounts or URL changes
      if (playerRef.current) {
        try {
          // Properly release the player
          if (typeof playerRef.current.release === 'function') {
            playerRef.current.release();
          }
          playerRef.current = null;
        } catch (error) {
          console.warn('Error releasing video player:', error);
        }
      }
    };
  }, [url]); // Add url dependency to clean up when URL changes

  return {
    player,
    isReady,
  };
}; 

export default useOptimizedVideoPlayer;