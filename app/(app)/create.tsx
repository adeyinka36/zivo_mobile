import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/solid';
import MediaUpload from '@/components/create/MediaUpload';
import RewardInput from '@/components/create/RewardInput';
import QuizSection from '@/components/create/QuizSection';
import TagsInput from '@/components/create/TagsInput';
import { api } from '@/context/auth';

export default function CreateScreen() {
  const router = useRouter();
  const [media, setMedia] = useState<{
    uri: string;
    type: 'image' | 'video';
    name: string;
  } | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [reward, setReward] = useState<number>(100);
  const [quizzes, setQuizzes] = useState<Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async () => {
    // Validate form
    if (!media) {
      Alert.alert('Error', 'Please upload a media file');
      return;
    }

    if (reward < 100) {
      Alert.alert('Error', 'Reward must be at least $1.00');
      return;
    }

    if (description.length > 1000) {
      Alert.alert('Error', 'Description must not exceed 1000 characters');
      return;
    }

    if (tags.some(tag => tag.length > 255)) {
      Alert.alert('Error', 'Each tag must not exceed 255 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: media.uri,
        type: media.type === 'image' ? 'image/jpeg' : 'video/mp4',
        name: media.name,
      } as any);

      if (description) {
        formData.append('description', description);
      }

      if (tags.length > 0) {
        tags.forEach(tag => formData.append('tags[]', tag));
      }

      if (reward) {
        formData.append('reward', reward.toString());
      }

      if (quizzes.length > 0) {
        quizzes.forEach((quiz, index) => {
          formData.append(`questions[${index}][question]`, quiz.question);
          formData.append(`questions[${index}][answer]`, String.fromCharCode(65 + quiz.correctAnswer));
          formData.append(`questions[${index}][option_a]`, quiz.options[0]);
          formData.append(`questions[${index}][option_b]`, quiz.options[1]);
          formData.append(`questions[${index}][option_c]`, quiz.options[2]);
          formData.append(`questions[${index}][option_d]`, quiz.options[3]);
        });
      }

      // Upload media
      const response = await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to payment screen with payment intent
      router.push({
        pathname: '/(app)/payment',
        params: {
          clientSecret: response.data.payment_intent.client_secret,
          paymentId: response.data.payment_intent.payment_id,
          amount: reward.toString(),
          mediaId: response.data.media.id,
        }
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to upload media'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="justify-between min-h-full p-4">
        {/* Media Upload Section */}
        <MediaUpload
          media={media}
          onMediaSelect={setMedia}
          className="mb-6"
        />

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-yellow-400 text-lg font-bold mb-2">Description</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-lg px-4 py-2"
            placeholder="Add a description..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
          <Text className="text-gray-400 text-sm mt-1">
            {description.length}/1000 characters
          </Text>
        </View>

        {/* Tags Input */}
        <TagsInput
          tags={tags}
          onChange={setTags}
          className="mb-6"
        />

        {/* Quiz Section */}
        <QuizSection
          quizzes={quizzes}
          onQuizzesChange={setQuizzes}
          className="mb-6"
        />

        {/* Reward Input */}
        <RewardInput
          value={reward}
          onChange={setReward}
          className="mb-6"
        />

        {/* Payment Button */}
        <TouchableOpacity
          onPress={handlePayment}
          className="bg-yellow-400 py-4 rounded-lg items-center"
          disabled={!media || isSubmitting}
        >
          <Text className="text-black font-bold text-lg">
            {isSubmitting ? 'Uploading...' : 'Payment'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
