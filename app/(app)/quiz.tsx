import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useQuiz } from '@/context/QuizContext';
import { api } from '@/context/auth';
import QuizScreen from '@/screens/quiz/QuizScreen';
import { useAudioPlayer }  from "expo-audio";

const answerCorrectSound = require('@/assets/quiz-correct.mp3');
const answerWrongSound = require('@/assets/quiz-wrong.mp3');


export default function QuizRoute() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // If no quiz data, redirect to home
  useEffect(() => {
    if (!quizData) {
      router.replace('/(app)/explore');
    }
  }, [quizData, router]);

  const handleQuizComplete = async (correct: boolean) => {
    setIsCorrect(correct);
    setShowResult(true);
    
    const soundPlayer = useAudioPlayer(correct ? answerCorrectSound : answerWrongSound);
    soundPlayer.play();
    try {
      if (quizData?.question?.id) {
        await api.post('/quiz/result', {
          is_correct: correct,
          media_id: quizData.id,
        });
      }
    } catch (error: any) {
      console.error('Failed to send quiz result:', error);
    }
    
    setTimeout(() => {
      router.replace({
        pathname: '/(app)/quiz-result',
        params: { isCorrect: correct.toString() }
      });
    }, 2000);
  };

  if (!quizData) {
    return null;
  }

  return (
    <QuizScreen onComplete={handleQuizComplete} />
  );
}
