import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Text } from './Text';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';

export interface AvatarProps {
  sourceUrl?: string;
  name: string;
  size?: number;
  style?: ViewStyle;
}

/**
 * 사용자 프로필 이미지를 표시하는 아바타 프리미티브 컴포넌트
 * 이미지가 없을 시 이름의 이니셜을 표시합니다.
 * @author Antigravity
 */
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
          contentFit="cover"
          transition={200}
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
