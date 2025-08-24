import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { XMarkIcon, CheckCircleIcon } from 'react-native-heroicons/solid';
import { VideoView } from 'expo-video';
import useOptimizedVideoPlayer from '../hooks/useOptimizedVideoPlayer';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/context/auth';

const { width, height } = Dimensions.get('window');

interface VideoViewParams {
  mediaId: string;
  mediaUrl: string;
  mediaType: string;
  hasWatched: string;
  description: string;
  reward: string;
  uploaderUsername: string;
}

export default function VideoViewScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<VideoViewParams>();
  
  const [showCompletion, setShowCompletion] = useState(params.hasWatched === 'true');
  const [timeLeft, setTimeLeft] = useState(10);
  const fadeAnim = useRef(new Animated.Value(params.hasWatched === 'true' ? 1 : 0)).current;
  const timerRef = useRef<number | null>(null);

  const showCompletionAnimation = () => {
    setShowCompletion(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    handleWatchComplete();
  };

  const handleWatchComplete = async () => {
    if (!user || params.hasWatched === 'true') return;
    
    try {
      await api.post(`/media-watched/${params.mediaId}/${user.id}`);
    } catch (error) {
      console.error('Failed to record watch status:', error);
    }
  };

  const { player } = useOptimizedVideoPlayer({
    url: params.mediaUrl,
    shouldPlay: params.mediaType === 'video',
    loop: false,
    muted: false,
    onEnd: params.mediaType === 'video' ? showCompletionAnimation : undefined,
  });

  useEffect(() => {
    if (params.mediaType !== 'video' && params.hasWatched !== 'true') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            showCompletionAnimation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [params.mediaType, params.hasWatched]);

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {params.mediaType === 'video' ? (
          <VideoView
            style={styles.media}
            player={player}
            contentFit="contain"
            nativeControls={true}
            allowsFullscreen={true}
          />
        ) : (
          <View style={styles.imageContainer}>
            <Text style={styles.placeholderText}>Image Content</Text>
          </View>
        )}
      </View>

      {params.mediaType !== 'video' && !showCompletion && params.hasWatched !== 'true' && (
        <View style={styles.timerContainer}>
          <View style={styles.timerBackground}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>
      )}

      {showCompletion && (
        <Animated.View style={[styles.completionContainer, { opacity: fadeAnim }]}>
          <View style={styles.completionContent}>
            <CheckCircleIcon color="#FFFF00" size={24} />
            <Text style={styles.completionText}>Watch Recorded!</Text>
          </View>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <XMarkIcon color="#FFFF00" size={24} />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.description}>{params.description}</Text>
        <Text style={styles.uploader}>Uploader: {params.uploaderUsername}</Text>
        <Text style={styles.reward}>Reward: {params.reward} Zivos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaContainer: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#FFFF00',
    fontSize: 18,
  },
  timerContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 10,
  },
  timerBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    color: '#FFFF00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completionContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  completionContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionText: {
    color: '#FFFF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 8,
  },
  description: {
    color: '#FFFF00',
    fontSize: 16,
    marginBottom: 8,
  },
  uploader: {
    color: '#FFFF00',
    fontSize: 14,
    marginBottom: 4,
  },
  reward: {
    color: '#FFFF00',
    fontSize: 14,
  },
});
