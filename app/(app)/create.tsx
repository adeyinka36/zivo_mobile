import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, useFocusEffect } from 'expo-router';
import { PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/solid';
import MediaUpload from '@/components/create/MediaUpload';
import RewardInput from '@/components/create/RewardInput';
import QuizSection from '@/components/create/QuizSection';
import TagsInput from '@/components/create/TagsInput';
import QuizNumberInput from '@/components/create/QuizNumberInput';
import { PaymentService } from '../../services/paymentService';
import { FormStateService } from '../../services/formStateService';
import { CreateFormState } from '../../types/payment';

export default function CreateScreen() {
  const router = useRouter();
  const [formState, setFormState] = useState<CreateFormState>(FormStateService.getInitialFormState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSavedFormState();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadSavedFormState();
    }, [])
  );

  useEffect(() => {
    FormStateService.saveFormState(formState);
  }, [formState]);

  const loadSavedFormState = async () => {
    const savedState = await FormStateService.loadFormState();
    if (savedState) {
      setFormState(savedState);
    } else {
      setFormState(FormStateService.getInitialFormState());
    }
  };

  const updateFormState = (updates: Partial<CreateFormState>) => {
    setFormState((prev: CreateFormState) => ({ ...prev, ...updates }));
  };

  const handleClearForm = async () => {
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all form data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const initialState = await FormStateService.resetFormState();
            setFormState(initialState);
            Alert.alert('Form Cleared', 'All form data has been cleared.');
          }
        }
      ]
    );
  };

  const handlePayment = async () => {
    const validation = FormStateService.validateFormState(formState);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    setIsSubmitting(true);

    try {
      const metadata = FormStateService.convertToPaymentMetadata(formState);
      const paymentResult = await PaymentService.createPaymentIntent(metadata);

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

  const handleQuizNumberChange = (quizNumber: number) => {
    updateFormState({ quizNumber });
  };

  const handleQuizzesChange = (questions: CreateFormState['questions']) => {
    updateFormState({ questions });
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#000000' }}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={20}
      extraScrollHeight={20}
      showsVerticalScrollIndicator={false}
    >
      <View className="justify-between min-h-full">
        <MediaUpload
          media={formState.media}
          onMediaSelect={handleMediaSelect}
          className="mb-6"
        />

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

        <TagsInput
          tags={formState.tags}
          onChange={handleTagsChange}
          className="mb-6"
        />

        <QuizNumberInput
          value={formState.quizNumber}
          onChange={handleQuizNumberChange}
          className="mb-6"
        />

        <QuizSection
          quizzes={formState.questions}
          onQuizzesChange={handleQuizzesChange}
          className="mb-6"
        />

        <RewardInput
          value={formState.reward}
          onChange={handleRewardChange}
          className="mb-6"
        />

        <TouchableOpacity
          onPress={handlePayment}
          className="bg-yellow-400 py-4 rounded-lg items-center mb-4"
          disabled={!formState.media || isSubmitting}
        >
          <Text className="text-black font-bold text-lg">
            {isSubmitting ? 'Creating Payment...' : 'Proceed to Payment'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClearForm}
          className="bg-gray-600 py-3 rounded-lg items-center mb-3"
          disabled={isSubmitting}
        >
          <Text className="text-white font-semibold">
            Clear Form
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
