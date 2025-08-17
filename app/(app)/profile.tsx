import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, ArrowRightOnRectangleIcon, PlayIcon, TrashIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '@/hooks/useAuth';
import { ProfileService } from '../../services/profileService';
import ProfileHeader from '../components/ProfileHeader';
import UserMediaGrid from '../components/UserMediaGrid';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import type { UserProfile, UserMedia, ProfileFormData } from '../../types/profile';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userMedia, setUserMedia] = useState<UserMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<UserMedia | null>(null);

  const loadProfileData = useCallback(async () => {
    try {
      const profileData = await ProfileService.getProfile();
      setProfile(profileData.user);
      setUserMedia(profileData.media);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  }, [loadProfileData]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleUpdateProfile = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      const updatedProfile = await ProfileService.updateProfile(data);
      setProfile(updatedProfile);
      if (setUser && user) {
        setUser({ 
          ...user, 
          name: updatedProfile.name
        });
      }
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMedia = (mediaId: string) => {
    const media = userMedia.find(m => m.id === mediaId);
    if (media) {
      setMediaToDelete(media);
      setDeleteModalVisible(true);
    }
  };

  const confirmDeleteMedia = async () => {
    if (!mediaToDelete) return;

    setIsDeleting(true);
    try {
      await ProfileService.deleteMedia(mediaToDelete.id);
      setUserMedia(prev => prev.filter(m => m.id !== mediaToDelete.id));
      Alert.alert('Success', 'Media deleted successfully');
    } catch (error) {
      console.error('Failed to delete media:', error);
      Alert.alert('Error', 'Failed to delete media');
    } finally {
      setIsDeleting(false);
      setDeleteModalVisible(false);
      setMediaToDelete(null);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={{ padding: wp('4%') }}>
      <ProfileHeader
        user={profile!}
        onUpdateProfile={handleUpdateProfile}
        isLoading={isUpdating}
      />

      <View style={{ marginBottom: hp('2%') }}>
        <Text style={{
          color: '#FFFF00',
          fontSize: Math.max(18, wp('4.5%')),
          fontWeight: 'bold',
          marginBottom: hp('2%'),
        }}>
          Your Media ({userMedia.length})
        </Text>
      </View>
    </View>
  );

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
          onPress={() => handleDeleteMedia(item.id)}
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

  const renderEmptyState = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: hp('10%') }}>
      <Text style={{ color: '#CCCCCC', fontSize: Math.max(16, wp('4%')), textAlign: 'center' }}>
        No media uploaded yet
      </Text>
      <Text style={{ color: '#888888', fontSize: Math.max(14, wp('3.5%')), textAlign: 'center', marginTop: hp('1%') }}>
        Start creating content to see it here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFFF00', fontSize: Math.max(16, wp('4%')), marginBottom: hp('2%') }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FF4444', fontSize: Math.max(16, wp('4%')), marginBottom: hp('2%') }}>
          Failed to load profile
        </Text>
        <TouchableOpacity
          onPress={loadProfileData}
          style={{
            backgroundColor: '#FFFF00',
            paddingHorizontal: wp('6%'),
            paddingVertical: hp('1.5%'),
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#000000', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('1%'),
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon color="#FFFF00" size={wp('6%')} />
        </TouchableOpacity>
        
        <Text style={{
          color: '#FFFF00',
          fontSize: Math.max(18, wp('4.5%')),
          fontWeight: 'bold',
        }}>
          Profile
        </Text>
        
        <TouchableOpacity onPress={handleLogout}>
          <ArrowRightOnRectangleIcon color="#FF4444" size={wp('6%')} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={userMedia}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: wp('4%') }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('5%') }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FFFF00']}
            tintColor="#FFFF00"
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onConfirm={confirmDeleteMedia}
        onCancel={() => {
          setDeleteModalVisible(false);
          setMediaToDelete(null);
        }}
        mediaName={mediaToDelete?.name}
      />
    </View>
  );
} 