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
    <View className="bg-black/90 rounded-xl p-4 border border-primary/50 shadow-2xl">
      {/* Header with close button */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-primary font-bold" style={{ fontSize: wp('4.5%') }}>
          Details
        </Text>
        <TouchableOpacity 
          onPress={onClose} 
          className="bg-primary/20 rounded-full p-2"
          activeOpacity={0.7}
        >
          <XMarkIcon color="#FFFF00" size={20} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-white leading-6 font-medium" style={{ fontSize: wp('4%') }}>
          {description}
        </Text>
      </View>

      {/* Info Grid */}
      <View className="flex-row justify-between mb-4">
        {/* Uploader */}
        <View className="flex-1 mr-4">
          <Text className="text-primary font-semibold mb-1" style={{ fontSize: wp('3.5%') }}>
            Uploaded by
          </Text>
          <Text className="text-white font-medium" style={{ fontSize: wp('4%') }}>
            {uploader}
          </Text>
        </View>

        {/* Reward */}
        <View className="flex-1">
          <Text className="text-primary font-semibold mb-1" style={{ fontSize: wp('3.5%') }}>
            Reward
          </Text>
          <Text className="text-white font-medium" style={{ fontSize: wp('4%') }}>
            ${rewardInDollars}
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View>
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <View 
              key={tag.id} 
              className="bg-primary/20 border border-primary/50 rounded-full px-3 py-2"
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