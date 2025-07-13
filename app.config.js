export default {
  expo: {
    name: 'Zivo',
    slug: 'zivo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
     
    scheme: 'zivo',
    splash: {
      image: './assets/images/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#000000'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.zivo.app',
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            '192.168.1.159': {
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSExceptionMinimumTLSVersion: '1.0',
            },
          },
        },
      },
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#000000'
      },
      package: 'com.zivo.app',
      edgeToEdgeEnabled: true,
      usesCleartextTraffic: true,
      permissions: ['android.permission.INTERNET'],
      googleServicesFile: "./google-services.json"
    },
    web: {
      favicon: './assets/images/logo.png',
      bundler: 'metro'
    },
    plugins: [
      [
        '@stripe/stripe-react-native',
        {
          merchantIdentifier: 'merchant.com.zivo.app',
          enableGooglePay: true
        }
      ],
      'expo-router',
      'expo-video',
      'react-native-video',
      [
        'expo-notifications',
        {
          icon: './assets/images/icon.png',
          color: '#ffffff',
          sounds: ['./assets/sounds/notification.wav']
        }
      ]
    ],
    extra: {
      devHost: '192.168.1.159',
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RcORgQNQzgpRy5D5AV81esv2BFmR8iHf6ZlOWYboI0QKojynk9k4orPv6o9HePTYUblRw33GpIiHCsSCTxdmi8R00pgai0vOe',
      eas: {
        projectId: '13c4d117-4774-4823-8b5b-f4ddf06d0d04'
      },
      router: {
        origin: false
      }
    }
  }
};
