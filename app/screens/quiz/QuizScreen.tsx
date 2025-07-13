import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useQuiz } from '@/context/QuizContext';
import CircularTimer from './CircularTimer';
import QuizQuestion from './QuizQuestion';
import QuizOptions from './QuizOptions';

interface QuizScreenProps {
  onComplete: (isCorrect: boolean) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const { quizData } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const questionSlideAnim = useRef(new Animated.Value(0)).current;
  const timerSlideAnim = useRef(new Animated.Value(0)).current;
  const optionsSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate question in first
    Animated.timing(questionSlideAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Show timer after question
      setTimeout(() => {
        setShowTimer(true);
        Animated.timing(timerSlideAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          // Show options after timer
          setTimeout(() => {
            setShowOptions(true);
            Animated.timing(optionsSlideAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }).start();
          }, 500);
        });
      }, 1000);
    });
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      handleAnswerSelect(null);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answerIndex: number | null) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(answerIndex);
    
    const correctAnswer = quizData?.question?.answer;
    const isCorrect = answerIndex === getCorrectAnswerIndex(correctAnswer);
    
    console.log('Quiz Answer:', {
      selected: answerIndex,
      correct: getCorrectAnswerIndex(correctAnswer),
      isCorrect,
      question: quizData?.question?.question
    });
    
    // Delay before calling onComplete to show the selection
    setTimeout(() => {
      onComplete(isCorrect);
    }, 1500);
  };

  const getCorrectAnswerIndex = (correctAnswer: string): number => {
    const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    return answerMap[correctAnswer as keyof typeof answerMap] ?? 0;
  };

  if (!quizData?.question) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500 text-lg text-center">No quiz question available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-6">
      {/* Question Section */}
      <Animated.View 
        className="flex-1 justify-center"
        style={{
          transform: [{
            translateY: questionSlideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })
          }],
          opacity: questionSlideAnim
        }}
      >
        <QuizQuestion question={quizData.question.question} />
      </Animated.View>

      {/* Timer Section */}
      {showTimer && (
        <Animated.View 
          className="items-center mb-8"
          style={{
            transform: [{
              translateY: timerSlideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              })
            }],
            opacity: timerSlideAnim
          }}
        >
          <CircularTimer 
            timeLeft={timeLeft} 
            setTimeLeft={setTimeLeft}
            totalTime={30}
          />
        </Animated.View>
      )}

      {/* Options Section */}
      {showOptions && (
        <Animated.View 
          className="mb-8"
          style={{
            transform: [{
              translateY: optionsSlideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            }],
            opacity: optionsSlideAnim
          }}
        >
          <QuizOptions
            options={[
              quizData.question.option_a,
              quizData.question.option_b,
              quizData.question.option_c,
              quizData.question.option_d
            ]}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
            isAnswered={isAnswered}
            correctAnswer={getCorrectAnswerIndex(quizData.question.answer)}
          />
        </Animated.View>
      )}
    </View>
  );
} 