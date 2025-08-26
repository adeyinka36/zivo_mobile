import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useQuiz } from '@/context/QuizContext';
import QuizInvitationScreen from '@/screens/quiz/QuizInvitationScreen';
import MediaPlayerScreen from '@/screens/quiz/MediaPlayerScreen';
import NoQuizWinner from '@/screens/quiz/NoQuizWinner';

export default function QuizInviteScreen() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [showNoQuizWinner, setShowNoQuizWinner] = useState(false);

  // If no quiz data, redirect to home
  useEffect(() => {
    if (!quizData) {
      router.replace('/(app)/home');
    }
  }, [quizData, router]);

  const handleAccept = () => {
    setShowMediaPlayer(true);
  };

  const handleDecline = () => {
    clearQuiz();
    router.replace('/(app)/home');
  };

  const endMediaStartQuiz = () => {
    if(quizData?.question) {
      router.replace('/(app)/quiz');
    } else {
      setShowNoQuizWinner(true);
    }
  };

  // Show loading while checking quiz data
  if (!quizData) {
    return null;
  }

  if (showNoQuizWinner) {
    return <NoQuizWinner />;
  }

  // Show media player if user accepted
  if (showMediaPlayer) {
    return <MediaPlayerScreen onCancel={endMediaStartQuiz} muted={false} />;
  }

  // Show invitation screen (always show this first)
  return (
    <QuizInvitationScreen 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
