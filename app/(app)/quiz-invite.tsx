import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useQuiz } from '@/context/QuizContext';
import QuizInvitationScreen from '@/screens/quiz/QuizInvitationScreen';
import NoQuizWinner from '@/screens/quiz/NoQuizWinner';
import { useAudioPlayer }  from "expo-audio";

const quizNotificationSound = require('@/assets/quiz-notification.mp3');

export default function QuizInviteScreen() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [showNoQuizWinner, setShowNoQuizWinner] = useState(false);
  const soundPlayer = useAudioPlayer(quizNotificationSound);

  useEffect(() => {
    soundPlayer.play();
  }, []);

  useEffect(() => {
    if (!quizData) {
      router.replace('/(app)/explore');
    }
  }, [quizData, router]);

  const handleAccept = () => {
    if (quizData?.question) {
      router.replace('/(app)/quiz');
    } else {
      setShowNoQuizWinner(true);
    }
  };

  const handleDecline = () => {
    clearQuiz();
    router.replace('/(app)/explore');
  };

  if (!quizData) {
    return null;
  }

  if (showNoQuizWinner) {
    return <NoQuizWinner />;
  }

  return (
    <QuizInvitationScreen 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
