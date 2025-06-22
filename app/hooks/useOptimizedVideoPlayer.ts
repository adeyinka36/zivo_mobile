import { useRef, useEffect, useState } from 'react';
import { useVideoPlayer } from 'expo-video';

interface UseOptimizedVideoPlayerOptions {
  url: string;
  shouldPlay: boolean;
  loop?: boolean;
  muted?: boolean;
  onReady?: () => void;
}

export const useOptimizedVideoPlayer = ({
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
    
    // Configure player
    player.loop = loop;
    player.muted = muted;
    
    // Set ready state
    setIsReady(true);
    onReady?.();
    
    // Handle play/pause based on shouldPlay
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  });

  // Handle shouldPlay changes
  useEffect(() => {
    if (playerRef.current && isReady) {
      if (shouldPlay) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [shouldPlay, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.unload?.();
          playerRef.current = null;
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return {
    player,
    isReady,
  };
}; 