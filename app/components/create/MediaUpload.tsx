import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { PhotoIcon, VideoCameraIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';

interface MediaUploadProps {
  media: {
    uri: string;
    type: 'image' | 'video';
    name: string;
  } | null;
  onMediaSelect: (media: { uri: string; type: 'image' | 'video'; name: string; } | null) => void;
  className?: string;
}

export default function MediaUpload({ media, onMediaSelect, className = '' }: MediaUploadProps) {
  const playerRef = useRef<any>(null);

  const pickMedia = async (type: 'image' | 'video') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() || `media_${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`;
      
      onMediaSelect({
        uri: asset.uri,
        type,
        name: fileName,
      });
    }
  };

  const player = useVideoPlayer(media?.uri || '', (player) => {
    playerRef.current = player;
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View className={`${className}`}>
      {/* <Text className="text-yellow-400 text-lg font-bold mb-4">Media Upload</Text> */}
      
      {media ? (
        <View className="relative">
          {media.type === 'image' ? (
            <Image
              source={{ uri: media.uri }}
              className="w-full h-64 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <VideoView
              style={{ width: '100%', height: 256, borderRadius: 8 }}
              player={player}
              contentFit="cover"
            />
          )}
          <TouchableOpacity
            onPress={() => onMediaSelect(null)}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
          >
            <Text className="text-white">Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            // Show action sheet to choose between image and video
            Alert.alert(
              'Select Media Type',
              'Choose the type of media you want to upload',
              [
                {
                  text: 'Image',
                  onPress: () => pickMedia('image'),
                },
                {
                  text: 'Video',
                  onPress: () => pickMedia('video'),
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
              ]
            );
          }}
          className="bg-gray-800 rounded-lg p-8 items-center justify-center"
        >
          <View className="items-center">
            <View className="bg-gray-700 p-4 rounded-full mb-4">
              <PhotoIcon color="#FFFF00" size={32} />
            </View>
            <Text className="text-yellow-400 text-lg font-bold">Upload Media</Text>
            <Text className="text-gray-400 text-sm mt-2">
              Tap to select image or video
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
} 