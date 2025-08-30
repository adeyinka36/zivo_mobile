import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/solid';

interface QuizNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function QuizNumberInput({ value, onChange, className = '' }: QuizNumberInputProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleSelectNumber = (number: number) => {
    onChange(number);
    setIsModalVisible(false);
  };

  return (
    <View className={`mb-6 ${className}`}>
      <Text className="text-yellow-400 text-lg font-bold mb-2">Quiz Number</Text>
      <Text className="text-gray-400 text-sm mb-3">Quiz will be triggered on this view</Text>
      
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 flex-row justify-between items-center"
        activeOpacity={0.7}
      >
        <Text className="text-white text-lg">{value}</Text>
        <ChevronDownIcon color="#666" size={20} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-gray-900 rounded-t-3xl max-h-96">
            <View className="bg-gray-800 rounded-t-3xl py-4 px-6 border-b border-gray-700">
              <Text className="text-white text-lg font-bold text-center">Select Quiz Number</Text>
            </View>
            
            <ScrollView className="max-h-80">
              <View className="flex-row flex-wrap p-4">
                {numbers.map((number) => (
                  <TouchableOpacity
                    key={number}
                    onPress={() => handleSelectNumber(number)}
                    className={`w-12 h-12 rounded-lg items-center justify-center m-1 ${
                      value === number ? 'bg-yellow-400' : 'bg-gray-800 border border-gray-600'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-bold ${value === number ? 'text-black' : 'text-white'}`}>
                      {number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="bg-gray-800 py-4 px-6 border-t border-gray-700"
            >
              <Text className="text-white text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
