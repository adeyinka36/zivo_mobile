import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { TrashIcon, PlayIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import type { UserMedia } from '../../types/profile';

interface UserMediaGridProps {
  media: UserMedia[];
  onDeleteMedia: (mediaId: string) => void;
  isLoading?: boolean;
}

export default function UserMediaGrid({ media, onDeleteMedia, isLoading = false }: UserMediaGridProps) {
  const renderMediaItem = ({ item }: { item: UserMedia }) => (
    <View style={{
      width: wp('45%'),
      aspectRatio: 1,
      marginBottom: hp('2%'),
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#333333',
    }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <Image
          source={{ uri: item.thumbnail || item.url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        
        {item.media_type === 'video' && (
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 12,
            padding: 4,
          }}>
            <PlayIcon color="#FFFF00" size={wp('4%')} />
          </View>
        )}

        <TouchableOpacity
          onPress={() => onDeleteMedia(item.id)}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(255, 68, 68, 0.9)',
            borderRadius: 16,
            padding: 6,
          }}
          activeOpacity={0.8}
        >
          <TrashIcon color="#FFFFFF" size={wp('4%')} />
        </TouchableOpacity>
      </View>

      <View style={{ padding: wp('2%') }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: Math.max(12, wp('3%')),
          fontWeight: 'bold',
          marginBottom: 2,
        }} numberOfLines={1}>
          {item.name}
        </Text>
        
        <Text style={{
          color: '#CCCCCC',
          fontSize: Math.max(10, wp('2.5%')),
        }} numberOfLines={1}>
          {item.description}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Text style={{
            color: '#FFFF00',
            fontSize: Math.max(10, wp('2.5%')),
            fontWeight: 'bold',
          }}>
            ${(item.reward / 100).toFixed(2)}
          </Text>
          
          <Text style={{
            color: '#888888',
            fontSize: Math.max(8, wp('2%')),
          }}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: hp('10%') }}>
        <ActivityIndicator color="#FFFF00" size="large" />
        <Text style={{ color: '#CCCCCC', marginTop: hp('2%'), fontSize: Math.max(14, wp('3.5%')) }}>
          Loading your media...
        </Text>
      </View>
    );
  }

  if (media.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: hp('10%') }}>
        <Text style={{ color: '#CCCCCC', fontSize: Math.max(16, wp('4%')), textAlign: 'center' }}>
          No media uploaded yet
        </Text>
        <Text style={{ color: '#888888', fontSize: Math.max(14, wp('3.5%')), textAlign: 'center', marginTop: hp('1%') }}>
          Start creating content to see it here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={media}
      renderItem={renderMediaItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: wp('4%'), paddingBottom: hp('5%') }}
    />
  );
} 