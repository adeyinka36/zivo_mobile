import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MagnifyingGlassIcon, PlusCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center px-6">
        <TouchableOpacity
          onPress={() => router.push('/explore')}
          className="bg-primary rounded-lg items-center justify-center shadow-lg"
          style={{ width: wp('60%'), maxWidth: 400, padding: wp('4%') }}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <MagnifyingGlassIcon color="#000000" size={wp('5%')} />
            <Text className="ml-2 text-background font-bold" style={{ fontSize: wp('4.5%') }}>
              EXPLORE
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/create')}
          className="absolute bottom-20"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <PlusCircleIcon color="#FFFF00" size={wp('6%')} />
            <Text className="ml-2 text-primary font-bold" style={{ fontSize: wp('4%') }}>
              CREATE
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
