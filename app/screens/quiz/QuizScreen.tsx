import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '@/context/QuizContext';
import CircularTimer from './CircularTimer';
import QuizQuestion from './QuizQuestion';
import QuizOptions from './QuizOptions';

interface QuizScreenProps {
  onComplete: (isCorrect: boolean) => void;
}

const ANIMATION_DURATION = 800;
const ANIMATION_DELAY = 400;
const QUIZ_DURATION = 30;
const RESULT_DELAY = 2000;
const QUIZ_TIMEOUT = 120000;

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const router = useRouter();
  const { quizData } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  const questionSlideAnim = useRef(new Animated.Value(0)).current;
  const timerSlideAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const correctAnswerIndex = useMemo(() => {
    const answerMap = { A: 0, B: 1, C: 2, D: 3 };
    return answerMap[quizData?.question?.answer as keyof typeof answerMap] ?? 0;
  }, [quizData?.question?.answer]);

  const options = useMemo(() => {
    if (!quizData?.question) return [];
    return [
      quizData.question.option_a,
      quizData.question.option_b,
      quizData.question.option_c,
      quizData.question.option_d,
    ];
  }, [quizData?.question]);

  const startAnimations = useCallback(() => {
    Animated.sequence([
      Animated.timing(questionSlideAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(ANIMATION_DELAY),
      Animated.timing(timerSlideAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionSlideAnim, timerSlideAnim]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      setIsTimeExpired(true);
      handleAnswerSelect(null, true);
    }
  }, [timeLeft, isAnswered]);

  useEffect(() => {
    if (!isAnswered) {
      timeoutRef.current = setTimeout(() => {
        if (!isAnswered) {
          setIsTimeExpired(true);
          handleAnswerSelect(null, true);
        }
      }, QUIZ_TIMEOUT);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [isAnswered]);

  const handleAnswerSelect = useCallback((answerIndex: number | null, isExpired: boolean = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const isCorrect = answerIndex === correctAnswerIndex;
    onComplete(isCorrect);

    console.log('params----', {
      isCorrect: isCorrect.toString(),
      selectedAnswer: answerIndex?.toString() || 'none',
      correctAnswer: correctAnswerIndex.toString(),
      isTimeExpired: isExpired.toString(),
    });

    resultTimeoutRef.current = setTimeout(() => {
      router.replace({
        pathname: '/(app)/quiz-result',
        params: {
          isCorrect: isCorrect.toString(),
          selectedAnswer: answerIndex?.toString() || 'none',
          correctAnswer: correctAnswerIndex.toString(),
          isTimeExpired: isExpired.toString(),
        },
      });
    }, RESULT_DELAY);
  }, [isAnswered, correctAnswerIndex, onComplete, router]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
        resultTimeoutRef.current = null;
      }
    };
  }, []);

  if (!quizData?.question?.question) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-lg text-center">No valid quiz question available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 bg-black px-6">
        <Animated.View
          className="flex-1 justify-center"
          style={{
            transform: [{
              translateY: questionSlideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            }],
            opacity: questionSlideAnim,
          }}
        >
          <QuizQuestion question={quizData.question.question} />
        </Animated.View>

        <Animated.View
          className="items-center mb-12"
          style={{
            transform: [{
              translateY: timerSlideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
            opacity: timerSlideAnim,
          }}
        >
          <CircularTimer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            totalTime={QUIZ_DURATION}
          />
        </Animated.View>

        <View className="mb-8">
          <QuizOptions
            options={options}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
            isAnswered={isAnswered}
            correctAnswer={correctAnswerIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
