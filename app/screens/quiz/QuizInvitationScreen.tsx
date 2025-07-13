import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuiz } from '@/context/QuizContext';

interface QuizInvitationScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function QuizInvitationScreen({ onAccept, onDecline }: QuizInvitationScreenProps) {
  const { quizData } = useQuiz();

  if (!quizData) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-5">
        <Text className="text-red-500 text-lg text-center">No quiz data available</Text>
      </View>
    );
  }

  const reward = parseInt(quizData.reward) / 100; // Convert from cents to dollars

  return (
    <View className="flex-1 bg-black px-5 justify-between">
      {/* Header with X button */}
      {/*<View className="flex-row justify-end pt-12 pb-4">*/}
      {/*  <TouchableOpacity onPress={onDecline} className="p-2">*/}
      {/*    <XMarkIcon color="#FFFF00" size={24} />*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      {/* Main Content */}
      <View className="flex-1 justify-around items-center px-5">
        {/* Quiz Icon/Emoji */}
        <View className="mb-8">
          <Text className="text-6xl">🎯</Text>
        </View>

        {/* Title */}
        <Text className="text-yellow-400 text-2xl font-bold text-center mb-4">
          Quiz Invitation
        </Text>

        {/* Description */}
        <Text className="text-white text-lg text-center mb-8 leading-6">
          You have been selected for a quiz!
        </Text>

        {/* Reward Display */}
        <View className="bg-gray-900 rounded-2xl p-6 mb-12 items-center border border-yellow-400">
          <Text className="text-gray-300 text-sm mb-2">Reward</Text>
          <Text className="text-yellow-400 text-4xl font-bold mb-2">${reward}</Text>
          <Text className="text-gray-500 text-sm">AWS Voucher</Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4 gap-2">
          <TouchableOpacity
            className="bg-yellow-400 rounded-xl py-4 items-center justify-center"
            onPress={onAccept}
            activeOpacity={0.7}
          >
            <Text className="text-black text-lg font-bold">Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-2 border-yellow-400 rounded-xl py-4 items-center justify-center"
            onPress={onDecline}
            activeOpacity={0.7}
          >
            <Text className="text-yellow-400 text-lg font-bold">Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 