import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Image, TextInput, ActivityIndicator, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MagnifyingGlassIcon, EyeIcon, InformationCircleIcon, CheckCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/context/auth';
import MediaInfo from '@/components/MediaInfo';
import FullScreenMedia from '@/components/FullScreenMedia';
import { VideoView } from 'expo-video';
import { useOptimizedVideoPlayer } from '@/hooks/useOptimizedVideoPlayer';

interface Media {
  id: string;
  name: string;
  file_name: string;
  mime_type: string;
  media_type: string;
  reward: number;
  url: string;
  description: string;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  created_at: string;
  updated_at: string;
  has_watched: boolean;
  thumbnail: string | null;
  user?: {
    name: string;
    username: string;
  };
}

const fetchMedia = async ({ pageParam = 1, searchQuery = '' }) => {
  const response = await api.get('/media', {
    params: {
      page: pageParam,
      per_page: 20,
      search: searchQuery,
    },
  });
  // Laravel resource collections return data directly, not wrapped in data.data
  return response.data;
};

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<Media | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['media', debouncedSearch],
    queryFn: ({ pageParam }) => fetchMedia({ pageParam, searchQuery: debouncedSearch }),
    getNextPageParam: (lastPage) => {
      // Laravel pagination structure: meta.current_page and meta.last_page
      if (lastPage.meta?.current_page && lastPage.meta?.last_page) {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleEyePress = (media: Media) => {
    setFullScreenMedia(media);
  };

  const handleInfoPress = (media: Media) => {
    setSelectedMedia(media);
  };

  const closeMediaInfo = () => {
    setSelectedMedia(null);
  };

  const closeFullScreen = () => {
    setFullScreenMedia(null);
  };

  const handleWatchComplete = async () => {
    if (!fullScreenMedia) return;
    
    try {
      // Record watch status via API
      await api.patch(`/media/${fullScreenMedia.id}/watch`);
      
      // Update local state to reflect the watch status
      // This will trigger a re-render and show the green checkmark
      console.log('Watch recorded for media:', fullScreenMedia.id);
      
      // Invalidate the media query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['media', debouncedSearch] });
    } catch (error) {
      console.error('Failed to record watch status:', error);
      // Even if the API call fails, we can still show the completion UI
      // The user will see the green checkmark in the UI
    }
  };

  // Truncate description to 25 characters
  const truncateDescription = (description: string) => {
    if (description.length <= 25) return description;
    return description.substring(0, 25) + '...';
  };

  // Simple video player that only renders for the visible item
  const VideoPlayer = useCallback(({ media }: { media: Media }) => {
    const { player } = useOptimizedVideoPlayer({
      url: media.url,
      shouldPlay: true, // Always play when rendered
      loop: true,
      muted: true,
    });

    return (
      <VideoView
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 0,
        }}
        player={player}
        contentFit="cover"
      />
    );
  }, []);

  // Optimized media player component
  const MediaPlayer = useCallback(({ media, index }: { media: Media; index: number }) => {
    const isVisible = index === visibleIndex;
    
    // Only render video for the currently visible item
    if (media.media_type === 'video' && isVisible) {
      return <VideoPlayer media={media} />;
    }

    // Show thumbnail for videos when not visible, or actual image for images
    return (
      <Image
        source={{ uri: media.thumbnail || media.url }}
        className="w-full h-full"
        style={{ borderRadius: 0 }}
        resizeMode="cover"
      />
    );
  }, [visibleIndex, VideoPlayer]);

  const renderMediaItem = useCallback(({ item, index }: { item: Media; index: number }) => (
    <View className="flex-1" style={{ height: Dimensions.get('window').height - 80 }}>
      {/* Media Container - Reduced height to make room for info */}
      <View className="relative" style={{ height: (Dimensions.get('window').height - 80) * 0.75 }}>
        <MediaPlayer media={item} index={index} />
        
        {/* Eye Icon Overlay - Centered */}
        <TouchableOpacity 
          onPress={() => handleEyePress(item)}
          className="absolute inset-0 justify-center items-center"
          activeOpacity={0.8}
        >
          <View className="bg-black/50 rounded-full p-3">
            <EyeIcon color="#FFFF00" size={32} />
          </View>
        </TouchableOpacity>

        {/* Watch Status Indicator */}
        {item.has_watched && (
          <View className="absolute top-4 right-4 bg-green-500 rounded-full p-1">
            <CheckCircleIcon color="#FFFFFF" size={20} />
          </View>
        )}

        {/* MediaInfo Overlay - Full Screen */}
        {selectedMedia?.id === item.id && (
          <View className="absolute inset-0 bg-black/90">
            <View className="flex-1 p-6 justify-center">
              <MediaInfo
                description={item.description}
                reward={item.reward}
                uploader={item.user?.name || 'Unknown'}
                tags={item.tags}
                onClose={closeMediaInfo}
              />
            </View>
          </View>
        )}
      </View>

      {/* Media Info Section - Always Visible */}
      <View className="flex-1 bg-black/90 backdrop-blur-sm p-4 border-t border-primary/20">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <Text className="text-primary font-bold mb-2" style={{ fontSize: wp('4.5%') }}>
              {item.name}
            </Text>
            <Text className="text-primary/90 leading-5" style={{ fontSize: wp('3.8%') }}>
              {item.description}
            </Text>
          </View>
          
          {/* Info Button */}
          <TouchableOpacity 
            onPress={() => handleInfoPress(item)}
            className="bg-primary rounded-full p-3 min-w-[44px] min-h-[44px] justify-center items-center"
            activeOpacity={0.7}
          >
            <InformationCircleIcon color="#000000" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [visibleIndex, selectedMedia, handleEyePress, handleInfoPress, closeMediaInfo]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator color="#FFFF00" size="large" />
      </View>
    );
  }, [isFetchingNextPage]);

  // Handle viewport changes to pause/play videos
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newVisibleIndex = viewableItems[0].index;
      setVisibleIndex(newVisibleIndex);
    }
  }, []);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }), []);

  const keyExtractor = useCallback((item: Media) => item.id.toString(), []);

  return (
    <View className="flex-1 bg-black">
      {/* Search Bar */}
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-black border border-primary rounded-lg px-4 py-2">
          <MagnifyingGlassIcon color="#FFFF00" size={wp('5%')} />
          <TextInput
            className="flex-1 ml-2 text-primary font-bold"
            placeholder="Search media..."
            placeholderTextColor="#FFFF00"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontSize: wp('4%') }}
          />
        </View>
      </View>

      {/* Media List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#FFFF00" size="large" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-error text-center" style={{ fontSize: wp('4%') }}>
            Error loading media. Please try again.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={data?.pages.flatMap((page) => page.data)}
            renderItem={renderMediaItem}
            keyExtractor={keyExtractor}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            snapToInterval={Dimensions.get('window').height - 80}
            snapToAlignment="center"
            decelerationRate="fast"
            pagingEnabled={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews={true}
            maxToRenderPerBatch={1}
            windowSize={3}
            initialNumToRender={1}
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').height - 80,
              offset: (Dimensions.get('window').height - 80) * index,
              index,
            })}
          />
        </>
      )}

      {/* Full Screen Media Overlay */}
      {fullScreenMedia && (
        <FullScreenMedia
          media={{
            url: fullScreenMedia.url,
            media_type: fullScreenMedia.media_type as 'image' | 'video',
            description: fullScreenMedia.description,
          }}
          onClose={closeFullScreen}
          onWatchComplete={handleWatchComplete}
        />
      )}
    </View>
  );
} 