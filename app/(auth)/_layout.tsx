import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
} 