import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { XMarkIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { useQuiz } from '@/context/QuizContext';

interface IncorrectAnswerScreenProps {
  selectedAnswer: number;
  correctAnswer: number;
}

export default function IncorrectAnswerScreen({ selectedAnswer, correctAnswer }: IncorrectAnswerScreenProps) {
  const router = useRouter();
  const { clearQuiz } = useQuiz();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const isNavigating = useRef(false);

  const isTimeExpired = params.isTimeExpired === 'true';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleGoHome = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    clearQuiz();
    router.replace('/(app)/home');
  }, [clearQuiz, router]);

  const getAnswerDetails = useCallback(() => {
    if (isTimeExpired) {
      return 'You ran out of time!';
    }
    
    const options = ['A', 'B', 'C', 'D'];
    const correct = options[correctAnswer] || 'Unknown';
    return `Correct answer: ${correct}`;
  }, [isTimeExpired, correctAnswer]);

  const getFailureMessage = useCallback(() => {
    return isTimeExpired
      ? 'You ran out of time! Try to answer faster next time.'
      : 'You selected the wrong answer. Keep learning and try again!';
  }, [isTimeExpired]);

  return (
    <View className="flex-1 bg-black px-6">
      <View className="flex-row justify-end pt-12 pb-4">
        <TouchableOpacity onPress={handleGoHome} className="p-2">
          <XMarkIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
      </View>

      <Animated.View 
        className="flex-1 justify-center items-center"
        style={{
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim
          }]
        }}
      >
        <View className="mb-8">
          <XCircleIcon color="#FF0000" size={80} />
        </View>

        <Text className="text-red-400 text-3xl font-bold text-center mb-4">
          Better Luck Next Time
        </Text>

        <Text className="text-primary text-lg text-center mb-8 leading-6 px-4">
          {getFailureMessage()}
        </Text>

        <View className="bg-gray-800 rounded-xl p-4 mb-8">
          <Text className="text-gray-300 text-center">
            {getAnswerDetails()}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-yellow-400 rounded-xl py-4 px-8 items-center justify-center"
          onPress={handleGoHome}
          activeOpacity={0.7}
        >
          <Text className="text-black text-lg font-bold">
            Go Home
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
} 