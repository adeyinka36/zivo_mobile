import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { EyeIcon, InformationCircleIcon, CheckCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MediaInfo from './MediaInfo';
import MediaPlayer from './MediaPlayer';
import { truncateDescription } from '@/utils/textUtils';

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

interface MediaItemProps {
  item: Media;
  index: number;
  visibleIndex: number;
  selectedMedia: Media | null;
  heights: {
    availableHeight: number;
    infoSectionHeight: number;
  };
  onEyePress: (media: Media) => void;
  onInfoPress: (media: Media) => void;
  onCloseMediaInfo: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  item,
  index,
  visibleIndex,
  selectedMedia,
  heights,
  onEyePress,
  onInfoPress,
  onCloseMediaInfo,
}) => {
  const totalItemHeight = heights.availableHeight + heights.infoSectionHeight;

  return (
    <View style={{ height: totalItemHeight }}>
      <View style={{ height: heights.availableHeight }}>
        <MediaPlayer 
          media={item} 
          index={index} 
          visibleIndex={visibleIndex} 
        />

        {/* Permanent dark overlay for better button visibility */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#00000070'
        }} />

        <TouchableOpacity 
          onPress={() => onEyePress(item)} 
          style={{ position: 'absolute', top: '45%', left: '45%', zIndex: 10 }}
        >
          <EyeIcon color="#FFFF00" size={Math.max(24, wp('8%'))} />
        </TouchableOpacity>
        
        {item.has_watched && (
          <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <CheckCircleIcon color="#00FF00" size={Math.max(16, wp('10%'))} />
          </View>
        )}

        <View style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <Text style={{ color: '#FFFF00', fontSize: Math.max(12, wp('3%')), fontWeight: 'bold' }}>
            Uploader: {item.uploader_username}
          </Text>
        </View>
        
        {selectedMedia?.id === item.id && (
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: '#000000F5', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 20 
          }}>
            <View style={{ width: '98%', padding: 20 }}>
              <MediaInfo
                description={item.description}
                reward={item.reward}
                uploader="Unknown"
                tags={item.tags}
                view_count={item.view_count}
                onClose={onCloseMediaInfo}
              />
            </View>
          </View>
        )}
      </View>
      
      <View style={{ 
        height: heights.infoSectionHeight, 
        padding: 16, 
        backgroundColor: '#000', 
        borderTopColor: '#333', 
        borderTopWidth: 1 
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ 
              color: '#FFFF00', 
              fontSize: Math.max(14, wp('3.5%')), 
              marginBottom: 8 
            }} numberOfLines={2}>
              {truncateDescription(item.description)}
            </Text>

            {item.tags && item.tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                {item.tags.slice(0, 3).map(tag => (
                  <View 
                    key={tag.id} 
                    style={{ 
                      backgroundColor: '#FFFF00', 
                      borderRadius: 999, 
                      paddingVertical: 4, 
                      paddingHorizontal: 10, 
                      marginRight: 8, 
                      marginBottom: 4 
                    }}
                  >
                    <Text style={{ 
                      color: '#000', 
                      fontWeight: '600', 
                      fontSize: Math.max(10, wp('2.5%')) 
                    }}>
                      #{tag.name}
                    </Text>
                  </View>
                ))}
                {item.tags.length > 3 && (
                  <Text style={{ 
                    color: '#AAA', 
                    fontSize: Math.max(10, wp('2.5%')), 
                    alignSelf: 'center', 
                    marginLeft: 4 
                  }}>
                    +{item.tags.length - 3} more
                  </Text>
                )}
              </View>
            )}
          </View>

          <TouchableOpacity 
            onPress={() => onInfoPress(item)} 
            style={{ padding: 10, backgroundColor: '#FFFF00', borderRadius: 999 }}
          >
            <InformationCircleIcon color="#000" size={Math.max(18, wp('5%'))} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MediaItem;
