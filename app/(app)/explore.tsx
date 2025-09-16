import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TextInput, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/context/auth';
import { useQuiz } from '@/context/QuizContext';
import FullScreenMedia from '@/components/FullScreenMedia';
import EmptyExploreState from '@/components/EmptyExploreState';
import MediaItem from '@/components/MediaItem';

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
  const { setQuizData } = useQuiz();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<Media | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
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

  // Remove shared video player - each video item now has its own player

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
      const response = await api.post(`/media-watched/${fullScreenMedia.id}/${user.id}`);
      
      if (response.data.trigger_quiz && response.data.quiz_data) {
        setQuizData(response.data.quiz_data);
        router.replace('/(app)/quiz-invite');
      }
    } catch (error) {
      console.error('Failed to record watch status:', error);
      queryClient.setQueryData(['media', debouncedSearch], previousData);
    }
  };




  const renderMediaItem = useCallback(({ item, index }: { item: Media; index: number }) => {
    const heights = getResponsiveHeights();
    
    return (
      <MediaItem
        item={item}
        index={index}
        visibleIndex={visibleIndex}
        selectedMedia={selectedMedia}
        heights={heights}
        onEyePress={handleEyePress}
        onInfoPress={handleInfoPress}
        onCloseMediaInfo={closeMediaInfo}
      />
    );
  }, [visibleIndex, selectedMedia, handleEyePress, handleInfoPress, closeMediaInfo, getResponsiveHeights]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage || !hasNextPage) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator color="#FFFF00" size="large" />
      </View>
    );
  }, [isFetchingNextPage, hasNextPage]);

  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newVisibleIndex = viewableItems[0].index;
      setVisibleIndex(newVisibleIndex);
    }
  }, []);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const allMedia = data?.pages?.flatMap((page) => page?.data || []) || [];
    const lastItemIndex = allMedia.length - 1;
    const heights = getResponsiveHeights();
    const totalItemHeight = heights.availableHeight + heights.infoSectionHeight;
    
    // Calculate the maximum scroll position (last item should be at the top)
    const maxScrollY = totalItemHeight * lastItemIndex;
    
    // If we're trying to scroll beyond the last item, prevent it
    if (contentOffset.y > maxScrollY) {
      flatListRef.current?.scrollToOffset({
        offset: maxScrollY,
        animated: false
      });
    }
  }, [data, getResponsiveHeights]);

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
      ) : data?.pages.flatMap((page) => page.data).length === 0 ? (
        <EmptyExploreState />
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
          onScroll={handleScroll}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          initialNumToRender={2}
          windowSize={3}
          overScrollMode="never"
          scrollEventThrottle={16}
          style={{ backgroundColor: '#000000' }}
          getItemLayout={(data, index) => ({
            length: totalItemHeight,
            offset: totalItemHeight * index,
            index,
          })}
          contentContainerStyle={{ backgroundColor: '#000000' }}
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