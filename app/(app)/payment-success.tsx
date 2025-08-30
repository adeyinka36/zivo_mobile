import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircleIcon } from 'react-native-heroicons/solid';

export default function PaymentSuccessScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      {/* Success Icon */}
      <View className="mb-8">
        <CheckCircleIcon color="#FFFF00" size={80} />
      </View>

      {/* Success Message */}
      <Text className="text-white text-2xl font-bold text-center mb-4">
        Payment Successful!
      </Text>
      
      <Text className="text-gray-300 text-center mb-8 leading-6">
        Your media has been uploaded successfully and is now available for others to view and interact with.
      </Text>

      {/* Action Buttons */}
      <View className="w-full space-y-4">
        <TouchableOpacity
          onPress={() => router.replace('/(app)/explore')}
          className="bg-yellow-400 py-4 rounded-lg items-center"
          activeOpacity={0.7}
        >
          <Text className="text-black font-bold text-lg">Go to Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/create')}
          className="bg-gray-800 border border-gray-600 py-4 rounded-lg items-center"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold text-lg">Upload Another</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Info */}
      <View className="mt-12 p-4 bg-gray-800 rounded-lg">
        <Text className="text-gray-400 text-sm text-center">
          You will receive a confirmation email shortly. Thank you for using Zivo!
        </Text>
      </View>
    </View>
  );
} 