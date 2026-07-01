import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Keyboard, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostDetail,
  CommentInput,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { userProfileAtom } from '@ongo/store';
import {
  useBoardDetailQuery,
  useDeleteBoardMutation,
  useBoardCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeMutation,
  useLikeCountQuery,
  useFoodDetailQuery,
} from '@ongo/api-client';

import { CommentItem } from './components/CommentItem';
import { PostMoreMenu } from './components/PostMoreMenu';
import { MOCK_POSTS, MOCK_COMMENTS, MOCK_FOODS, MOCK_DETAILS } from '../../mocks';
import type { TBoardCategory } from '@ongo/api-client';

// Android 15 edge-to-edge에서 일부 키보드(Gboard)는 IME 높이에 상단 추천/이모지 바를
// 포함하지 않고 보고한다. 그 결과 behavior="padding"만으로는 입력창이 추천 바에 가려지므로,
// 추천 바 한 줄 높이(~52px)만큼 추가로 띄운다. iOS는 보정이 필요 없어 0.
// (기기/키보드별로 추천 바 높이가 달라 필요 시 미세 조정)
//
// NOTE: KeyboardAvoidingView의 keyboardVerticalOffset으로 주면 안 된다. Android에서 키보드가
// 닫힐 때(keyboardDidHide)의 relativeKeyboardHeight 계산이 offset만큼 0이 아닌 값으로 남아
// 입력창이 원위치로 복귀하지 못한다. 따라서 offset은 0으로 두고, 키보드가 열려 있는 동안에만
// CommentInput 하단에 여백으로 적용한다.
const SUGGESTION_BAR_OFFSET = Platform.OS === 'android' ? 52 : 0;

/**
 * 커뮤니티 게시글 상세 및 댓글 조회/등록 화면 컴포넌트
 * @author Antigravity
 */
