import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { PlusIcon, MinusIcon } from 'react-native-heroicons/solid';

interface RewardInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function RewardInput({ value, onChange, className = '' }: RewardInputProps) {
  const PLATFORM_FEE_PERCENTAGE = 10;
  const INCREMENT_AMOUNT = 50; // 50 cents
  const MINIMUM_REWARD = 500; // $5.00 minimum

  const handleChange = (text: string) => {
    const newValue = parseInt(text) || 0;
    if (newValue >= MINIMUM_REWARD) {
      onChange(newValue);
    }
  };

  const incrementReward = () => {
    onChange(value + INCREMENT_AMOUNT);
  };

  const decrementReward = () => {
    const newValue = value - INCREMENT_AMOUNT;
    if (newValue >= MINIMUM_REWARD) {
      onChange(newValue);
    }
  };

  const platformFee = Math.ceil(value * (PLATFORM_FEE_PERCENTAGE / 100));
  const totalAmount = value + platformFee;

  return (
    <View className={`${className}`}>
      <Text className="text-yellow-400 text-lg font-bold mb-4">Reward in AWS Voucher</Text>
      
      <View className="bg-gray-800 rounded-lg p-4 space-y-4">
        {/* Reward Input with Plus/Minus */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={decrementReward}
            className="bg-gray-700 p-3 rounded-lg"
            disabled={value <= MINIMUM_REWARD}
          >
            <MinusIcon color={value <= MINIMUM_REWARD ? "#666666" : "#FFFF00"} size={24} />
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <View className="flex-row items-center">
              <Text className="text-yellow-400 text-xl mr-2">$</Text>
              <TextInput
                value={(value / 100).toFixed(2)}
                onChangeText={handleChange}
                keyboardType="decimal-pad"
                className="text-white text-xl flex-1"
                placeholder="0.00"
                placeholderTextColor="#666666"
              />
            </View>
            <Text className="text-gray-400 text-sm mt-1">
              Minimum reward: $5.00 (500 cents)
            </Text>
          </View>

          <TouchableOpacity
            onPress={incrementReward}
            className="bg-gray-700 p-3 rounded-lg"
          >
            <PlusIcon color="#FFFF00" size={24} />
          </TouchableOpacity>
        </View>

        {/* Platform Fee */}
        <View className="border-t border-gray-700 pt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-400">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</Text>
            <Text className="text-white">${(platformFee / 100).toFixed(2)}</Text>
          </View>
        </View>

        {/* Total Amount */}
        <View className="border-t border-gray-700 pt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-yellow-400 font-bold text-lg">Total Payment</Text>
            <Text className="text-yellow-400 font-bold text-lg">
              ${(totalAmount / 100).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
} 