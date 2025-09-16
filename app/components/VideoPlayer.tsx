import React, { useMemo } from 'react';
import { Image } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

interface VideoPlayerProps {
  media: {
    media_type: string;
    thumbnail: string | null;
    url: string;
  };
  index: number;
  visibleIndex: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ media, index, visibleIndex }) => {
  const isVisible = visibleIndex === index;
  const isVideo = media.media_type === 'video';

  // Create player but only use it when visible
  const player = useVideoPlayer(media.url, (player) => {
    player.loop = true;
    player.muted = true;
    
    // Only play if this video is currently visible
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  });

  // Update player state when visibility changes
  React.useEffect(() => {
    if (player && isVideo) {
      if (isVisible) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isVisible, player, isVideo, index]);

  if (!isVideo) {
    return (
      <Image
        source={{ uri: media.thumbnail || media.url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    );
  }

  if (!isVisible) {
    return (
      <Image
        source={{ uri: media.thumbnail || media.url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    );
  }

  // Add player validation to prevent the error
  if (!player) {
    return (
      <Image
        source={{ uri: media.thumbnail || media.url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    );
  }

  try {
    return (
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />
    );
  } catch (error) {
    console.warn('VideoView error, falling back to image:', error);
    return (
      <Image
        source={{ uri: media.thumbnail || media.url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    );
  }
};

export default VideoPlayer;
