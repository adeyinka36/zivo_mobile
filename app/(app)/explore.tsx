import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from '@/utils/getUrls';

interface Media {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  created_at: string;
  user: {
    name: string;
    username: string;
  };
}

const fetchMedia = async ({ pageParam = 1, searchQuery = '' }) => {
  const response = await axios.get(`${BASE_URL}/api/media`, {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
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

  const renderMediaItem = ({ item }: { item: Media }) => (
    <View className="mb-6 px-4">
      <Image
        source={{ uri: item.thumbnail_url || item.url }}
        className="rounded-lg"
        style={{
          width: wp('92%'),
          height: hp('40%'),
        }}
        resizeMode="cover"
      />
      <View className="mt-2">
        <Text className="text-primary font-bold" style={{ fontSize: wp('4%') }}>
          {item.title}
        </Text>
        <Text className="text-primary/80" style={{ fontSize: wp('3.5%') }}>
          by {item.user.name} (@{item.user.username})
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator color="#FFFF00" size="large" />
      </View>
    );
  };

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
        <FlatList
          data={data?.pages.flatMap((page) => page.data)}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('5%') }}
        />
      )}
    </View>
  );
} 