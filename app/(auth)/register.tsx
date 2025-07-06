import React from 'react';
import { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ScreenWrapper from '@/components/ScreenWrapper';

export default function Register() {
  const { signup: registerUser } = useAuth();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<{
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const password = watch('password');

  const onRegister = async (data: { 
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (isSubmitting) return;
    
    setApiError(null);
    setIsSubmitting(true);
    
    try {
      await registerUser(data.email, data.password, data.name, data.username);
    } catch (e: any) {
      console.log('Registration error:', e);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (e.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(e.response.data.errors)
          .map(([field, messages]) => {
            // Convert field names to user-friendly format
            const friendlyField = field
              .replace('name', 'Full name')
              .replace('username', 'Username')
              .replace('email', 'Email')
              .replace('password', 'Password');
            return `${friendlyField}: ${(messages as string[]).join(', ')}`;
          })
          .join('\n');
        errorMessage = errorMessages;
      } else if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e.message) {
        errorMessage = e.message
          .replace(/name:/i, 'Full name: ')
          .replace(/username:/i, 'Username: ')
          .replace(/email:/i, 'Email: ')
          .replace(/password:/i, 'Password: ')
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
      <View className="items-center mb-3">
        <Image
          source={require('@/assets/logo.png')}
          style={{ width: wp(50), height: wp(50) }}
          resizeMode="contain"
        />
      </View>

      {/* API Error Message */}
      {apiError && (
        <View className="w-full max-w-[400px] mb-4 px-4">
          <View className="bg-error/10 border border-error/20 rounded-lg p-4">
            <Text className="text-error text-base text-center font-medium">
              {apiError}
            </Text>
          </View>
        </View>
      )}

      {/* Name Input */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="mb-2">
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Name is required',
            maxLength: { value: 255, message: 'Name cannot exceed 255 characters' },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <View className={`flex-row items-center w-full bg-transparent rounded-lg border ${errors.name ? 'border-error' : 'border-primary'} p-4`}>
                <FontAwesome name="user" size={wp('5%')} color="#FFFF00" style={{ marginRight: wp('3%') }} />
                <TextInput
                  className="flex-1 text-primary font-bold"
                  placeholder="Full Name"
                  placeholderTextColor="#FFFF00"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: wp('4%') }}
                  editable={!isSubmitting}
                />
              </View>
              {errors.name && (
                <Text className="text-error text-xs mt-1">{errors.name.message}</Text>
              )}
            </>
          )}
        />
      </View>

      {/* Username Input */}
      <View style={{ width: wp('90%'), maxWidth: 400 }} className="mb-2">
        <Controller
          control={control}
          name="username"
          rules={{
            required: 'Username is required',
            maxLength: { value: 255, message: 'Username cannot exceed 255 characters' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Username can only contain letters, numbers, and underscores',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <View className={`flex-row items-center w-full bg-transparent rounded-lg border ${errors.username ? 'border-error' : 'border-primary'} p-4`}>
                <FontAwesome name="at" size={wp('5%')} color="#FFFF00" style={{ marginRight: wp('3%') }} />
                <TextInput
                  className="flex-1 text-primary font-bold"
                  placeholder="Username"
                  placeholderTextColor="#FFFF00"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: wp('4%') }}
                  editable={!isSubmitting}
                />
              </View>
              {errors.username && (
                <Text className="text-error text-xs mt-1">{errors.username.message}</Text>
              )}
            </>
          )}
        />
      </View>

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
            maxLength: { value: 255, message: 'Email cannot exceed 255 characters' },
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
                  placeholder="Confirm Password"
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

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleSubmit(onRegister)}
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
          <Text className="text-background text-center font-bold" style={{ fontSize: wp('4.5%') }}>REGISTER</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <View className="mt-6 flex-row justify-center items-center">
        <Text className="text-primary" style={{ fontSize: wp('4%') }}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/login')}
          disabled={isSubmitting}
        >
          <Text className="text-primary font-bold" style={{ fontSize: wp('4%') }}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

export const options = {
  headerShown: false,
}; 