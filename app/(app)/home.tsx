import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MagnifyingGlassIcon, PlusCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { VideoView, createVideoPlayer } from 'expo-video';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Creating video player...');
        
        // Load the video asset
        const asset = Asset.fromModule(require('@/assets/background.mp4'));
        await asset.downloadAsync();
        
        const videoPlayer = await createVideoPlayer({
          uri: asset.uri,
          useCaching: true,
        });
        
        if (!mounted) return;
        
        console.log('Video player created, configuring...');
        videoPlayer.loop = true;
        videoPlayer.muted = true;
        
        console.log('Starting playback...');
        await videoPlayer.play();
        console.log('Playback started');
        
        if (mounted) {
          setPlayer(videoPlayer);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error setting up video:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Failed to load video');
          setIsLoading(false);
        }
      }
    };

    setupVideo();

    return () => {
      mounted = false;
      if (player) {
        console.log('Cleaning up video player...');
        player.pause();
      }
    };
  }, []);

  return (
    <View style={styles.contentContainer}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {player && !isLoading && !error && (
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
        />
      )}

      {/* Dark Overlay */}
      <View 
        className="absolute top-0 left-0 right-0 bottom-0 bg-black"
        style={{ opacity: 0.5 }}
      />
      
      <View className="flex-1 justify-center items-center px-6">
        {/* EXPLORE button */}
        <TouchableOpacity
          onPress={() => router.push('/explore')}
          className="bg-primary rounded-lg items-center justify-center shadow-lg"
          style={{
            width: wp('60%'),
            maxWidth: 400,
            padding: wp('4%'),
          }}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <MagnifyingGlassIcon color="#000000" size={wp('5%')} />
            <Text className="ml-2 text-background font-bold" style={{ fontSize: wp('4.5%') }}>
              EXPLORE
            </Text>
          </View>
        </TouchableOpacity>

        {/* CREATE button */}
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

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: width,
    height: height,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: '#FFFF00',
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
