import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export default function SuccessModal({ 
  visible, 
  onClose, 
  title = "Success!", 
  message = "Your media has been uploaded successfully!",
  buttonText = "Continue"
}: SuccessModalProps) {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            backgroundColor: '#1a1a1a',
            borderRadius: 20,
            padding: wp('8%'),
            margin: wp('4%'),
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFF00',
            shadowColor: '#FFFF00',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <View style={{ 
            backgroundColor: '#FFFF00', 
            borderRadius: 50, 
            padding: wp('3%'),
            marginBottom: hp('2%'),
          }}>
            <CheckCircleIcon color="#000000" size={wp('12%')} />
          </View>

          <Text style={{
            color: '#FFFFFF',
            fontSize: Math.max(20, wp('5%')),
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: hp('1%'),
          }}>
            {title}
          </Text>

          <Text style={{
            color: '#CCCCCC',
            fontSize: Math.max(14, wp('3.5%')),
            textAlign: 'center',
            lineHeight: Math.max(20, wp('5%')),
            marginBottom: hp('4%'),
          }}>
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: '#FFFF00',
              borderRadius: 12,
              paddingVertical: hp('2%'),
              paddingHorizontal: wp('8%'),
              minWidth: wp('40%'),
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: '#000000',
              fontSize: Math.max(16, wp('4%')),
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
} 