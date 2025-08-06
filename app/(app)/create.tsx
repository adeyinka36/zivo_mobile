import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/solid';
import MediaUpload from '@/components/create/MediaUpload';
import RewardInput from '@/components/create/RewardInput';
import QuizSection from '@/components/create/QuizSection';
import TagsInput from '@/components/create/TagsInput';
import { PaymentService } from '../../services/paymentService';
import { FormStateService } from '../../services/formStateService';
import { CreateFormState } from '../../types/payment';

export default function CreateScreen() {
  const router = useRouter();
  const [formState, setFormState] = useState<CreateFormState>({
    media: null,
    description: '',
    tags: [],
    reward: 100,
    questions: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved form state on mount
  useEffect(() => {
    loadSavedFormState();
  }, []);

  // Auto-save form state when it changes
  useEffect(() => {
    FormStateService.saveFormState(formState);
  }, [formState]);

  const loadSavedFormState = async () => {
    const savedState = await FormStateService.loadFormState();
    if (savedState) {
      setFormState(savedState);
    }
  };

  const updateFormState = (updates: Partial<CreateFormState>) => {
    setFormState((prev: CreateFormState) => ({ ...prev, ...updates }));
  };

  const handlePayment = async () => {
    // Validate form
    const validation = FormStateService.validateFormState(formState);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert form state to payment metadata
      const metadata = FormStateService.convertToPaymentMetadata(formState);

      console.log('Creating payment intent with metadata:', metadata);

      // Create payment intent with metadata only
      const paymentResult = await PaymentService.createPaymentIntent(metadata);

      console.log('Payment intent result:', paymentResult);

      // Navigate to payment screen
      router.push({
        pathname: '/(app)/payment',
        params: {
          clientSecret: paymentResult.client_secret,
          paymentId: paymentResult.payment_id,
          amount: formState.reward.toString(),
        }
      });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create payment intent'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSelect = (media: { uri: string; type: 'image' | 'video'; name: string; } | null) => {
    // Add size property to match CreateFormState interface
    const mediaWithSize = media ? { ...media, size: 0 } : null;
    updateFormState({ media: mediaWithSize });
  };

  const handleDescriptionChange = (description: string) => {
    updateFormState({ description });
  };

  const handleTagsChange = (tags: string[]) => {
    updateFormState({ tags });
  };

  const handleRewardChange = (reward: number) => {
    updateFormState({ reward });
  };

  const handleQuizzesChange = (questions: CreateFormState['questions']) => {
    updateFormState({ questions });
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="justify-between min-h-full p-4">
        {/* Media Upload Section */}
        <MediaUpload
          media={formState.media}
          onMediaSelect={handleMediaSelect}
          className="mb-6"
        />

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-yellow-400 text-lg font-bold mb-2">Description</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-lg px-4 py-2"
            placeholder="Add a description..."
            placeholderTextColor="#666"
            value={formState.description}
            onChangeText={handleDescriptionChange}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
          <Text className="text-gray-400 text-sm mt-1">
            {formState.description.length}/1000 characters
          </Text>
        </View>

        {/* Tags Input */}
        <TagsInput
          tags={formState.tags}
          onChange={handleTagsChange}
          className="mb-6"
        />

        {/* Quiz Section */}
        <QuizSection
          quizzes={formState.questions}
          onQuizzesChange={handleQuizzesChange}
          className="mb-6"
        />

        {/* Reward Input */}
        <RewardInput
          value={formState.reward}
          onChange={handleRewardChange}
          className="mb-6"
        />

        {/* Payment Button */}
        <TouchableOpacity
          onPress={handlePayment}
          className="bg-yellow-400 py-4 rounded-lg items-center"
          disabled={!formState.media || isSubmitting}
        >
          <Text className="text-black font-bold text-lg">
            {isSubmitting ? 'Creating Payment...' : 'Proceed to Payment'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
