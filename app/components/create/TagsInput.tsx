import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export default function TagsInput({ tags, onChange, className = '' }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmedTag = inputValue.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ' ') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <View className={`${className}`}>
      <Text className="text-yellow-400 text-lg font-bold mb-2">Tags</Text>
      <Text className="text-gray-400 text-sm mb-4">
        Add up to 10 tags to help others find your content
      </Text>

      <View className="flex-row items-center mb-4">
        <TextInput
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 mr-2"
          placeholder="Add a tag..."
          placeholderTextColor="#666"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddTag}
          onKeyPress={handleKeyPress}
          maxLength={255}
        />
        <TouchableOpacity
          onPress={handleAddTag}
          className="bg-yellow-400 px-4 py-2 rounded-lg"
          disabled={!inputValue.trim() || tags.length >= 10}
        >
          <Text className="text-black font-bold">Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {tags.map((tag, index) => (
          <View
            key={index}
            className="bg-gray-800 rounded-full px-4 py-2 mr-2 mb-2 flex-row items-center"
          >
            <Text className="text-yellow-400 mr-2">#{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
              <XMarkIcon color="#FFFF00" size={16} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 