export const PostDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const boardId = parseInt(postId ?? '', 10);

  const getCategoryLabel = (category?: any) => {
    if (!category) return '';
    const categoryStr = typeof category === 'string' ? category : (category.id || category.code || category.name || String(category));
    if (!categoryStr || typeof categoryStr !== 'string') return '';
    switch (categoryStr.trim().toUpperCase()) {
      case 'REVIEW':
        return t('community.cookingReview');
      case 'RECIPE':
        return t('community.myRecipe');
      case 'QNA':
        return t('community.qna');
      default:
        return categoryStr;
    }
  };

  const userProfile = useAtomValue(userProfileAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const commentListRef = useRef<FlatList>(null);

  // 키보드가 열려 있는 동안에만 추천 바 여백을 적용하기 위해 가시성을 추적한다.
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 댓글 편집 진입 시 해당 행을 키보드 위로 올린다 (Android 15 edge-to-edge에서 adjustResize가
  // 무력화되어 입력창이 키보드에 가려지므로, 포커스/키보드 애니메이션 이후 명시적으로 스크롤).
  const handleEditStartScroll = (index: number) => {
    setTimeout(() => {
      commentListRef.current?.scrollToIndex({ index, viewPosition: 0, animated: true });
    }, 350);
  };

  // Queries & Mutations
  const isRealBoard = !isNaN(boardId);
  const { data: post, isLoading: isPostLoading } = useBoardDetailQuery(boardId);
  const { data: likeCountData } = useLikeCountQuery(boardId);
  const { data: commentsData } = useBoardCommentsQuery(boardId, 0, 50);

  useEffect(() => {
    if (post && post.isLiked !== undefined) {
      setIsLikedLocal(post.isLiked);
    }
  }, [post]);

  const { mutate: deleteBoard } = useDeleteBoardMutation();
  const { mutate: toggleLike } = useToggleLikeMutation();
  const { mutate: addComment } = useAddCommentMutation(boardId);
  const { mutate: updateComment } = useUpdateCommentMutation(boardId);
  const { mutate: deleteComment } = useDeleteCommentMutation(boardId);

  // Fallback to mock post if not a real board ID
  const mockPost = !isRealBoard ? (MOCK_POSTS.find((p) => p.id === postId) || MOCK_POSTS[0]) : null;
  const activePost = post || (mockPost ? {
    boardId: 9999,
    title: mockPost.title ?? 'Mock Post',
    content: mockPost.content,
    imageUrls: mockPost.images ?? [],
    authorId: 9999,
    authorNickname: mockPost.author.name,
    createdAt: mockPost.createdAt,
    updatedAt: mockPost.createdAt,
    category: mockPost.category as TBoardCategory,
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
    recipeId: mockPost.linkedRecipe?.id,
  } : null);

  // 레시피 연결이 DB ID(숫자로만 구성됨) 또는 개발용 mock ID인지 확인
  const hasValidSystemId = !!activePost?.recipeId && (
    /^\d+$/.test(activePost.recipeId) ||
    ['yukgaejang', 'gujelpan'].includes(activePost.recipeId)
  );
  const { data: foodDetail, isLoading: isFoodLoading } = useFoodDetailQuery(
    hasValidSystemId ? (activePost?.recipeId ?? '') : ''
  );

  const mockFoodDetail = activePost?.recipeId === 'yukgaejang' ? MOCK_DETAILS : (
    MOCK_FOODS.find((f) => f.id === activePost?.recipeId)
  );

  const activeFoodDetail = foodDetail || (mockFoodDetail ? {
    id: mockFoodDetail.id,
    nameKo: mockFoodDetail.nameKo,
    emoji: mockFoodDetail.emoji,
    description: 'description' in mockFoodDetail ? mockFoodDetail.description : '',
    source: 'source' in mockFoodDetail ? (mockFoodDetail.source as string) : '전통 조리법',
    recipeSteps: 'recipeSteps' in mockFoodDetail ? (mockFoodDetail.recipeSteps as any[]) : [],
  } : null);

  const getRecipeDescription = () => {
    if (!activeFoodDetail) return '';
    const sourceText = activeFoodDetail.source ? `${activeFoodDetail.source} 기반 전통 조리법` : '전통 조리법';
    const stepsText = activeFoodDetail.recipeSteps && activeFoodDetail.recipeSteps.length > 0
      ? ` · ${activeFoodDetail.recipeSteps.length}단계`
      : '';
    return `${sourceText}${stepsText}`;
  };

  const isDbRecipe = !!activePost?.recipeId && (!!foodDetail || !!mockFoodDetail);

  const getLinkedRecipeData = () => {
    if (!activePost?.recipeId) return undefined;

    if (isFoodLoading) {
      return undefined;
    }

    if (isDbRecipe && activeFoodDetail) {
      return {
        id: activeFoodDetail.id,
        nameKo: activeFoodDetail.nameKo,
        emoji: activeFoodDetail.emoji || '🍲',
        description: getRecipeDescription(),
        isClickable: true,
      };
    }

    // 사용자 직접 입력 한 줄 레시피 제목인 경우
    return {
      id: 'custom',
      nameKo: activePost.recipeId,
      emoji: '🍽️',
      description: t('community.customRecipe', { defaultValue: '사용자 등록 레시피' }),
      isClickable: false,
    };
  };

  const isAuthor = !!userProfile && !!activePost && activePost.authorId === Number(userProfile.id);

  const handleEdit = () => {
    if (!activePost) return;
    router.push({
      pathname: '/community/write',
      params: {
        postId: String(activePost.boardId),
        mode: 'edit',
        initCategory: activePost.category ?? 'REVIEW',
        initContent: activePost.content,
        initTitle: activePost.title,
        initImages: JSON.stringify(activePost.imageUrls),
        ...(activePost.recipeId ? { initLinkedRecipeId: activePost.recipeId } : {}),
      },
    });
  };

  const handleRecipePress = () => {
    if (activePost?.recipeId) {
      router.push(`/food/${activePost.recipeId}`);
    }
  };

  const handleDelete = () => {
    if (isRealBoard) {
      deleteBoard(boardId, { onSuccess: () => router.back() });
    } else {
      router.back();
    }
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    if (isRealBoard) {
      updateComment({ commentId: parseInt(commentId, 10), content });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (isRealBoard) {
      deleteComment(parseInt(commentId, 10));
    }
  };

  const handleAddComment = (text: string) => {
    if (isRealBoard) {
      addComment({ content: text, authorName: userProfile?.name });
    }
  };

  const handleLike = () => {
    if (isRealBoard) {
      const currentLiked = isLikedLocal;
      setIsLikedLocal(!currentLiked);

      toggleLike(
        { boardId, currentLiked },
        {
          onSuccess: (data) => {
            setIsLikedLocal(data.liked);
          },
          onError: () => {
            setIsLikedLocal(currentLiked);
          },
        }
      );
    } else {
      setIsLikedLocal((prev) => !prev);
    }
  };

  // Map backend comments (or mock comments) to UI structure
  const rawComments = isRealBoard ? (commentsData?.content || []) : MOCK_COMMENTS.map((c) => ({
    commentId: 9999,
    boardId: 9999,
    authorId: 9999,
    authorName: c.author.name,
    commentContent: c.content,
    createdAt: c.createdAt,
    updatedAt: c.createdAt,
  }));

  const comments = rawComments.map((c) => ({
    id: String(c.commentId),
    author: { id: String(c.authorId), name: c.authorName || '익명', avatarUrl: undefined },
    createdAt: c.createdAt,
    content: c.commentContent,
  }));

  if (isRealBoard && (isPostLoading || !post)) {
    return (
      <ScreenLayout>
        <Header title={t('community.postDetail')} onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <Text variant="bodySecondary">{t('common.loading')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!activePost) {
    return (
      <ScreenLayout>
        <Header title={t('community.postDetail')} onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <Text variant="bodySecondary">{t('community.postNotFound')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoiding}
      >
        <Header
          title={t('community.postDetail')}
          onBack={() => router.back()}
          rightAction={
            isAuthor ? (
              <Pressable onPress={() => setIsMenuOpen(true)} hitSlop={8}>
                <Text variant="label" style={{ fontSize: 20, color: colors.text }}>⋯</Text>
              </Pressable>
            ) : undefined
          }
        />

        <FlatList
          ref={commentListRef}
          data={comments}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          removeClippedSubviews={false}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              commentListRef.current?.scrollToIndex({ index: info.index, viewPosition: 0, animated: true });
            }, 300);
          }}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              <PostDetail
                author={{ name: activePost.authorNickname || '익명' }}
                createdAt={activePost.createdAt}
                category={getCategoryLabel(activePost.category)}
                images={activePost.imageUrls}
                content={activePost.content}
                title={activePost.title}
                likeCount={likeCountData ?? 0}
                commentCount={commentsData?.totalElements ?? 0}
                isLiked={isLikedLocal}
                onLike={handleLike}
                linkedRecipe={getLinkedRecipeData()}
                onRecipePress={handleRecipePress}
              />
              <Text variant="h3" bold style={styles.commentHeader}>
                {t('community.commentsCount', { count: commentsData?.totalElements ?? 0 })}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <CommentItem
              comment={item}
              isAuthor={!!userProfile && item.author.id === String(userProfile.id)}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onEditingChange={setIsEditingComment}
              onEditStart={() => handleEditStartScroll(index)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />

        {!isEditingComment && (
          <View style={{ paddingBottom: isKeyboardVisible ? SUGGESTION_BAR_OFFSET : 0 }}>
            <CommentInput
              onSubmit={handleAddComment}
              placeholder={t('comment.placeholder')}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      <PostMoreMenu
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  commentHeader: {
    fontSize: 15,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { PostDetailScreen as default };
