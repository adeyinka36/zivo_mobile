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

  console.log('params from results screen----', {
    isCorrect: isCorrect.toString(),
    selectedAnswer: selectedAnswer.toString(),
    correctAnswer: correctAnswer.toString(),
    isTimeExpired: isTimeExpired.toString(),
  },)

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
