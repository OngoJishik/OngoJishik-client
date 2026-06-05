import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useTheme } from '../../theme/useTheme';
import { Card } from '../primitives/Card';
import { Text } from '../primitives/Text';
import { Icon } from '../primitives/Icon';

export interface RecipeLinkProps {
  foodId: string;
  nameKo: string;
  emoji: string;
  description: string;
  onPress: () => void;
}

/**
 * 게시글 내부에서 연계된 전통 음식 레시피로 이동할 수 있는 링크 카드 컴포넌트
 * @author Antigravity
 */
export const RecipeLink: React.FC<RecipeLinkProps> = ({
  nameKo,
  emoji,
  description,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card} bordered>
        <View style={styles.container}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={styles.content}>
            <Text variant="body" bold style={{ color: colors.text }}>
              {nameKo} 레시피 보기
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>
              {description}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textTertiary} />
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
});
