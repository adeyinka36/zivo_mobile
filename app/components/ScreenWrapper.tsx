import { Platform, ViewStyle, StyleProp, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export default function ScreenWrapper({ 
  children, 
  style,
  contentContainerStyle,
  backgroundColor = '#000000'
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[{
            flexGrow: 1,
            justifyContent: 'center',
            padding: wp('4%'),
            paddingBottom: Math.max(
              Platform.OS === 'ios' ? hp('10%') : hp('5%'),
              insets.bottom + hp('2%')
            ),
            backgroundColor: backgroundColor,
          }, contentContainerStyle]}
          keyboardShouldPersistTaps="handled" 
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 