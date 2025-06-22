import { Stack, usePathname } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/auth';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

// Create a client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {

    if (!isLoading) {
      if (!isAuthenticated && pathname.startsWith('/(app)')) {
        router.replace('/(auth)/login');
      }
      else if (isAuthenticated && pathname.startsWith('/(auth)')) {
        router.replace('/(app)/home');
      }
    }
  }, [isAuthenticated, isLoading, pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const showHeader = isAuthenticated && !pathname.startsWith('/(auth)');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} edges={['top', 'right', 'left', 'bottom']}>
      {showHeader && <Header />}
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const stripePublishableKey = Constants.expoConfig?.extra?.stripePublishableKey || 
                               process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                               'pk_test_51RcORgQNQzgpRy5D5AV81esv2BFmR8iHf6ZlOWYboI0QKojynk9k4orPv6o9HePTYUblRw33GpIiHCsSCTxdmi8R00pgai0vOe';

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      merchantIdentifier="merchant.com.zivo.app" // For Apple Pay
    >
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}
