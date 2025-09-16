import React from 'react';
import { Image } from 'react-native';
import VideoPlayer from './VideoPlayer';

interface MediaPlayerProps {
  media: {
    media_type: string;
    thumbnail: string | null;
    url: string;
  };
  index: number;
  visibleIndex: number;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ media, index, visibleIndex }) => {
  if (media.media_type === 'video') {
    return <VideoPlayer media={media} index={index} visibleIndex={visibleIndex} />;
  }
  
  return (
    <Image
      source={{ uri: media.thumbnail || media.url }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  );
};

export default MediaPlayer;
