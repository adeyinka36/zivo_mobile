import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface DeleteConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  mediaName?: string;
}

export default function DeleteConfirmModal({
  visible,
  onConfirm,
  onCancel,
  title = "Delete Media",
  message = "Are you sure you want to delete this media?",
  mediaName
}: DeleteConfirmModalProps) {
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
      onRequestClose={onCancel}
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
            borderColor: '#FF4444',
            shadowColor: '#FF4444',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <View style={{
            backgroundColor: '#FF4444',
            borderRadius: 50,
            padding: wp('3%'),
            marginBottom: hp('2%'),
          }}>
            <ExclamationTriangleIcon color="#FFFFFF" size={wp('12%')} />
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
            marginBottom: hp('1%'),
          }}>
            {message}
          </Text>

          {mediaName && (
            <Text style={{
              color: '#FFFF00',
              fontSize: Math.max(12, wp('3%')),
              textAlign: 'center',
              fontStyle: 'italic',
              marginBottom: hp('3%'),
            }}>
              "{mediaName}"
            </Text>
          )}

          <View style={{ flexDirection: 'row', gap: wp('3%') }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                backgroundColor: '#333333',
                borderRadius: 12,
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('6%'),
                minWidth: wp('25%'),
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: Math.max(14, wp('3.5%')),
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                backgroundColor: '#FF4444',
                borderRadius: 12,
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('6%'),
                minWidth: wp('25%'),
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: Math.max(14, wp('3.5%')),
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
} 