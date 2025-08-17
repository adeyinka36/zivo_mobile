import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { MagnifyingGlassIcon, PlusCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { VideoView, createVideoPlayer } from 'expo-video';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();

  const playerRef = useRef<ReturnType<typeof createVideoPlayer> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const playFromStart = useCallback(async () => {
  //   const p = playerRef.current;
  //   if (!p) return;
  //   try {
  //     await p.seekTo(0);
  //     await p.play();
  //   } catch {}
  // }, []);
  //
  // useEffect(() => {
  //   let cancelled = false;
  //
  //   const setupVideo = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);
  //
  //       const asset = Asset.fromModule(require('@/assets/background.mp4'));
  //       await asset.downloadAsync();
  //
  //       if (cancelled) return;
  //
  //       const p = createVideoPlayer({ uri: asset.uri, useCaching: true });
  //       p.loop = true;
  //       p.muted = true;
  //
  //       playerRef.current = p;
  //       setIsLoading(false);
  //
  //       if (isFocused) await playFromStart();
  //     } catch (e) {
  //       if (!cancelled) {
  //         setError(e instanceof Error ? e.message : 'Failed to load video');
  //         setIsLoading(false);
  //       }
  //     }
  //   };
  //
  //   setupVideo();
  //
  //   return () => {
  //     cancelled = true;
  //     playerRef.current?.pause();
  //     playerRef.current = null;
  //   };
  // }, [isFocused, playFromStart]);
  //
  // useFocusEffect(
  //     useCallback(() => {
  //       playFromStart();
  //       return () => {
  //         playerRef.current?.pause();
  //       };
  //     }, [playFromStart])
  // );

  return (
      <View className="flex-1 bg-black">
        {isFocused && playerRef.current && !isLoading && !error && (
            <VideoView
                player={playerRef.current}
                contentFit="cover"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width, height }}
                pointerEvents="none"
            />
        )}

        <View className="absolute inset-0 bg-black/50" />

        {isLoading && (
            <View className="absolute inset-0 items-center justify-center bg-black">
              <Text className="text-yellow-400 text-base">Loading video...</Text>
            </View>
        )}

        {error && (
            <View className="absolute inset-0 items-center justify-center bg-black px-5">
              <Text className="text-red-500 text-base text-center">{error}</Text>
            </View>
        )}

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
