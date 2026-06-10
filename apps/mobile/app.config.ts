import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '온고지식',
  slug: 'ongo-jishik',
  owner: 'ongosub',
  version: '1.0.0',
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
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#FAFAF8',
    },
    package: 'com.ongo.jishik',
  },
  web: {
    favicon: './assets/icons/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-asset',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '1f66cc22-71c5-4739-9581-289321418e67',
    },
  },
});
