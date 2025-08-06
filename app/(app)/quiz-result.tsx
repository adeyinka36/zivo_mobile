import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CorrectAnswerScreen from '@/screens/quiz/CorrectAnswerScreen';
import IncorrectAnswerScreen from '@/screens/quiz/IncorrectAnswerScreen';

export default function QuizResultScreen() {
  const params = useLocalSearchParams();

  const isCorrect = params.isCorrect === 'true';
  const selectedAnswer = parseInt(params.selectedAnswer as string) || -1;
  const correctAnswer = parseInt(params.correctAnswer as string) || 0;
  const isTimeExpired = params.isTimeExpired === 'true';

  // Render the appropriate screen based on the result
  if (isCorrect) {
    return (
      <CorrectAnswerScreen 
        selectedAnswer={selectedAnswer}
        correctAnswer={correctAnswer}
      />
    );
  }

  return (
    <IncorrectAnswerScreen 
      selectedAnswer={selectedAnswer}
      correctAnswer={correctAnswer}
    />
  );
}
