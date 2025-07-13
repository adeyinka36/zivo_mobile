import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useQuiz } from '@/context/QuizContext';
import QuizInvitationScreen from '@/screens/quiz/QuizInvitationScreen';
import MediaPlayerScreen from '@/screens/quiz/MediaPlayerScreen';

export default function QuizInviteScreen() {
  const router = useRouter();
  const { quizData, clearQuiz } = useQuiz();
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);

  // If no quiz data, redirect to home
  useEffect(() => {
    if (!quizData) {
      router.replace('/(app)/home');
    }
  }, [quizData, router]);

  const handleAccept = () => {
    console.log('Player accepted quiz:', quizData);
    setShowMediaPlayer(true);
  };

  const handleDecline = () => {
    console.log('Player declined quiz:', quizData);
    clearQuiz();
    router.replace('/(app)/home');
  };

  const endMediaStartQuiz = () => {
    console.log('Player started quiz----->', quizData);
    router.replace('/(app)/quiz');
  };

  // Show loading while checking quiz data
  if (!quizData) {
    return null;
  }

  // Show media player if user accepted
  if (showMediaPlayer) {
    return <MediaPlayerScreen onCancel={endMediaStartQuiz} />;
  }

  // Show invitation screen
  return (
    <QuizInvitationScreen 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
