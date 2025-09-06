import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface MediaInfoProps {
  description: string;
  reward: number;
  uploader: string;
  tags: Array<{ id: string; name: string }>;
  onClose: () => void;
}

export default function MediaInfo({ description, reward, uploader, tags, onClose }: MediaInfoProps) {
  const safeReward = reward || 0;
  const rewardInDollars = (safeReward / 100).toFixed(2);

  return (
    <View style={{ 
      backgroundColor: '#000000F2', 
      borderRadius: 12, 
      padding: 24, 
      borderWidth: 1, 
      borderColor: '#FFFF0050' 
    }}>
      {/* Header with close button */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24 
      }}>
        <Text style={{ 
          color: '#FFFF00', 
          fontWeight: 'bold', 
          fontSize: wp('5%') 
        }}>
          Media Details
        </Text>
        <TouchableOpacity 
          onPress={onClose} 
          style={{ 
            backgroundColor: '#FFFF0020', 
            borderRadius: 999, 
            padding: 8 
          }}
          activeOpacity={0.7}
        >
          <XMarkIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          color: '#FFFFFF', 
          lineHeight: 28, 
          fontWeight: '500', 
          fontSize: wp('4.2%') 
        }}>
          {description}
        </Text>
      </View>

      {/* Prominent Stats Section */}
      <View style={{ 
        backgroundColor: '#FFFF0030', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        borderWidth: 2, 
        borderColor: '#FFFF00',
        minHeight: 80,
        justifyContent: 'center'
      }}>
        <View style={{ alignItems: 'center' }}>
          {/* Reward */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ 
              color: '#FFFF00', 
              fontWeight: 'bold', 
              marginBottom: 8, 
              fontSize: wp('5%'),
              textAlign: 'center'
            }}>
              ${rewardInDollars}
            </Text>
            <Text style={{ 
              color: '#FFFFFF', 
              fontWeight: '600', 
              fontSize: wp('3.5%'),
              textAlign: 'center'
            }}>
              AWS Voucher Reward
            </Text>
          </View>
        </View>
      </View>

      {/* Uploader Info */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          color: '#FFFF00', 
          fontWeight: '600', 
          marginBottom: 8, 
          fontSize: wp('3.5%') 
        }}>
          Uploaded by
        </Text>
        <Text style={{ 
          color: '#FFFFFF', 
          fontWeight: '500', 
          fontSize: wp('4%') 
        }}>
          {uploader}
        </Text>
      </View>

      {/* Tags */}
      <View>
        <Text style={{ 
          color: '#FFFF00', 
          fontWeight: '600', 
          marginBottom: 12, 
          fontSize: wp('3.5%') 
        }}>
          Tags
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: 8 
        }}>
          {tags.map((tag) => (
            <View 
              key={tag.id} 
              style={{ 
                backgroundColor: '#FFFF0020', 
                borderWidth: 1, 
                borderColor: '#FFFF0050', 
                borderRadius: 999, 
                paddingHorizontal: 16, 
                paddingVertical: 8 
              }}
            >
              <Text style={{ 
                color: '#FFFF00', 
                fontWeight: '500', 
                fontSize: wp('3.5%') 
              }}>
                #{tag.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
} 