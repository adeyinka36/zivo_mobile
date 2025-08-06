import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { XMarkIcon, CheckCircleIcon } from 'react-native-heroicons/solid';
import { useQuiz } from '@/context/QuizContext';

interface CorrectAnswerScreenProps {
  selectedAnswer: number;
  correctAnswer: number;
}

export default function CorrectAnswerScreen({ selectedAnswer, correctAnswer }: CorrectAnswerScreenProps) {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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
  }, []);

  const handleGoHome = () => {
    clearQuiz();
    router.replace('/(app)/home');
  };

  const getAnswerDetails = () => {
    const options = ['A', 'B', 'C', 'D'];
    const selected = options[selectedAnswer] || 'None';
    const correct = options[correctAnswer] || 'Unknown';
    
    return `Correct answer: ${correct}`;
  };

  return (
    <View className="flex-1 bg-black px-6">
      {/* Header with X button */}
      <View className="flex-row justify-end pt-12 pb-4">
        <TouchableOpacity onPress={handleGoHome} className="p-2">
          <XMarkIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <Animated.View 
        className="flex-1 justify-center items-center"
        style={{
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim
          }]
        }}
      >
        {/* Success Icon */}
        <View className="mb-8">
          <CheckCircleIcon color="#00FF00" size={80} />
        </View>

        {/* Success Title */}
        <Text className="text-green-400 text-3xl font-bold text-center mb-4">
          Congratulations!
        </Text>

        {/* Success Message */}
        <Text className="text-white text-lg text-center mb-8 leading-6 px-4">
          You answered correctly! Your knowledge is impressive.
        </Text>

        {/* Reward Information */}
        {quizData?.reward && (
          <View className="bg-gray-900 rounded-2xl p-6 mb-8 items-center border border-yellow-400">
            <Text className="text-yellow-400 text-lg text-center">
              You earned ${parseInt(quizData.reward.toString()) / 100} in AWS voucher!
            </Text>
          </View>
        )}

        {/* Answer Details */}
        <View className="bg-gray-800 rounded-xl p-4 mb-8">
          <Text className="text-gray-300 text-center">
            {getAnswerDetails()}
          </Text>
        </View>

        {/* Action Button */}
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