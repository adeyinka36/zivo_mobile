import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/explore');
    }
  };

  const handleGoHome = () => {
    router.replace('/(app)/explore');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 404 Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>404</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Page Not Found</Text>

        {/* Description */}
        <Text style={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon color="#FFFF00" size={20} />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.7}
          >
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFF00',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFF00',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButtonText: {
    color: '#FFFF00',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#FFFF00',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  homeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
}); 