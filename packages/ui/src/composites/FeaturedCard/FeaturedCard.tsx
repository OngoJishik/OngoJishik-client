import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { useTheme } from '../../../theme/useTheme';
import { formatFoodName } from '@ongo/utils';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { Text } from '../../primitives/Text';
import { styles } from './FeaturedCard.styles';
import { colors as designColors } from '../../../tokens/colors';
import { spacing } from '../../../tokens/spacing';

export type FeaturedCardProps = {
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  description: string;
  subtitle: string;
  onPress: () => void;
};

/**
 * 메인 홈 화면 등에서 사용되는 오늘의 추천 전통 음식 카드 컴포넌트
 * @author Antigravity
 */
export const FeaturedCard = ({
  nameKo,
  nameLocalized,
  emoji,
  imageUrl,
  description,
  subtitle,
  onPress,
}: FeaturedCardProps) => {
  const { colors } = useTheme();

  const displayName = formatFoodName(nameKo, nameLocalized);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Card style={StyleSheet.flatten([styles.card, { backgroundColor: colors.primary }])}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Badge label="오늘의 추천 전통 음식" variant="secondary" style={styles.badge} />
            <Text variant="h1" bold style={{ color: colors.background }}>
              {displayName}
            </Text>
            <Text variant="caption" style={{ color: designColors.neutral[100], marginVertical: spacing.xs }}>
              "{subtitle}"
            </Text>
            <Text variant="caption" numberOfLines={2} style={{ color: designColors.neutral[50] }}>
              {description}
            </Text>
          </View>
          <View style={[styles.imageContainer, { backgroundColor: colors.primaryLight }]}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <Text style={styles.emoji}>{emoji}</Text>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
