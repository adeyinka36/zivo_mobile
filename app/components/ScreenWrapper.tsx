import { Platform, ViewStyle, StyleProp } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  isAuthScreen?: boolean;
}

export default function ScreenWrapper({ 
  children, 
  style,
  contentContainerStyle,
  backgroundColor = '#000000',
  isAuthScreen = false
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[{
        flexGrow: 1,
        justifyContent: isAuthScreen ? 'center' : 'flex-start',
        alignItems: 'center',
        padding: wp('4%'),
        paddingBottom: Math.max(
          Platform.OS === 'ios' ? hp('15%') : hp('10%'),
          insets.bottom + hp('5%')
        ),
        backgroundColor: backgroundColor,
      }, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={Platform.OS === 'ios' ? 120 : 80}
      extraScrollHeight={Platform.OS === 'ios' ? 120 : 80}
      showsVerticalScrollIndicator={false}
      keyboardOpeningTime={0}
      keyboardDismissMode="none"
      enableResetScrollToCoords={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
} 