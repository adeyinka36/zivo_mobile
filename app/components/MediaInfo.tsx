import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface MediaInfoProps {
  description: string;
  reward: number;
  uploader: string;
  tags: Array<{ id: string; name: string }>;
  onClose: () => void;
}

export default function MediaInfo({ description, reward, uploader, tags, onClose }: MediaInfoProps) {
  const rewardInDollars = (reward / 100).toFixed(2);

  return (
    <View className="bg-black/95 rounded-xl p-6 border border-primary/50 shadow-2xl">
      {/* Header with close button */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-primary font-bold" style={{ fontSize: wp('5%') }}>
          Media Details
        </Text>
        <TouchableOpacity 
          onPress={onClose} 
          className="bg-primary/20 rounded-full p-2"
          activeOpacity={0.7}
        >
          <XMarkIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View className="mb-6">
        <Text className="text-white leading-7 font-medium" style={{ fontSize: wp('4.2%') }}>
          {description}
        </Text>
      </View>

      {/* Prominent Stats Section */}
      <View className="bg-primary/10 rounded-lg p-4 mb-6 border border-primary/30">
        <View className="items-center">
          {/* Reward */}
          <View className="flex-1 items-center">
            <Text className="text-primary font-bold mb-1" style={{ fontSize: wp('4%') }}>
              ${rewardInDollars}
            </Text>
            <Text className="text-white/80 font-medium" style={{ fontSize: wp('3%') }}>
              Reward
            </Text>
          </View>
        </View>
      </View>

      {/* Uploader Info */}
      <View className="mb-6">
        <Text className="text-primary font-semibold mb-2" style={{ fontSize: wp('3.5%') }}>
          Uploaded by
        </Text>
        <Text className="text-white font-medium" style={{ fontSize: wp('4%') }}>
          {uploader}
        </Text>
      </View>

      {/* Tags */}
      <View>
        <Text className="text-primary font-semibold mb-3" style={{ fontSize: wp('3.5%') }}>
          Tags
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <View 
              key={tag.id} 
              className="bg-primary/20 border border-primary/50 rounded-full px-4 py-2"
            >
              <Text className="text-primary font-medium" style={{ fontSize: wp('3.5%') }}>
                #{tag.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
} 