import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = (): string => {

    
    // TEMPORARY: Force the correct URL since config reading isn't working
    const forcedUrl = 'http://192.168.1.159/api/v1';
  
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

