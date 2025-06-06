import React from 'react';
import { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ScreenWrapper from '@/components/ScreenWrapper';

export default function RequestPasswordToken() {
  const { forgotPassword, isLoading } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onRequestReset = async (data: { email: string }) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      const message = await forgotPassword(data.email);
      setSuccessMessage(message);
    } catch (e: any) {
      setApiError(e.message || 'Failed to request password reset.');
    }
  };

  return (
    <ScreenWrapper>
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
        Enter your email address and we'll send you instructions to reset your password.
      </Text>

      {/* API Error Message */}
      {apiError && (
        <Text className="text-error text-base mb-2 text-center">{apiError}</Text>
      )}

      {/* Success Message */}
      {successMessage && (
        <Text className="text-primary text-base mb-2 text-center">{successMessage}</Text>
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
        className="bg-primary rounded-lg mt-2"
        style={{ 
          width: wp('90%'), 
          maxWidth: 400,
          padding: wp('4%'),
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="bg-background" size="small" />
        ) : (
          <Text className="text-background text-center font-bold" style={{ fontSize: wp('4.5%') }}>SEND RESET LINK</Text>
        )}
      </TouchableOpacity>

      {/* Back to Login Link */}
      <View className="mt-6 flex-row justify-center items-center">
        <Text className="text-primary" style={{ fontSize: wp('4%') }}>
          Remember your password?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text className="text-primary font-bold" style={{ fontSize: wp('4%') }}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

export const options = {
  headerShown: false,
}; 