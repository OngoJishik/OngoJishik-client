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

export type PostCardProps = {
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  language?: string;
  images: string[];
  linkedRecipe?: { id: string; nameKo: string; emoji: string };
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  onPress: () => void;
  onLike: () => void;
  onShare: () => void;
};

/**
 * 커뮤니티 피드에서 각 게시글을 표시하는 카드 컴포넌트
 * @author Antigravity
 */
export const PostCard = ({
  author,
  createdAt,
  language,
  images,
  linkedRecipe,
  content,
  likeCount,
  commentCount,
  isLiked,
  onPress,
  onLike,
  onShare,
}: PostCardProps) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} bordered>
      <Pressable onPress={onPress}>
        <View style={styles.header}>
          <Avatar name={author.name} sourceUrl={author.avatarUrl} size={36} />
          <View style={styles.authorInfo}>
            <Text variant="label" bold>
              {author.name}
            </Text>
            <Text variant="caption">
              {formatDate(createdAt)} {language ? `• ${language}` : ''}
            </Text>
          </View>
        </View>

        {linkedRecipe && (
          <View style={[styles.recipeTag, { backgroundColor: colors.primaryLight }]}>
            <Text style={{ marginRight: spacing.xs }}>{linkedRecipe.emoji}</Text>
            <Text variant="caption" bold style={{ color: colors.primary }}>
              {linkedRecipe.nameKo} 레시피 연계
            </Text>
          </View>
        )}

        <Text variant="body" style={styles.content} numberOfLines={3}>
          {content}
        </Text>

        {images.length > 0 && (
          <Image
            source={{ uri: images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}
      </Pressable>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable style={styles.footerBtn} onPress={onLike}>
          <Icon name={isLiked ? 'heart-filled' : 'heart'} size={18} color={isLiked ? colors.primary : colors.textSecondary} />
          <Text variant="caption" style={styles.footerBtnText}>
            {likeCount}
          </Text>
        </Pressable>

        <Pressable style={styles.footerBtn} onPress={onPress}>
          <Icon name="community" size={18} color={colors.textSecondary} />
          <Text variant="caption" style={styles.footerBtnText}>
            {commentCount}
          </Text>
        </Pressable>

        <Pressable style={styles.footerBtn} onPress={onShare}>
          <Icon name="share" size={18} color={colors.textSecondary} />
          <Text variant="caption" style={styles.footerBtnText}>
            공유
          </Text>
        </Pressable>
      </View>
    </Card>
  );
};
