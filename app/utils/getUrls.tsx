import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = (): string => {
    console.log('getBaseUrl called');
    console.log('__DEV__:', __DEV__);
    console.log('Constants.expoConfig:', Constants.expoConfig);
    console.log('Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
    console.log('Constants.expoConfig?.extra?.devHost:', Constants.expoConfig?.extra?.devHost);
    
    // TEMPORARY: Force the correct URL since config reading isn't working
    const forcedUrl = 'http://192.168.1.159/api/v1';
    console.log('Using forced URL:', forcedUrl);
    return forcedUrl;
    
    // In development mode, attempt to use the extra.devHost value if it exists.
    if (__DEV__) {
        const devHost = Constants.expoConfig?.extra?.devHost;
        if (devHost) {
            return `http://${devHost}/api/v1`;
        }
    }
    
    // Fallback: for Android (emulator) use 10.0.2.2, for iOS use localhost.
    return Platform.OS === 'android'
        ? 'http://10.0.2.2/api/v1'
        : 'http://localhost/api/v1';
};

export const BASE_URL = getBaseUrl();

export default {
  BASE_URL,
};

