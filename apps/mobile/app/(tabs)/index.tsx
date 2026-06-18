import React, { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { usePopularBoardsQuery } from '@ongo/api-client';
import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  SearchBar,
  FeaturedCard,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';

import { MOCK_RECOMMENDATION } from '../../mocks';

/**
 * 서비스의 메인 홈 화면 컴포넌트
 * 오늘의 추천 및 인기 게시글을 탐색할 수 있습니다.
 * @author Antigravity
 */
export const HomeScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [searchVal, setSearchVal] = useState('');

  // 인기 게시글 상위 5개 (GET /api/boards/popular)
  const { data: popularBoards } = usePopularBoardsQuery();

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

  const todayRecommendation = MOCK_RECOMMENDATION;

  const handleSearch = () => {
    if (searchVal.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const handleBoardPress = (boardId: number) => {
    router.push(`/community/${boardId}`);
  };

  return (
    <ScreenLayout scrollable>
      <Header
        title="🍚 온고지식"
        rightAction={
          <Pressable
            onPress={() => {
              if (__DEV__) {
                console.log('Notifications pressed');
              }
            }}
          >
            <Icon name="bell" size={22} color={colors.text} />
          </Pressable>
        }
      />

      <SearchBar
        value={searchVal}
        onChangeText={setSearchVal}
        onSearch={handleSearch}
        placeholder={t('home.searchPlaceholder')}
        onMicPress={() => {
          if (__DEV__) {
            console.log('Mic Pressed');
          }
        }}
        onClear={() => setSearchVal('')}
      />

      <FeaturedCard
        nameKo={todayRecommendation.nameKo}
        nameLocalized={todayRecommendation.nameLocalized}
        emoji={todayRecommendation.emoji}
        subtitle={'subtitle' in todayRecommendation ? (todayRecommendation.subtitle as string) : t('home.todayRecommendation')}
        description={todayRecommendation.description}
        badgeLabel={t('featured.todayRecommendation')}
        onPress={() => router.push(`/food/${todayRecommendation.id}`)}
      />

      {/* 인기 게시글 섹션 */}
      <View style={styles.sectionContainer}>
        <Text variant="h3" bold style={[styles.sectionTitle, { color: colors.text }]}>
          {t('home.popularFoods')}
        </Text>

        {popularBoards && popularBoards.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {popularBoards.map((board, index) => (
              <Pressable
                key={board.boardId}
                style={[styles.boardCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => handleBoardPress(board.boardId)}
              >
                {/* 썸네일 이미지 및 랭킹 배지 */}
                <View style={[styles.imageContainer, { backgroundColor: colors.primaryLight }]}>
                  {board.imageUrls && board.imageUrls.length > 0 ? (
                    <Image
                      source={{ uri: board.imageUrls[0] }}
                      style={styles.boardImage}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text variant="caption" style={{ color: colors.textTertiary }}>
                        No Image
                      </Text>
                    </View>
                  )}
                  {/* 랭킹 배지 */}
                  <View style={[styles.rankBadge, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
                    <Text variant="caption" bold style={{ color: '#FFFFFF', fontSize: 11 }}>
                      {index + 1}
                    </Text>
                  </View>
                </View>

                {/* 정보 영역 */}
                <View style={styles.infoContainer}>
                  {/* 카테고리 칩 */}
                  <Pressable
                    style={[styles.categoryChip, { backgroundColor: colors.secondary }]}
                    onPress={() => {
                      const categoryRaw = board.category as any;
                      const catStr = typeof categoryRaw === 'string' ? categoryRaw : (categoryRaw?.id || categoryRaw?.code || categoryRaw?.name || '');
                      router.push({
                        pathname: '/community',
                        params: { category: catStr?.toUpperCase() },
                      });
                    }}
                  >
                    <Text variant="caption" style={styles.categoryText}>
                      {getCategoryLabel(board.category)}
                    </Text>
                  </Pressable>

                  {/* 제목 */}
                  <Text
                    variant="body"
                    bold
                    numberOfLines={2}
                    style={[styles.boardTitleText, { color: colors.text }]}
                  >
                    {board.title}
                  </Text>

                  {/* 좋아요 및 댓글 수 */}
                  <View style={styles.boardMeta}>
                    <View style={styles.likeRow}>
                      <Text style={{ fontSize: 11 }}>❤️</Text>
                      <Text variant="caption" style={{ color: colors.textSecondary, marginLeft: 2 }}>
                        {board.likeCount}
                      </Text>
                    </View>
                    <View style={styles.commentRow}>
                      <Icon name="comment" size={12} color={colors.textTertiary} />
                      <Text variant="caption" style={{ color: colors.textSecondary, marginLeft: 2 }}>
                        {board.commentCount}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="bodySecondary" style={{ color: colors.textTertiary }}>
              {t('community.noPosts')}
            </Text>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 17,
  },
  horizontalScroll: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  boardCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginRight: 12,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  boardTitleText: {
    fontSize: 13,
    lineHeight: 18,
    height: 36,
    marginBottom: 6,
  },
  boardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});

export { HomeScreen as default };
