import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuiz } from '@/context/QuizContext';
import CircularTimer from './CircularTimer';
import QuizQuestion from './QuizQuestion';
import QuizOptions from './QuizOptions';

interface QuizScreenProps {
  onComplete: (isCorrect: boolean) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const router = useRouter();
  const { quizData } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  const questionSlideAnim = useRef(new Animated.Value(0)).current;
  const timerSlideAnim = useRef(new Animated.Value(0)).current;
  const optionsSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!quizData || !quizData.question) {
      console.error('QuizScreen: Invalid quiz data', quizData);
      return;
    }

    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      answer,
    } = quizData.question;

    if (!question || !option_a || !option_b || !option_c || !option_d || !answer) {
      console.error('QuizScreen: Missing essential question fields', quizData.question);
    }
  }, [quizData]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(questionSlideAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(400),
      Animated.timing(timerSlideAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(300),
      Animated.timing(optionsSlideAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      setIsTimeExpired(true);
      handleAnswerSelect(null, true);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answerIndex: number | null, isExpired: boolean = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    const correctAnswer = quizData?.question?.answer;
    const isCorrect = answerIndex === getCorrectAnswerIndex(correctAnswer);

    console.log('Quiz Answer:', {
      selected: answerIndex,
      correct: getCorrectAnswerIndex(correctAnswer),
      isCorrect,
      isTimeExpired: isExpired,
      question: quizData?.question?.question,
      selectedOption: answerIndex !== null ? getOptionText(answerIndex) : 'No answer',
      correctOption: getOptionText(getCorrectAnswerIndex(correctAnswer)),
    });

    setTimeout(() => {
      router.push({
        pathname: '/(app)/quiz-result',
        params: {
          isCorrect: isCorrect.toString(),
          selectedAnswer: answerIndex?.toString() || 'none',
          correctAnswer: getCorrectAnswerIndex(correctAnswer).toString(),
          isTimeExpired: isExpired.toString(),
        },
      });
    }, 2000);
  };

  const getCorrectAnswerIndex = (correctAnswer: string): number => {
    const answerMap = { A: 0, B: 1, C: 2, D: 3 };
    return answerMap[correctAnswer as keyof typeof answerMap] ?? 0;
  };

  const getOptionText = (index: number): string => {
    if (!quizData?.question) return '';
    const options = [
      quizData.question.option_a,
      quizData.question.option_b,
      quizData.question.option_c,
      quizData.question.option_d,
    ];
    return options[index] || '';
  };

  if (!quizData?.question?.question) {
    return (
        <View className="flex-1 bg-black justify-center items-center">
          <Text className="text-red-500 text-lg text-center">No valid quiz question available</Text>
        </View>
    );
  }

  return (
      <View className="flex-1 bg-black px-6">
        {/* Question */}
        <Animated.View
            className="flex-1 justify-center"
            style={{
              transform: [
                {
                  translateY: questionSlideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
              opacity: questionSlideAnim,
            }}
        >
          <QuizQuestion question={quizData.question.question} />
        </Animated.View>

        {/* Timer */}
        <Animated.View
            className="items-center mb-12"
            style={{
              transform: [
                {
                  translateY: timerSlideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              opacity: timerSlideAnim,
            }}
        >
          <CircularTimer
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              totalTime={30}
          />
        </Animated.View>

        {/* Options */}
        <Animated.View
            className="mb-8"
            style={{
              transform: [
                {
                  translateY: optionsSlideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
              opacity: optionsSlideAnim,
            }}
        >
          <QuizOptions
              options={[
                quizData.question.option_a,
                quizData.question.option_b,
                quizData.question.option_c,
                quizData.question.option_d,
              ]}
              selectedAnswer={selectedAnswer}
              onSelect={handleAnswerSelect}
              isAnswered={isAnswered}
              correctAnswer={getCorrectAnswerIndex(quizData.question.answer)}
          />
        </Animated.View>
      </View>
  );
}
