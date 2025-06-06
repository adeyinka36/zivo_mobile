import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingScreen from '@/components/LoadingScreen';

export default function NewPassword() {
  const { resetPassword, isLoading } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [apiError, setApiError] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors }, watch } = useForm<{
    token: string;
    password: string;
    confirmPassword: string;
  }>();
  const password = watch('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onResetPassword = async (data: { token: string; password: string; confirmPassword: string }) => {
    if (!email) {
      setApiError('Invalid reset link. Please request a new password reset link.');
      return;
    }

    setApiError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(email, data.password, data.token);
      router.replace({
        pathname: '/(auth)/login',
        params: { message: 'Password reset successful. Please login with your new password.' }
      });
    } catch (e: any) {
      setApiError(e.message || 'Failed to reset password.');
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
        Set New Password
      </Text>

      {/* Description */}
      <Text className="text-primary text-center mb-8 px-4" style={{ fontSize: wp('4%') }}>
        Enter the token sent to {email} and your new password.
      </Text>

      {/* API Error Message */}
      {apiError && (
        <Text className="text-error text-base mb-2 text-center">{apiError}</Text>
      )}

      {/* Token Input */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="mb-2">
        <Controller
          control={control}
          name="token"
          rules={{
            required: 'Reset token is required',
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <View className={`flex-row items-center w-full bg-transparent rounded-lg border ${errors.token ? 'border-error' : 'border-primary'} p-4`}>
                <FontAwesome name="key" size={wp('5%')} color="#FFFF00" style={{ marginRight: wp('3%') }} />
                <TextInput
                  className="flex-1 text-primary font-bold"
                  placeholder="Reset Token"
                  placeholderTextColor="#FFFF00"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: wp('4%') }}
                  editable={!isSubmitting}
                />
              </View>
              {errors.token && (
                <Text className="text-error text-xs mt-1">{errors.token.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Password Input */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="mb-2">
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
              message: 'Password must contain at least one uppercase letter and one number',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <View className={`flex-row items-center w-full bg-transparent rounded-lg border ${errors.password ? 'border-error' : 'border-primary'} p-4`}>
                <FontAwesome name="lock" size={wp('5%')} color="#FFFF00" style={{ marginRight: wp('3%') }} />
                <TextInput
                  className="flex-1 text-primary font-bold"
                  placeholder="New Password"
                  placeholderTextColor="#FFFF00"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: wp('4%') }}
                  editable={!isSubmitting}
                />
              </View>
              {errors.password && (
                <Text className="text-error text-xs mt-1">{errors.password.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="mb-2">
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match',
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <View className={`flex-row items-center w-full bg-transparent rounded-lg border ${errors.confirmPassword ? 'border-error' : 'border-primary'} p-4`}>
                <FontAwesome name="lock" size={wp('5%')} color="#FFFF00" style={{ marginRight: wp('3%') }} />
                <TextInput
                  className="flex-1 text-primary font-bold"
                  placeholder="Confirm New Password"
                  placeholderTextColor="#FFFF00"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: wp('4%') }}
                  editable={!isSubmitting}
                />
              </View>
              {errors.confirmPassword && (
                <Text className="text-error text-xs mt-1">{errors.confirmPassword.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onResetPassword)}
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
          RESET PASSWORD
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