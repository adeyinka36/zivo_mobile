import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import {UserIcon, PlusCircleIcon} from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function Header() {
  const { user } = useAuth();

  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center px-6 pt-2 pb-0 h-16">
      {/* Profile Icon */}
      <TouchableOpacity
        onPress={() => router.push('/profile')}
        className="absolute left-6 h-full justify-center"
        activeOpacity={0.7}
      >
        <UserIcon color="#FFFF00" size={wp('9%')} />
      </TouchableOpacity>

      {/* Logo */}
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity
          onPress={() => router.push('/explore')}
          className="absolute  h-full justify-center"
          activeOpacity={0.7}
        >
          <Image
            source={require('@/assets/logo.png')}
            style={{ width: wp(18), height: wp(18) }}
            resizeMode="contain"
          />
        </TouchableOpacity>
       
      </View>

        <TouchableOpacity
            onPress={() => router.push('/create')}
            className="absolute right-6 h-full justify-center items-center"
            activeOpacity={0.7}
        >
            <View className=" items-center">
                <PlusCircleIcon color="#FFFF00" size={wp('9%')} />
            </View>
        </TouchableOpacity>
    </View>
  );
} 