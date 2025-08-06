import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularTimerProps {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  totalTime: number;
}

export default function CircularTimer({ timeLeft, setTimeLeft, totalTime }: CircularTimerProps) {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const radius = 30; // Reduced from 40
  const strokeWidth = 4; // Reduced from 6
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft]);

  useEffect(() => {
    const progress = timeLeft / totalTime;
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, totalTime, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View className="items-center">
      <View className="relative">
        <Svg width={80} height={80}>
          {/* Background circle */}
          <Circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#333333"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={40}
            cy={40}
            r={radius}
            stroke="#FFFF00"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
        </Svg>
        {/* Time text */}
        <View className="absolute inset-0 justify-center items-center">
          <Text className="text-yellow-400 text-xl font-bold">
            {timeLeft}s
          </Text>
        </View>
      </View>
    </View>
  );
}

// Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle); 