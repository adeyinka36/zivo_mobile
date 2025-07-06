import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingScreen from '@/components/LoadingScreen';

export default function ResetPassword() {
  const { forgotPassword, isLoading } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm<{
    email: string;
  }>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const onRequestReset = async (data: { email: string }) => {
    setApiError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const message = await forgotPassword(data.email);
      setSuccessMessage(message);
      // Use setTimeout to ensure the success message is shown before navigation
      setTimeout(() => {
        console.log('Navigating to new password page with email:', data.email);
        router.replace('/newPassword?email=' + encodeURIComponent(data.email));
      }, 1000);
    } catch (e: any) {
      console.error('Navigation error:', e);
      setApiError(e.message || 'Failed to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#000000' }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('4%'),
        paddingBottom: Platform.OS === 'ios' ? hp('10%') : hp('5%'),
      }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? hp('10%') : hp('5%')}
      showsVerticalScrollIndicator={false}
      keyboardOpeningTime={0}
      keyboardDismissMode="on-drag"
    >
      {/* Loading Screen */}
      {(isLoading || isSubmitting) && <LoadingScreen />}

      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require('@/assets/logo.png')}
          style={{ width: wp(90), height: wp(90) }}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text className="text-primary text-2xl font-bold mb-6 text-center" style={{ fontSize: wp('6%') }}>
        Reset Your Password
      </Text>

      {/* Description */}
      <Text className="text-primary text-center mb-8 px-4" style={{ fontSize: wp('4%') }}>
        Enter your email address and we'll send you a reset token.
      </Text>

      {/* Success Message */}
      {successMessage && (
        <Text className="text-primary text-base mb-4 text-center">{successMessage}</Text>
      )}

      {/* API Error Message */}
      {apiError && (
        <Text className="text-error text-base mb-2 text-center">{apiError}</Text>
      )}

      {/* Email Input */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="mb-2">
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email address is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please enter a valid email address',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <View className={`flex-row items-center w-full bg-transparent rounded-lg border ${errors.email ? 'border-error' : 'border-primary'} p-4`}>
                <FontAwesome name="envelope" size={wp('5%')} color="#FFFF00" style={{ marginRight: wp('3%') }} />
                <TextInput
                  className="flex-1 text-primary font-bold"
                  placeholder="Email address"
                  placeholderTextColor="#FFFF00"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  style={{ fontSize: wp('4%') }}
                  editable={!isSubmitting}
                />
              </View>
              {errors.email && (
                <Text className="text-error text-xs mt-1">{errors.email.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onRequestReset)}
        className={`bg-primary rounded-lg mt-2 ${isSubmitting ? 'opacity-50' : ''}`}
        style={{ 
          width: wp('90%'), 
          maxWidth: 400,
          padding: wp('4%'),
        }}
        disabled={isSubmitting}
        activeOpacity={0.7}
      >
        <Text className="text-background text-center font-bold" style={{ fontSize: wp('4.5%') }}>
          SEND RESET TOKEN
        </Text>
      </TouchableOpacity>

      {/* Back to Login Link */}
      <Text className="mt-6 text-primary text-center" style={{ fontSize: wp('4%') }}>
        Remember your password?{' '}
        <Link href="/(auth)/login" className="text-primary font-bold underline">
          Back to Login
        </Link>
      </Text>
    </KeyboardAwareScrollView>
  );
}

export const options = {
  headerShown: false,
}; 