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

      if (playerRef.current) {
        try {
          playerRef.current = null;
        } catch (error) {
        }
      }
    };
  }, []);

  return {
    player,
    isReady,
  };
}; 

export default useOptimizedVideoPlayer;