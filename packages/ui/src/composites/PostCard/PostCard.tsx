import React from 'react';
import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';

import { useTheme } from '../../../theme/useTheme';
import { Card } from '../../primitives/Card';
import { Avatar } from '../../primitives/Avatar';
import { Icon } from '../../primitives/Icon';
import { Text } from '../../primitives/Text';
import { styles } from './PostCard.styles';
import { spacing } from '../../../tokens/spacing';
import { formatDate } from '@ongo/utils';

import { colors as designColors } from '../../../tokens/colors';

export type PostCardProps = {
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  category?: string;
  images: string[];
  linkedRecipe?: { id: string; nameKo: string; emoji: string };
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  onPress: () => void;
  onLike: () => void;
  title?: string;
};

/**
 * 커뮤니티 피드에서 각 게시글을 표시하는 카드 컴포넌트
 * @author Antigravity
 */
export const PostCard = ({
  author,
  createdAt,
  category,
  images,
  linkedRecipe,
  content,
  likeCount,
  commentCount,
  isLiked,
  onPress,
  onLike,
  title,
}: PostCardProps) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} bordered>
      <Pressable onPress={onPress}>
        <View style={styles.header}>
          <Avatar name={author.name} sourceUrl={author.avatarUrl} size={36} />
          <View style={styles.authorInfo}>
            <Text variant="label" bold style={{ color: colors.text }}>
              {author.name}
            </Text>
            <Text variant="caption" style={[styles.authorSubtext, { color: colors.textTertiary }]}>
              {formatDate(createdAt)} {category ? `• ${category}` : ''}
            </Text>
          </View>
        </View>

        {images.length > 0 && (
          <Image
            source={{ uri: images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        {linkedRecipe && (
          <View style={[styles.recipeTag, { backgroundColor: colors.primary }]}>
            <Text style={{ marginRight: spacing.xs }}>{linkedRecipe.emoji}</Text>
            <Text variant="caption" style={[styles.recipeTagText, { color: designColors.white }]}>
              {linkedRecipe.nameKo} 레시피 연계
            </Text>
          </View>
        )}

        {title && (
          <Text variant="body" bold style={{ color: colors.text, marginBottom: spacing.xs }}>
            {title}
          </Text>
        )}

        <Text variant="body" style={[styles.content, { color: colors.text }]} numberOfLines={3}>
          {content}
        </Text>
      </Pressable>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable style={styles.footerBtn} onPress={onLike}>
          <Icon name={isLiked ? 'heart-filled' : 'heart'} size={18} color={isLiked ? colors.primary : colors.textTertiary} />
          <Text variant="caption" style={[styles.footerBtnText, { color: colors.textSecondary }]}>
            {likeCount}
          </Text>
        </Pressable>

        <Pressable style={styles.footerBtn} onPress={onPress}>
          <Icon name="comment" size={18} color={colors.textSecondary} />
          <Text variant="caption" style={[styles.footerBtnText, { color: colors.textSecondary }]}>
            {commentCount}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
};
