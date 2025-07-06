import React from 'react';
import { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ScreenWrapper from '@/components/ScreenWrapper';

export default function Login() {
  const { login } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogin = async (data: { email: string; password: string }) => {
    if (isSubmitting) return;
    
    setApiError(null);
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      console.log('Login error:', e);
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (e.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e.message) {
        errorMessage = e.message
          .replace(/email:/i, '')
          .replace(/password:/i, '')
          .replace(/\n/g, ' ')
          .trim();
      }
      
      setApiError(errorMessage);
      setIsSubmitting(false);
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

      {/* API Error Message */}
      {apiError && (
        <View className="w-full max-w-[400px] mb-4 px-4">
          <View className="bg-error/10 border border-error/20 rounded-lg p-4">
            <Text className="text-error text-base text-center font-bold ">
              {apiError}
            </Text>
          </View>
        </View>
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
                  placeholder="Password"
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

      {/* Forgot Password Link */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="flex-row justify-end mb-4">
        <TouchableOpacity 
          onPress={() => router.push('/resetPassword')}
          disabled={isSubmitting}
        >
          <Text className="text-primary font-bold">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleSubmit(onLogin)}
        className={`bg-primary rounded-lg mt-2 ${isSubmitting ? 'opacity-50' : ''}`}
        style={{ 
          width: wp('90%'), 
          maxWidth: 400,
          padding: wp('4%'),
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="bg-background" size="small" />
        ) : (
          <Text className="text-background text-center font-bold" style={{ fontSize: wp('4.5%') }}>LOGIN</Text>
        )}
      </TouchableOpacity>

      {/* Register Link */}
      <View className="mt-6 flex-row justify-center items-center">
        <Text className="text-primary" style={{ fontSize: wp('4%') }}>
          Don&apos;t have an account?{' '}
        </Text>
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/register')}
          disabled={isSubmitting}
        >
          <Text className="text-primary font-bold" style={{ fontSize: wp('4%') }}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

export const options = {
  headerShown: false,
}; 