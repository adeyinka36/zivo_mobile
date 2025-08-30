import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function EmptyExploreState() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <MagnifyingGlassIcon color="#FFFF00" size={wp('15%')} />
      </Animated.View>
      
      <Text style={{ 
        color: '#FFFF00', 
        fontSize: Math.max(18, wp('4.5%')), 
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('1%')
      }}>
        No content to explore yet
      </Text>
      
      <Text style={{ 
        color: '#CCCCCC', 
        fontSize: Math.max(14, wp('3.5%')), 
        textAlign: 'center',
        paddingHorizontal: wp('10%')
      }}>
        Be the first to share something amazing! ✨
      </Text>
    </View>
  );
}
