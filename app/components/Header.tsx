import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { BellIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onNotificationPress?: () => void;
}

export default function Header({ onNotificationPress }: HeaderProps) {
  const { user } = useAuth();

  return (
    <View className="flex-row justify-between items-center px-6 pt-2 pb-0 h-16">
      {/* Notification Icon */}
      <TouchableOpacity
        onPress={onNotificationPress}
        className="absolute left-6 h-full justify-center"
        activeOpacity={0.7}
      >
        <BellIcon color="#FFFF00" size={wp('9%')} />
      </TouchableOpacity>

      {/* Logo */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('@/assets/logo.png')}
          style={{ width: wp(18), height: wp(18) }}
          resizeMode="contain"
        />
      </View>

      {/* Zivos Balance */}
      <View className="absolute right-6 h-full justify-center items-center">
        <Text className="text-primary font-bold" style={{ fontSize: wp('4%') }}>
          {user?.zivos || 0}
        </Text>
        <Text className="text-primary font-bold" style={{ fontSize: wp('3%') }}>
          ZVS
        </Text>
      </View>
    </View>
  );
} 