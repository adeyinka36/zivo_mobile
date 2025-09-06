import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { api } from '@/context/auth';
import { useQuiz } from '@/context/QuizContext';
import { useAudioPlayer }  from "expo-audio";

const quizWonSound = require('@/assets/quiz-won.mp3');

export default function NoQuizWinner() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const rewardInDollars = (Number(quizData?.reward) / 100).toFixed(2);
  const soundPlayer = useAudioPlayer(quizWonSound);

  useEffect(() => {
    soundPlayer.play();
  }, [soundPlayer]);

  const handleContinue = () => {
    clearQuiz();
    router.replace('/(app)/explore');
  };

  useEffect(() => {
    try {
        if (quizData?.id) {
          api.post('/quiz/result', {
            is_correct: true,
            media_id: quizData.id,
          });
        }
      } catch (error: any) {
        console.error('Failed to send quiz result:', error);
      }

      return () => {
        clearQuiz();
        router.replace('/(app)/explore');
      }
}, [quizData]);

  return (
    <View className="flex-1 bg-black items-center justify-center px-6">
      <View className="items-center">
        {/* Success Icon */}
        <View className="mb-6">
          <CheckCircleIcon color="#FFFF00" size={wp('15%')} />
        </View>

        {/* Title */}
        <Text className="text-primary font-bold text-center mb-4" style={{ fontSize: wp('6%') }}>
          No Quiz Available
        </Text>

        {/* Message */}
        <Text className="text-white text-center mb-8 leading-6" style={{ fontSize: wp('4%') }}>
          You've earned the reward directly!{'\n'}No quiz was required for this content.
        </Text>

        {/* Reward Display */}
        <View className="bg-primary/20 border border-primary/50 rounded-xl p-6 mb-8">
          <Text className="text-primary font-bold text-center mb-2" style={{ fontSize: wp('5%') }}>
            Reward Earned
          </Text>
          <Text className="text-primary font-bold text-center" style={{ fontSize: wp('8%') }}>
            ${rewardInDollars}
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-primary rounded-lg px-8 py-4"
          activeOpacity={0.7}
        >
          <Text className="text-background font-bold text-center" style={{ fontSize: wp('4.5%') }}>
            Continue Exploring
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
