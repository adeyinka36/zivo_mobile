import React from 'react';
import { View, Text } from 'react-native';

interface QuizQuestionProps {
  question: string;
}

export default function QuizQuestion({ question }: QuizQuestionProps) {
  return (
    <View className="items-center">
      <Text className="text-yellow-400 text-xl font-bold text-center leading-8 mb-4">
        {question}
      </Text>
    </View>
  );
} 