import { Platform } from 'react-native';

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#4A463E',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {
      boxShadow: '0 1px 2px 0 rgba(74, 70, 62, 0.05)',
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#4A463E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    default: {
      boxShadow: '0 4px 6px -1px rgba(74, 70, 62, 0.1)',
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#4A463E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {
      boxShadow: '0 10px 15px -3px rgba(74, 70, 62, 0.15)',
    },
  }),
};
