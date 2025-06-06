import { View } from 'react-native';

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="mx-4 p-8 rounded-3xl bg-primary-dark/80 w-full max-w-md self-center shadow-lg">
      {children}
    </View>
  );
} 