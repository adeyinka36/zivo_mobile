import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
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
import NotificationManager from "@/components/NotificationManager";
import {NotificationProvider} from "@/context/NotificationContext";
import * as Linking from 'expo-linking';
import { QuizProvider } from '@/context/QuizContext';

// Create a client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && (pathname.startsWith('/(app)') || pathname === '/')) {
        router.replace('/(auth)/login');
      }
      else if (isAuthenticated && pathname.startsWith('/(auth)')) {
        router.replace('/(app)/home');
      }
    }
  }, [isAuthenticated, isLoading, pathname]);

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      // Handle deep link navigation here
      if (url.includes('quiz')) {
        router.push('/(app)/explore');
      }
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription?.remove();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const showHeader = isAuthenticated && !pathname.startsWith('/(auth)');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} edges={['top', 'right', 'left', 'bottom']}>
      {showHeader && <Header />}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' }
          }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' }
          }} 
        />
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
          <QuizProvider>
            <NotificationProvider>
              
              <RootLayoutNav />
              <NotificationManager />
           
            </NotificationProvider>
            </QuizProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}
