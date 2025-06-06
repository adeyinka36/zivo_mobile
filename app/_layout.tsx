import { Stack, usePathname } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/auth';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';

// Create a client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    console.log('Auth state:', {
      isAuthenticated,
      isLoading,
      pathname,
      isAuthRoute: pathname.startsWith('/(auth)')
    });

    if (!isLoading) {
      // Only redirect to login if trying to access protected (app) routes while not authenticated
      if (!isAuthenticated && pathname.startsWith('/(app)')) {
        console.log('Not authenticated, redirecting to login');
        router.replace('/(auth)/login');
      }
      // Redirect to home if authenticated and trying to access auth routes
      else if (isAuthenticated && pathname.startsWith('/(auth)')) {
        console.log('Authenticated, redirecting to home');
        router.replace('/(app)/home');
      }
    }
  }, [isAuthenticated, isLoading, pathname]);

  if (isLoading) {
    console.log('Loading auth state...');
    return <LoadingScreen />;
  }

  // Only show header for authenticated users and not on auth screens
  const showHeader = isAuthenticated && !pathname.startsWith('/(auth)');
  console.log('Header visibility:', { showHeader, isAuthenticated, pathname });

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
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
