import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { VideoView } from 'expo-video';
import { useQuiz } from '@/context/QuizContext';
import useOptimizedVideoPlayer from '@/hooks/useOptimizedVideoPlayer';

interface MediaPlayerScreenProps {
  onCancel: () => void;
}

export default function MediaPlayerScreen({ onCancel }: MediaPlayerScreenProps) {
  const { quizData } = useQuiz();

  if (!quizData) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500 text-lg text-center">No quiz data available</Text>
      </View>
    );
  }

  // Debug: Log quiz data to see what we have
  console.log('Quiz data in MediaPlayerScreen:', quizData);

  // Determine if it's a video based on file extension or mime type
  const isVideo = quizData.url?.includes('.mp4') || 
                  quizData.url?.includes('.mov') || 
                  quizData.url?.includes('.avi') ||
                  quizData.url?.includes('.webm') ||
                  quizData.file_name?.includes('.mp4') ||
                  quizData.file_name?.includes('.mov') ||
                  quizData.file_name?.includes('.avi') ||
                  quizData.file_name?.includes('.webm');

  // Use the optimized video player hook only for videos
  const { player, isReady } = useOptimizedVideoPlayer({
    url: quizData.url,
    shouldPlay: isVideo,
    loop: false,
    muted: false,
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

      {/* Loading State for Video */}
      {isVideo && !isReady && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFF00" />
          <Text className="text-yellow-400 text-lg mt-4">Loading video...</Text>
        </View>
      )}

      {/* Video Player */}
      {isVideo && player && isReady && (
        <VideoView
          player={player}
          className="flex-1"
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

      {/* Fallback if no media */}
      {!quizData.url && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-lg text-center">No media URL available</Text>
        </View>
      )}
    </View>
  );
} 