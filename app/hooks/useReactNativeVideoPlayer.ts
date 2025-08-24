import { useRef, useEffect } from 'react';
import Video, { VideoRef } from 'react-native-video';

interface UseReactNativeVideoPlayerOptions {
  url: string;
  shouldPlay: boolean;
  loop?: boolean;
  muted?: boolean;
  onReady?: () => void;
  onEnd?: () => void;
}

const useReactNativeVideoPlayer = ({
  url,
  shouldPlay,
  loop = false,
  muted = true,
  onReady,
  onEnd,
}: UseReactNativeVideoPlayerOptions) => {
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    if (videoRef.current && shouldPlay) {
      videoRef.current.seek(0);
    }
  }, [shouldPlay]);

  const handleLoad = () => {
    onReady?.();
  };

  const handleEnd = () => {
    onEnd?.();
  };

  return {
    videoRef,
    handleLoad,
    handleEnd,
  };
};

export default useReactNativeVideoPlayer;
