import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';

export interface AvatarProps {
  sourceUrl?: string;
  name: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ sourceUrl, name, size = 40, style }) => {
  const { colors } = useTheme();
  
  const initials = name.trim().charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primaryLight,
        },
        style,
      ]}
    >
      {sourceUrl ? (
        <Image
          source={{ uri: sourceUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text bold style={{ color: colors.primary, fontSize: size * 0.45 }}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
