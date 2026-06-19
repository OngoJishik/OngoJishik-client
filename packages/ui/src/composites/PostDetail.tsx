import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useTheme } from '../../theme/useTheme';
import { Avatar } from '../primitives/Avatar';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { PhotoGallery } from './PhotoGallery';
import { RecipeLink } from './RecipeLink';
import { formatDate } from '@ongo/utils';

export interface PostDetailProps {
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  category?: string;
  images: string[];
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  linkedRecipe?: { id: string; nameKo: string; emoji: string; description?: string; isClickable?: boolean };
  onLike: () => void;
  onRecipePress?: () => void;
  title?: string;
}

/**
 * 커뮤니티 게시글 상세 조회를 위한 전용 레이아웃 컴포넌트
 * @author Antigravity
 */
export const PostDetail: React.FC<PostDetailProps> = ({
  author,
  createdAt,
  category,
  images,
  content,
  likeCount,
  commentCount,
  isLiked,
  linkedRecipe,
  onLike,
  onRecipePress,
  title,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Author Row */}
      <View style={styles.authorRow}>
        <Avatar name={author.name} sourceUrl={author.avatarUrl} size={40} />
        <View style={styles.authorInfo}>
          <Text variant="label" bold style={{ color: colors.text }}>
            {author.name}
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
            {formatDate(createdAt)} {category ? `· ${category}` : ''}
          </Text>
        </View>
      </View>

      {/* PhotoGallery */}
      {images && images.length > 0 && (
        <PhotoGallery images={images} />
      )}

      {/* Engagement Buttons Row */}
      <View style={[styles.engagementRow, { borderBottomColor: colors.border, borderTopColor: colors.border }]}>
        <Pressable style={styles.engageBtn} onPress={onLike}>
          <Icon
            name={isLiked ? 'heart-filled' : 'heart'}
            size={20}
            color={isLiked ? colors.primary : colors.textSecondary}
          />
          <Text variant="body" bold style={[styles.engageText, { color: isLiked ? colors.primary : colors.textSecondary }]}>
            {likeCount}
          </Text>
        </Pressable>

        <View style={styles.engageBtn}>
          <Icon name="comment" size={20} color={colors.textSecondary} />
          <Text variant="body" bold style={[styles.engageText, { color: colors.textSecondary }]}>
            {commentCount}
          </Text>
        </View>
      </View>

      {/* Title */}
      {title && (
        <Text variant="h3" bold style={{ color: colors.text, marginBottom: 8, fontSize: 16 }}>
          {title}
        </Text>
      )}

      {/* Post Content */}
      <Text variant="body" style={[styles.content, { color: colors.text }]}>
        {content}
      </Text>

      {/* RecipeLink Card */}
      {linkedRecipe && (
        <RecipeLink
          foodId={linkedRecipe.id}
          nameKo={linkedRecipe.nameKo}
          emoji={linkedRecipe.emoji}
          description={linkedRecipe.description || ''}
          onPress={onRecipePress}
          isClickable={linkedRecipe.isClickable}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    marginLeft: 12,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  engageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  engageText: {
    marginLeft: 6,
    fontSize: 14,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
});
