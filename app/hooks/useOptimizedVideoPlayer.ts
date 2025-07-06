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
  onEnd,
}: UseOptimizedVideoPlayerOptions) => {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    
    // Set up timer-based completion detection using actual video duration
    if (onEnd && !loop) {
      const setupCompletionTimer = () => {
        // Check if player is still valid
        if (!playerRef.current) {
          return;
        }
        
        try {
          if (playerRef.current.duration) {
            const durationSeconds = playerRef.current.duration;
            
            completionTimerRef.current = setTimeout(() => {
              if (playerRef.current) {
                onEnd();
              }
            }, (durationSeconds + 0.5) * 1000); 
          } else {
            // If duration is not available yet, try again after a short delay
            setTimeout(setupCompletionTimer, 500);
          }
        } catch (error) {
          console.log('Error accessing player duration:', error);
        }
      };
      
      setTimeout(setupCompletionTimer, 1000);
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
      // Clean up completion timer first
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      }
      
      // Clean up player reference
      if (playerRef.current) {
        try {
          // Don't call methods on potentially released player
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

export default useOptimizedVideoPlayer;