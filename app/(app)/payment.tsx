import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStripe, useConfirmPayment, usePaymentSheet } from '@stripe/stripe-react-native';
import { useAuth } from '@/hooks/useAuth';
import { PaymentService } from '../../services/paymentService';
import { FormStateService } from '../../services/formStateService';
import type { PaymentMethod } from '../../types/payment';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import SuccessModal from '../components/SuccessModal';

export default function PaymentScreen() {
  const { confirmPayment, loading } = useConfirmPayment();
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const { clientSecret, paymentId, amount } = useLocalSearchParams<{
    clientSecret: string;
    paymentId: string;
    amount: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize payment sheet for card payments
  useEffect(() => {
    if (clientSecret) {
      initializePaymentSheet();
    }
  }, [clientSecret]);

  const initializePaymentSheet = async () => {
    try {
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Zivo',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          email: user?.email,
          name: user?.name,
        },
      });

      if (error) {
        console.error('Payment sheet init error:', error);
      }
    } catch (error) {
      console.error('Failed to initialize payment sheet:', error);
    }
  };

  const handlePayment = async (paymentMethod: PaymentMethod) => {
    if (!clientSecret) {
      Alert.alert('Error', 'Payment intent not found');
      return;
    }

    setIsProcessing(true);
    setSelectedMethod(paymentMethod);

    try {
      if (paymentMethod === 'Card') {
        // For card payments, use the payment sheet
        setShowCardForm(true);
        setIsProcessing(false);
        setSelectedMethod(null);
        return;
      }

      // For Apple Pay and Google Pay
      const stripePaymentMethodType = paymentMethod === 'ApplePay' ? 'ApplePay' : 'GooglePay';

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: stripePaymentMethodType as any,
        paymentMethodData: {
          billingDetails: {
            email: user?.email,
            name: user?.name,
          },
        },
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        await handlePaymentSuccess();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  const handleCardPayment = async () => {
    if (!clientSecret) {
      Alert.alert('Error', 'Payment intent not found');
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error('Payment sheet error:', error);
        Alert.alert('Payment Failed', error.message);
      } else {
        // Payment was successful
        await handlePaymentSuccess();
      }
    } catch (error: any) {
      console.error('Card payment error:', error);
      Alert.alert('Error', 'Card payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const status = await PaymentService.pollPaymentStatus(paymentId);
      
      if (status.status === 'succeeded') {
        await uploadMediaAfterPayment();
      } else {
        Alert.alert('Payment Failed', status.failure_reason || 'Payment was not completed');
      }
    } catch (pollError) {
      console.error('Payment status polling failed:', pollError);
      Alert.alert('Payment Status', 'Payment completed but status verification failed. Please check your payment history.');
    }
  };

  const uploadMediaAfterPayment = async () => {
    setIsUploading(true);

    try {
      // Load form state
      const formState = await FormStateService.loadFormState();
      
      if (!formState || !formState.media) {
        Alert.alert('Error', 'Form data not found. Please try again.');
        return;
      }

      // Create file object for upload
      const file = {
        uri: formState.media.uri,
        type: formState.media.type === 'image' ? 'image/jpeg' : 'video/mp4',
        name: formState.media.name,
      };

      // Upload media after payment
      await PaymentService.uploadAfterPayment({
        payment_id: paymentId,
        file,
        description: formState.description,
        tags: formState.tags,
        reward: formState.reward,
        quiz_number: formState.quizNumber,
        questions: formState.questions.map((quiz: { id: string; question: string; options: string[]; correctAnswer: number }) => ({
          question: quiz.question,
          answer: String.fromCharCode(65 + quiz.correctAnswer),
          option_a: quiz.options[0],
          option_b: quiz.options[1],
          option_c: quiz.options[2],
          option_d: quiz.options[3],
        })),
      });

      // Clear form state after successful upload
      await FormStateService.clearFormState();

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        'Payment was successful but upload failed. Please contact support.',
        [
          { text: 'Try Again', onPress: () => uploadMediaAfterPayment() },
          { text: 'Go to Explore', onPress: () => router.replace('/(app)/explore') }
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace('/(app)/explore');
  };

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    return `$${(numAmount / 100).toFixed(2)}`;
  };

  const renderCardForm = () => (
    <View className="bg-gray-800 rounded-lg p-6 mb-6">
      <Text className="text-white text-lg font-bold mb-4">Card Payment</Text>
      <Text className="text-gray-300 mb-4">
        Click the button below to open Stripe's secure payment form where you can enter your card details.
      </Text>
      
      <TouchableOpacity
        onPress={handleCardPayment}
        disabled={isProcessing}
        className="bg-yellow-400 rounded-lg p-4 mt-4 items-center"
        activeOpacity={0.7}
      >
        {isProcessing ? (
          <ActivityIndicator color="#000000" />
        ) : (
          <Text className="text-black font-bold text-lg">
            Enter Card Details
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowCardForm(false)}
        disabled={isProcessing}
        className="bg-gray-600 rounded-lg p-4 mt-2 items-center"
        activeOpacity={0.7}
      >
        <Text className="text-white font-semibold">Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Complete Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 p-6">
        {/* Payment Summary */}
        <View className="bg-gray-800 rounded-lg p-6 mb-8">
          <Text className="text-white text-xl font-bold mb-2">Payment Summary</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-300">Amount:</Text>
            <Text className="text-yellow-400 text-xl font-bold">
              {formatAmount(amount)}
            </Text>
          </View>
        </View>

        {/* Upload Progress */}
        {isUploading && (
          <View className="bg-gray-800 rounded-lg p-6 mb-6">
            <Text className="text-white text-lg font-bold mb-4">Uploading Media</Text>
            <ActivityIndicator size="large" color="#FFFF00" />
            <Text className="text-gray-300 mt-2 text-center">
              Please wait while we upload your media...
            </Text>
          </View>
        )}

        {/* Card Form */}
        {showCardForm && !isUploading && renderCardForm()}

        {/* Payment Methods */}
        {!showCardForm && !isUploading && (
          <>
            <Text className="text-white text-lg font-bold mb-4">Choose Payment Method</Text>

            {/* Platform-specific payment options */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => handlePayment('ApplePay')}
                disabled={loading || isProcessing}
                className="bg-black border border-gray-600 rounded-lg p-4 mb-4 items-center"
                activeOpacity={0.7}
              >
                {isProcessing && selectedMethod === 'ApplePay' ? (
                  <ActivityIndicator color="#FFFF00" />
                ) : (
                  <Text className="text-white font-semibold">Apple Pay</Text>
                )}
              </TouchableOpacity>
            )}

            {Platform.OS === 'android' && (
              <TouchableOpacity
                onPress={() => handlePayment('GooglePay')}
                disabled={loading || isProcessing}
                className="bg-black border border-gray-600 rounded-lg p-4 mb-4 items-center"
                activeOpacity={0.7}
              >
                {isProcessing && selectedMethod === 'GooglePay' ? (
                  <ActivityIndicator color="#FFFF00" />
                ) : (
                  <Text className="text-white font-semibold">Google Pay</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Card Payment - always available */}
            <TouchableOpacity
              onPress={() => handlePayment('Card')}
              disabled={loading || isProcessing}
              className="bg-yellow-400 rounded-lg p-4 items-center"
              activeOpacity={0.7}
            >
              {isProcessing && selectedMethod === 'Card' ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text className="text-black font-bold text-lg">
                  Pay with Card
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Processing Indicator */}
        {isProcessing && !showCardForm && !isUploading && (
          <View className="mt-6 items-center">
            <ActivityIndicator size="large" color="#FFFF00" />
            <Text className="text-white mt-2">Processing payment...</Text>
          </View>
        )}

        {/* Security Notice */}
        <View className="mt-8 p-4 bg-gray-800 rounded-lg">
          <Text className="text-gray-400 text-sm text-center">
            Your payment is secured by Stripe. We never store your card details.
          </Text>
        </View>
      </View>
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </View>
  );
} 