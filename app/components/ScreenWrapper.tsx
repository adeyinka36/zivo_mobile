import { Platform, ViewStyle, StyleProp } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
    <KeyboardAwareScrollView
      style={[{ flex: 1 }, style]}
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
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={20}
      extraScrollHeight={Platform.OS === 'ios' ? hp('10%') : hp('5%')}
      showsVerticalScrollIndicator={false}
      keyboardOpeningTime={0}
      keyboardDismissMode="on-drag"
    >
      {children}
    </KeyboardAwareScrollView>
  );
} 