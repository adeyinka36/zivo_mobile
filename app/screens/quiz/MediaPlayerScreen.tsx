import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { VideoView } from 'expo-video';
import { useQuiz } from '@/context/QuizContext';
import useOptimizedVideoPlayer from '@/hooks/useOptimizedVideoPlayer';

interface MediaPlayerScreenProps {
  onCancel: () => void;
  muted?: boolean
}

export default function MediaPlayerScreen({ onCancel, muted }: MediaPlayerScreenProps) {
  const { quizData } = useQuiz();

  if (!quizData) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500 text-lg text-center">No quiz data available</Text>
      </View>
    );
  }

  if (!quizData.url) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500 text-lg text-center">No media URL available</Text>
      </View>
    );
  }

  // Determine if it's a video based on media_type from backend
  const isVideo = quizData.media_type === 'video';

  // Use the exact same configuration as explore screen
  const { player } = useOptimizedVideoPlayer({
    url: quizData.url,
    shouldPlay: true,
    loop: true,
    muted: muted ? muted : false,
  });

  return (
    <View className="flex-1 bg-black">
      {/* Header with X button */}
      <View className="absolute top-12 right-4 z-10">
        <TouchableOpacity 
          onPress={onCancel} 
          className="bg-black bg-opacity-50 rounded-full p-3"
          activeOpacity={0.7}
        >
          <XMarkIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
      </View>

      {/* Video Player */}
      {isVideo && player && (
        <VideoView
          style={{ width: '100%', height: '100%' }}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {/* Image Display */}
      {!isVideo && quizData.url && (
        <Image
          source={{ uri: quizData.url }}
          className="flex-1"
          resizeMode="contain"
        />
      )}
    </View>
  );
} 