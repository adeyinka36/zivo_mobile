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

  if (!quizData) {
    return null;
  }

  if (showNoQuizWinner) {
    return <NoQuizWinner />;
  }

  if (showMediaPlayer) {
    return <MediaPlayerScreen onCancel={endMediaStartQuiz} muted={false} />;
  }

  return (
    <QuizInvitationScreen 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
