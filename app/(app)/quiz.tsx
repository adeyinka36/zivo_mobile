import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useQuiz } from '@/context/QuizContext';
import QuizScreen from '@/screens/quiz/QuizScreen';

export default function QuizRoute() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // If no quiz data, redirect to home
  useEffect(() => {
    if (!quizData) {
      router.replace('/(app)/home');
    }
  }, [quizData, router]);

  const handleQuizComplete = (correct: boolean) => {
    setIsCorrect(correct);
    setShowResult(true);
    
    // Log the result
    console.log('Quiz completed:', {
      isCorrect: correct,
      quizData: quizData
    });
    
    // Navigate to result after a delay
    setTimeout(() => {
      router.push({
        pathname: '/(app)/quiz-result',
        params: { isCorrect: correct.toString() }
      });
    }, 2000);
  };

  // Show loading while checking quiz data
  if (!quizData) {
    return null;
  }

  return (
    <QuizScreen onComplete={handleQuizComplete} />
  );
}
