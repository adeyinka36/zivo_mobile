import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { PencilIcon, CheckIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import type { UserProfile, ProfileFormData } from '../../types/profile';

interface ProfileHeaderProps {
  user: UserProfile;
  onUpdateProfile: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileHeader({ user, onUpdateProfile, isLoading = false }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name,
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name });
    setIsEditing(false);
  };

  const renderField = (label: string, value: string, field: keyof ProfileFormData) => (
    <View style={{ marginBottom: hp('2%') }}>
      <Text style={{
        color: '#FFFF00',
        fontSize: Math.max(12, wp('3%')),
        fontWeight: 'bold',
        marginBottom: hp('0.5%'),
      }}>
        {label}
      </Text>
      
      {isEditing ? (
        <TextInput
          value={formData[field]}
          onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
          style={{
            backgroundColor: '#1a1a1a',
            borderWidth: 1,
            borderColor: '#333333',
            borderRadius: 8,
            paddingHorizontal: wp('3%'),
            paddingVertical: hp('1.5%'),
            color: '#FFFFFF',
            fontSize: Math.max(14, wp('3.5%')),
          }}
          placeholderTextColor="#888888"
          editable={!isLoading}
        />
      ) : (
        <Text style={{
          color: '#FFFFFF',
          fontSize: Math.max(14, wp('3.5%')),
          paddingVertical: hp('1.5%'),
        }}>
          {value}
        </Text>
      )}
    </View>
  );

  return (
    <View style={{
      backgroundColor: '#1a1a1a',
      borderRadius: 16,
      padding: wp('6%'),
      marginBottom: hp('3%'),
      borderWidth: 1,
      borderColor: '#333333',
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('3%') }}>
        <Text style={{
          color: '#FFFF00',
          fontSize: Math.max(20, wp('5%')),
          fontWeight: 'bold',
        }}>
          Profile Information
        </Text>
        
        {!isEditing ? (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={{
              backgroundColor: '#FFFF00',
              borderRadius: 20,
              padding: wp('2%'),
            }}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <PencilIcon color="#000000" size={wp('4%')} />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: wp('2%') }}>
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: '#00FF00',
                borderRadius: 20,
                padding: wp('2%'),
              }}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <CheckIcon color="#000000" size={wp('4%')} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleCancel}
              style={{
                backgroundColor: '#FF4444',
                borderRadius: 20,
                padding: wp('2%'),
              }}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <XMarkIcon color="#FFFFFF" size={wp('4%')} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {renderField('Username', user.name, 'name')}
      
      <View style={{ marginTop: hp('2%'), paddingTop: hp('2%'), borderTopWidth: 1, borderTopColor: '#333333' }}>
        <Text style={{
          color: '#888888',
          fontSize: Math.max(12, wp('3%')),
          marginBottom: hp('1%'),
        }}>
          Email: {user.email}
        </Text>
        <Text style={{
          color: '#888888',
          fontSize: Math.max(12, wp('3%')),
        }}>
          Member since {new Date(user.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
} 