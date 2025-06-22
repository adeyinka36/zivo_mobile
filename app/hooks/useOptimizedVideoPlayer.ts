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

export const useOptimizedVideoPlayer = ({
  url,
  shouldPlay,
  loop = false,
  muted = true,
  onReady,
  onEnd,
}: UseOptimizedVideoPlayerOptions) => {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const checkIntervalRef = useRef<number | null>(null);

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
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
    
    // Set up end detection if onEnd callback is provided
    if (onEnd && !loop) {
      checkIntervalRef.current = setInterval(() => {
        if (player) {
          const { currentTime, duration } = player;
          if (duration > 0 && currentTime >= duration - 0.1) {
            clearInterval(checkIntervalRef.current!);
            onEnd();
          }
        }
      }, 1000);
    }
  });

  // Handle shouldPlay changes
  useEffect(() => {
    if (playerRef.current && isReady) {
      if (shouldPlay && !isPlaying) {
        playerRef.current.play();
        setIsPlaying(true);
      } else if (!shouldPlay && isPlaying) {
        playerRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [shouldPlay, isReady, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
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
    isPlaying,
    play: () => {
      if (playerRef.current && isReady) {
        playerRef.current.play();
        setIsPlaying(true);
      }
    },
    pause: () => {
      if (playerRef.current && isReady) {
        playerRef.current.pause();
        setIsPlaying(false);
      }
    },
  };
}; 