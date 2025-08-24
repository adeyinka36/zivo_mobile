import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Image, TextInput, ActivityIndicator, Dimensions, TouchableOpacity, Animated, Platform, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MagnifyingGlassIcon, EyeIcon, InformationCircleIcon, CheckCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/context/auth';
import MediaInfo from '@/components/MediaInfo';
import FullScreenMedia from '@/components/FullScreenMedia';
import { VideoView } from 'expo-video';
import  useOptimizedVideoPlayer  from '../hooks/useOptimizedVideoPlayer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useEventListener } from 'expo';

interface Media {
  id: string;
  name: string;
  file_name: string;
  mime_type: string;
  media_type: string;
  reward: number;
  url: string;
  description: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  created_at: string;
  updated_at: string;
  has_watched: boolean;
  thumbnail: string | null;
  uploader_id: string;
  uploader_username: string;
  view_count: number;
}

const fetchMedia = async ({ pageParam = 1, searchQuery = '' }) => {
  const response = await api.get('/media', {
    params: {
      page: pageParam,
      per_page: 20,
      search: searchQuery,
    },
  });
  return response.data;
};

export default function ExploreScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<Media | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const getResponsiveHeights = useCallback(() => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const searchBarHeight = Math.max(60, hp('8%'));
    const topInset = insets.top || 0;
    const bottomInset = insets.bottom || 0;
    const infoSectionHeight = 183;
    const availableHeight = screenHeight - searchBarHeight - topInset - infoSectionHeight;

    return {
      searchBarHeight,
      availableHeight,
      infoSectionHeight,
      topInset,
      bottomInset,
      screenHeight,
      screenWidth
    };
  }, [insets.top, insets.bottom]);

  useEffect(() => {
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
      if (lastPage.meta?.current_page && lastPage.meta?.last_page) {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const allMedia = data?.pages?.flatMap((page) => page?.data || []) || [];
    const currentMedia = allMedia[visibleIndex];
    if (currentMedia?.media_type === 'video' && visibleIndex >= 0) {
      setCurrentVideoUrl(currentMedia.url);
    } else {
      setCurrentVideoUrl(null);
    }
  }, [visibleIndex, data]);

  const { player } = useOptimizedVideoPlayer({
    url: currentVideoUrl || '',
    shouldPlay: !!currentVideoUrl,
    loop: true,
    muted: true,
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['media', debouncedSearch] });
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, debouncedSearch]);

  const handleEyePress = (media: Media) => {
    setFullScreenMedia(media);
    setVisibleIndex(-1);
  };

  const handleInfoPress = (media: Media) => {
    setSelectedMedia(media);
  };

  const closeMediaInfo = () => {
    setSelectedMedia(null);
  };

  const closeFullScreen = () => {
    setFullScreenMedia(null);
    setVisibleIndex(0);
  };

  const handleWatchComplete = async () => {
    if (!fullScreenMedia || !user) return;
    if (fullScreenMedia.uploader_id === user.id) return;
    
    const previousData = queryClient.getQueryData(['media', debouncedSearch]);
    
    queryClient.setQueryData(['media', debouncedSearch], (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((item: Media) => 
            item.id === fullScreenMedia.id 
              ? { ...item, has_watched: true }
              : item
          )
        }))
      };
    });
    
    try {
     await api.post(`/media-watched/${fullScreenMedia.id}/${user.id}`)
    } catch (error) {
      console.error('Failed to record watch status:', error);
      queryClient.setQueryData(['media', debouncedSearch], previousData);
    }
  };

  const truncateDescription = (description: string) => {
    if (description.length <= 25) return description;
    return description.substring(0, 25) + '...';
  };

  const VideoPlayer = useCallback(({ media, index }: { media: Media; index: number }) => {
    const isVisible = visibleIndex === index;
    const isVideo = media.media_type === 'video';

    if (!isVideo) {
      return (
        <Image
          source={{ uri: media.thumbnail || media.url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      );
    }

    if (!isVisible) {
      return (
        <Image
          source={{ uri: media.thumbnail || media.url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      );
    }

    return (
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />
    );
  }, [visibleIndex, player]);

  const MediaPlayer = useCallback(({ media, index }: { media: Media; index: number }) => {
    if (media.media_type === 'video') {
      return <VideoPlayer media={media} index={index} />;
    }
    return (
      <Image
        source={{ uri: media.thumbnail || media.url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    );
  }, [VideoPlayer]);

  const renderMediaItem = useCallback(({ item, index }: { item: Media; index: number }) => {
    const heights = getResponsiveHeights();
    const totalItemHeight = heights.availableHeight + heights.infoSectionHeight;

    return (
      <View style={{ height: totalItemHeight }}>
        <View style={{ height: heights.availableHeight }}>
          <MediaPlayer media={item} index={index} />

          {/* Permanent dark overlay for better button visibility */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#00000070'
          }} />

          <TouchableOpacity onPress={() => handleEyePress(item)} style={{ position: 'absolute', top: '45%', left: '45%', zIndex: 10 }}>
            <EyeIcon color="#FFFF00" size={Math.max(24, wp('8%'))} />
          </TouchableOpacity>
          {item.has_watched && (
            <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
              <CheckCircleIcon color="#00FF00" size={Math.max(16, wp('10%'))} />
            </View>
          )}


            <View style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
              <Text style={{ color: '#FFFF00', fontSize: Math.max(12, wp('3%')), fontWeight: 'bold' }}>Uploader: {item.uploader_username}   </Text>
            </View>
          {selectedMedia?.id === item.id && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000000F5', justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
              <View style={{ width: '98%', padding: 20 }}>
                <MediaInfo
                  description={item.description}
                  reward={item.reward}
                  uploader="Unknown"
                  tags={item.tags}
                  view_count={item.view_count}
                  onClose={closeMediaInfo}
                />
              </View>
            </View>
          )}
        </View>
        <View style={{ height: heights.infoSectionHeight, padding: 16, backgroundColor: '#000', borderTopColor: '#333', borderTopWidth: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ color: '#FFFF00', fontSize: Math.max(14, wp('3.5%')), marginBottom: 8 }} numberOfLines={2}>
                {truncateDescription(item.description)}
              </Text>

              {item.tags && item.tags.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                  {item.tags.slice(0, 3).map(tag => (
                    <View key={tag.id} style={{ backgroundColor: '#FFFF00', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, marginRight: 8, marginBottom: 4 }}>
                      <Text style={{ color: '#000', fontWeight: '600', fontSize: Math.max(10, wp('2.5%')) }}>#{tag.name}</Text>
                    </View>
                  ))}
                  {item.tags.length > 3 && (
                    <Text style={{ color: '#AAA', fontSize: Math.max(10, wp('2.5%')), alignSelf: 'center', marginLeft: 4 }}>
                      +{item.tags.length - 3} more
                    </Text>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity onPress={() => handleInfoPress(item)} style={{ padding: 10, backgroundColor: '#FFFF00', borderRadius: 999 }}>
              <InformationCircleIcon color="#000" size={Math.max(18, wp('5%'))} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [visibleIndex, selectedMedia, handleEyePress, handleInfoPress, closeMediaInfo, getResponsiveHeights]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator color="#FFFF00" size="large" />
      </View>
    );
  }, [isFetchingNextPage]);

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

  const heights = getResponsiveHeights();
  const totalItemHeight = heights.availableHeight + heights.infoSectionHeight;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ height: heights.searchBarHeight, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: '#000000' }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#1c1c1c', borderRadius: 8, alignItems: 'center', paddingHorizontal: 12 }}>
          <MagnifyingGlassIcon color="#FFFF00" size={Math.max(20, wp('5%'))} />
          <TextInput
            style={{ flex: 1, marginLeft: 8, color: '#FFFF00', fontWeight: 'bold', fontSize: Math.max(14, wp('4%')), padding: 15 }}
            placeholder="Search media..."
            placeholderTextColor="#FFFF00"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
          <ActivityIndicator color="#FFFF00" size="large" />
        </View>
      ) : isError ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
          <Text style={{ color: 'red', fontSize: Math.max(14, wp('4%')) }}>Error loading media. Please try again.</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={data?.pages.flatMap((page) => page.data)}
          renderItem={renderMediaItem}
          keyExtractor={keyExtractor}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          snapToInterval={totalItemHeight}
          snapToAlignment="start"
          decelerationRate={Platform.OS === 'ios' ? 0.998 : 0.9}
          pagingEnabled={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={false}
          maxToRenderPerBatch={1}
          initialNumToRender={1}
          style={{ backgroundColor: '#000000' }}
          getItemLayout={(data, index) => ({
            length: totalItemHeight,
            offset: totalItemHeight * index,
            index,
          })}
          contentContainerStyle={{ paddingBottom: heights.bottomInset, backgroundColor: '#000000' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FFFF00']}
              tintColor="#FFFF00"
            />
          }
        />
      )}

      {fullScreenMedia && (
        <FullScreenMedia
          key={fullScreenMedia.id}
          media={{
            url: fullScreenMedia.url,
            media_type: fullScreenMedia.media_type as 'image' | 'video',
            description: fullScreenMedia.description,
            has_watched: fullScreenMedia.has_watched,
            uploader_id: fullScreenMedia.uploader_id,
            user_id: user?.id
          }}
          onClose={closeFullScreen}
          onWatchComplete={handleWatchComplete}
        />
      )}
    </View>
  );
}