import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface QuizOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  onSelect: (index: number | null) => void;
  isAnswered: boolean;
  correctAnswer: number;
}

export default function QuizOptions({ 
  options, 
  selectedAnswer, 
  onSelect, 
  isAnswered, 
  correctAnswer 
}: QuizOptionsProps) {
  const slideAnims = useRef(options.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate options in with staggered timing and alternating directions
    const animations = options.map((_, index) => {
      const isFromRight = index % 2 === 1; // Odd indices slide from right
      const delay = index * 150; // Reduced stagger to 150ms for smoother flow
      
      return Animated.timing(slideAnims[index], {
        toValue: 1,
        duration: 700,
        delay,
        useNativeDriver: true,
      });
    });

    // Start all animations
    Animated.parallel(animations).start();
  }, []);

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index 
        ? "bg-yellow-400 border-yellow-400" 
        : "bg-transparent border-gray-600";
    }
    
    // After answering, show correct/incorrect states
    if (index === correctAnswer) {
      return "bg-green-500 border-green-500"; // Correct answer
    }
    
    if (selectedAnswer === index && index !== correctAnswer) {
      return "bg-red-500 border-red-500"; // Wrong selected answer
    }
    
    return "bg-transparent border-gray-600"; // Unselected options
  };

  const getTextStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index ? "text-black" : "text-white";
    }
    
    if (index === correctAnswer) {
      return "text-white"; // Correct answer
    }
    
    if (selectedAnswer === index && index !== correctAnswer) {
      return "text-white"; // Wrong selected answer
    }
    
    return "text-gray-400"; // Unselected options
  };

  const getOptionLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D'];
    return labels[index];
  };

  return (
    <View className="space-y-6">
      {options.map((option, index) => {
        const isFromRight = index % 2 === 1;
        
        return (
          <Animated.View
            key={index}
            style={{
              transform: [{
                translateX: slideAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [isFromRight ? 80 : -80, 0],
                })
              }],
              opacity: slideAnims[index]
            }}
          >
            <TouchableOpacity
              className={`border-2 rounded-xl p-2 mb-1 flex-row items-center ${getOptionStyle(index)}`}
              style={{ height: 80 }}
              onPress={() => !isAnswered && onSelect(index)}
              activeOpacity={isAnswered ? 1 : 0.7}
              disabled={isAnswered}
            >
              {/* Option Label */}
              <View className="w-10 h-10 rounded-full border-2 border-current items-center justify-center mr-4">
                <Text className={`font-bold ${getTextStyle(index)}`}>
                  {getOptionLabel(index)}
                </Text>
              </View>
              
              {/* Option Text */}
              <Text className={`flex-1 text-lg ${getTextStyle(index)}`} numberOfLines={2}>
                {option}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
} 