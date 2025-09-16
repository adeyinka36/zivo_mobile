import React, { useEffect, useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import { XMarkIcon, CheckCircleIcon } from 'react-native-heroicons/solid';
import { VideoView } from 'expo-video';
import useOptimizedVideoPlayer from '../hooks/useOptimizedVideoPlayer';
import { useEventListener } from 'expo';

interface FullScreenMediaProps {
  media: {
    url: string;
    media_type: 'image' | 'video';
    description?: string;
    has_watched?: boolean;
    uploader_id?: string;
    user_id?: string; // Assuming this is the ID of the user who uploaded the media
  };
  onClose: () => void;
  onWatchComplete: () => void;
}

export default function FullScreenMedia({ media, onClose, onWatchComplete }: FullScreenMediaProps) {
  const [showCompletion, setShowCompletion] = useState(media.has_watched || false);
  const fadeAnim = useRef(new Animated.Value(media.has_watched ? 1 : 0)).current;
  const [mediaEnded, setMediaEnded] = useState(false);

  const showCompletionAnimation = () => {
    setShowCompletion(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    onWatchComplete();
  };

  useEffect(() => {
    if (media.media_type !== 'video' && !media.has_watched) {
        showCompletionAnimation();
    }
  }, [media.media_type, media.has_watched]);

  const { player } = useOptimizedVideoPlayer({
    url: media.url,
    shouldPlay: media.media_type === 'video',
    loop: false,
    muted: false,
  });

  useEventListener(player, 'playToEnd', () => {
    setMediaEnded(true);
  });

  useEffect(() => {
    if (mediaEnded) {
      showCompletionAnimation();
    }
  }, [mediaEnded]);


  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {media.media_type === 'video' ? (
          <VideoView
            style={styles.media}
            player={player}
            contentFit="contain"
            nativeControls={true}
            allowsFullscreen={true}
            requiresLinearPlayback={true}
          />
        ) : (
          <Image
            source={{ uri: media.url }}
            style={styles.media}
            resizeMode="contain"
          />
        )}
      </View>


      {showCompletion && (
        <Animated.View style={[styles.completionContainer, { opacity: fadeAnim }]}>
          <View style={styles.completionContent}>
            <CheckCircleIcon color="#FFFF00" size={24} />
            <Text style={styles.completionText}>Watch Recorded!</Text>
          </View>
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <XMarkIcon color="#FFFFFF" size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  mediaContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1001,
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1001,
  },
  timerBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#FFFF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1001,
  },
  completionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completionText: {
    color: '#FFFF00',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 