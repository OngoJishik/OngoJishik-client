import React from 'react';

import { PostCard } from '@ongo/ui';
import { useFoodDetailQuery } from '@ongo/api-client';
import type { TBoardSummary } from '@ongo/api-client';

import { MOCK_FOODS } from '../../../mocks';

export type CommunityPostCardProps = {
  item: TBoardSummary;
  getCategoryLabel: (category?: any) => string;
  onPress: () => void;
  onLike: () => void;
};

/**
 * 커뮤니티 목록에서 각 게시글 카드를 렌더링하고, 연계된 레시피 정보를 동적으로 조회하여 전달하는 컨테이너 컴포넌트
 * @author Antigravity
 */
export const CommunityPostCard = ({
  item,
  getCategoryLabel,
  onPress,
  onLike,
}: CommunityPostCardProps) => {
  const recipeId = item.recipeId;

  // 레시피 연결이 DB ID(숫자로만 구성됨) 또는 개발용 mock ID인지 확인
  const hasValidSystemId = !!recipeId && (
    /^\d+$/.test(recipeId) ||
    ['yukgaejang', 'gujelpan'].includes(recipeId)
  );

  const { data: foodDetail } = useFoodDetailQuery(
    hasValidSystemId ? (recipeId ?? '') : ''
  );

  const mockFoodDetail = recipeId === 'yukgaejang' ? MOCK_FOODS[0] : (
    MOCK_FOODS.find((f) => f.id === recipeId)
  );

  const activeFoodDetail = foodDetail || (mockFoodDetail ? {
    id: mockFoodDetail.id,
    nameKo: mockFoodDetail.nameKo,
    emoji: mockFoodDetail.emoji,
  } : null);

  const getLinkedRecipeData = () => {
    if (!recipeId) return undefined;

    if (hasValidSystemId) {
      if (activeFoodDetail) {
        return {
          id: activeFoodDetail.id,
          nameKo: activeFoodDetail.nameKo,
          emoji: activeFoodDetail.emoji || '🍲',
        };
      }
      return undefined;
    }

    // 사용자 직접 입력 한 줄 레시피 제목인 경우
    return {
      id: 'custom',
      nameKo: recipeId,
      emoji: '🍽️',
    };
  };

  return (
    <PostCard
      author={{ name: item.authorNickname || '익명' }}
      createdAt={item.createdAt}
      category={getCategoryLabel(item.category)}
      images={item.imageUrls}
      content=""
      title={item.title}
      likeCount={item.likeCount}
      commentCount={item.commentCount}
      isLiked={item.isLiked}
      onPress={onPress}
      onLike={onLike}
      linkedRecipe={getLinkedRecipeData()}
    />
  );
};
