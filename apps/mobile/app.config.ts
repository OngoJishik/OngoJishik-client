import path from 'path';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: '온고지식',
    slug: 'ongo-jishik',
    owner: 'ongosub',
    version: '1.2.1',
    orientation: 'portrait',
    icon: './assets/icons/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#FAFAF8', // Hanji base color
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.ongo.jishik',
        buildNumber: '4',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/icons/adaptive-icon.png',
            backgroundColor: '#FAFAF8',
        },
        package: 'com.ongo.jishik',
        versionCode: 4,
    },
    web: {
        favicon: './assets/icons/favicon.png',
    },
    plugins: [
        'expo-router',
        'expo-asset',
        'expo-image-picker',
        [
            '@react-native-google-signin/google-signin',
            {
                iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME || 'com.googleusercontent.apps.placeholder',
            },
        ],
        [
            'expo-build-properties',
            {
                android: {
                    compileSdkVersion: 35,
                    targetSdkVersion: 35,
                    buildToolsVersion: '35.0.0',
                },
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        eas: {
            projectId: '1f66cc22-71c5-4739-9581-289321418e67',
        },
        router: {
            // Absolute path ensures Expo Router finds the app/ dir correctly regardless of
            // which --project-root Expo CLI is invoked with (workspace root vs. apps/mobile).
            root: path.resolve(__dirname, 'app'),
        },
    },
});
