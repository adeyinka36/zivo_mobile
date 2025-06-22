import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { PlusCircleIcon, TrashIcon } from 'react-native-heroicons/solid';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  quizzes: Quiz[];
  onQuizzesChange: (quizzes: Quiz[]) => void;
  className?: string;
}

export default function QuizSection({ quizzes, onQuizzesChange, className = '' }: QuizSectionProps) {
  const addQuiz = () => {
    if (quizzes.length >= 5) return;
    
    onQuizzesChange([
      ...quizzes,
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuiz = (id: string) => {
    onQuizzesChange(quizzes.filter(quiz => quiz.id !== id));
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    onQuizzesChange(
      quizzes.map(quiz =>
        quiz.id === id ? { ...quiz, ...updates } : quiz
      )
    );
  };

  return (
    <View className={`${className} mt-4`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-yellow-400 text-lg font-bold">Quiz Questions</Text>
        {quizzes.length < 5 && (
          <TouchableOpacity
            onPress={addQuiz}
            className="flex-row items-center bg-yellow-400 px-4 py-2 rounded-lg"
          >
            <PlusCircleIcon color="#000000" size={20} />
            <Text className="text-black font-bold ml-2">Add Question</Text>
          </TouchableOpacity>
        )}
      </View>

      {quizzes.map((quiz, index) => (
        <View key={quiz.id} className="bg-gray-800 rounded-lg p-4 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-yellow-400 font-bold">Question {index + 1}</Text>
            <TouchableOpacity
              onPress={() => removeQuiz(quiz.id)}
              className="bg-red-500 p-2 rounded-full"
            >
              <TrashIcon color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={quiz.question}
            onChangeText={(text) => updateQuiz(quiz.id, { question: text })}
            placeholder="Enter your question"
            placeholderTextColor="#666666"
            className="text-white bg-gray-700 rounded-lg p-3 mb-4"
          />

          {quiz.options.map((option, optionIndex) => (
            <View key={optionIndex} className="mb-3">
              <View className="flex-row items-center mb-2">
                <Text className="text-yellow-400 mr-2">
                  {String.fromCharCode(65 + optionIndex)}.
                </Text>
                <TextInput
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...quiz.options];
                    newOptions[optionIndex] = text;
                    updateQuiz(quiz.id, { options: newOptions });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                  placeholderTextColor="#666666"
                  className="text-white bg-gray-700 rounded-lg p-3 flex-1"
                />
              </View>
            </View>
          ))}

          <View className="mt-4">
            <Text className="text-yellow-400 mb-2">Correct Answer:</Text>
            <View className="flex-row flex-wrap gap-2">
              {quiz.options.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => updateQuiz(quiz.id, { correctAnswer: index })}
                  className={`px-4 py-2 rounded-lg ${
                    quiz.correctAnswer === index
                      ? 'bg-yellow-400'
                      : 'bg-gray-700'
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      quiz.correctAnswer === index
                        ? 'text-black'
                        : 'text-white'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
} 