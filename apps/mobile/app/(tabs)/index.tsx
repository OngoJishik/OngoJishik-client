import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, StyleSheet, ScrollView, Dimensions, Animated, FlatList, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSetAtom, useAtom } from 'jotai';

import {
  usePopularBoardsQuery,
  useTodayFoodsQuery,
  useSearchHistoryQuery,
  useDeleteAllSearchHistoryMutation,
  useDeleteSearchHistoryMutation,
} from '@ongo/api-client';
import { useTranslation } from '@ongo/i18n';
import { recentSearchAtom, isHomeSearchActiveAtom } from '@ongo/store';
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
 * 홈 화면에서 검색바가 활성화되었을 때 표시되는 애니메이션 검색 오버레이 컴포넌트
 * @author Antigravity
 */
interface SearchOverlayProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  initialValue: string;
}

export const SearchOverlay = ({ onClose, onSearch, initialValue }: SearchOverlayProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [searchVal, setSearchVal] = useState(initialValue);

  const { data: historyData } = useSearchHistoryQuery();
  const { mutate: deleteAll } = useDeleteAllSearchHistoryMutation();
  const { mutate: deleteOne } = useDeleteSearchHistoryMutation();

  const recentSearches = (historyData?.searches ?? []).slice(0, 3);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    const backAction = () => {
      handleClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleClose = () => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      handleClose();
    }
  };

  const screenHeight = Dimensions.get('window').height;
  const initialY = insets.top + 68; // Header(56) + marginVertical(12)
  const targetY = screenHeight * 0.22; // Position search bar at 22% height
  const targetTranslateY = targetY - initialY;

  const searchBarTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, targetTranslateY],
  });

  const overlayOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const historyOpacity = animValue.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.overlayContainer,
        {
          backgroundColor: colors.background,
          opacity: overlayOpacity,
          paddingTop: insets.top,
        },
      ]}
    >
      <Pressable
        onPress={handleClose}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          zIndex: 1000,
          padding: 4,
        }}
        hitSlop={12}
      >
        <Icon name="back" size={24} color={colors.text} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: searchBarTranslateY }],
            flex: 1,
            paddingHorizontal: 16,
          }}
        >
        <View style={{ marginTop: 56 }}>
          <SearchBar
            value={searchVal}
            onChangeText={setSearchVal}
            onSearch={() => handleSearchSubmit(searchVal)}
            placeholder={t('home.searchPlaceholder')}
            autoFocus={true}
            onClear={() => setSearchVal('')}
          />
        </View>

        <Animated.View style={{ opacity: historyOpacity, flex: 1, marginTop: 16 }}>
          <View style={styles.historyHeader}>
            <Text variant="h3" bold style={[styles.overlaySectionTitle, { color: colors.text }]}>
              {t('search.recent')}
            </Text>
            {recentSearches.length > 0 && (
              <Pressable onPress={() => deleteAll()} hitSlop={8}>
                <Text variant="caption" style={{ color: colors.textTertiary }}>
                  {t('search.clearAll')}
                </Text>
              </Pressable>
            )}
          </View>

          {recentSearches.length === 0 ? (
            <View style={styles.emptyHistoryContainer}>
              <Text variant="caption" style={{ color: colors.textSecondary }}>
                {t('search.noRecent')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={recentSearches}
              keyExtractor={(item) => String(item.searchId)}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                  <Pressable
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => handleSearchSubmit(item.query)}
                  >
                    <Text style={{ marginRight: 8 }}>🕐</Text>
                    <Text variant="body" style={{ color: colors.text }}>
                      {item.query}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => deleteOne(item.searchId)} hitSlop={8}>
                    <Icon name="close" size={14} color={colors.textSecondary} />
                  </Pressable>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  </Animated.View>
);
};

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
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSearching, setIsSearching] = useAtom(isHomeSearchActiveAtom);
  const addRecentSearch = useSetAtom(recentSearchAtom);

  const scrollViewRef = useRef<ScrollView>(null);

  // 인기 게시글 상위 5개 (GET /api/boards/popular)
  const { data: popularBoards } = usePopularBoardsQuery();

  // 오늘의 추천 전통음식 목록 조회 (GET /api/home)
  const { data: todayFoodsData, isLoading: isRecommendationLoading } = useTodayFoodsQuery();
  const todayRecommendations = todayFoodsData?.foods ?? [];

  // 캐러셀 자동 롤링 (4초 단위)
  useEffect(() => {
    if (todayRecommendations.length <= 1) return;

    const interval = setInterval(() => {
      const snapInterval = width - 20;
      const nextSlide = (activeSlide + 1) % todayRecommendations.length;
      scrollViewRef.current?.scrollTo({
        x: nextSlide * snapInterval,
        animated: true,
      });
      setActiveSlide(nextSlide);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlide, todayRecommendations.length]);

  const handleCarouselScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const snapInterval = width - 20; // CARD_WIDTH(width - 32) + GAP(12)
    const pageNum = Math.round(contentOffset / snapInterval);
    setActiveSlide(pageNum);
  };

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

  // MOCK_RECOMMENDATION is replaced by real API data

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleBoardPress = (boardId: number) => {
    router.push(`/community/${boardId}`);
  };

  return (
    <>
      <ScreenLayout scrollable scrollEnabled={!isSearching}>
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

        <Pressable onPress={() => setIsSearching(true)}>
          <View pointerEvents="none">
            <SearchBar
              value={searchVal}
              onChangeText={setSearchVal}
              placeholder={t('home.searchPlaceholder')}
            />
          </View>
        </Pressable>

      {/* 오늘의 추천 캐러셀 영역 */}
      {todayRecommendations.length > 0 ? (
        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            decelerationRate="fast"
            snapToInterval={width - 20}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            onScroll={handleCarouselScroll}
            scrollEventThrottle={16}
            style={styles.carouselScrollView}
          >
            {todayRecommendations.map((item) => (
              <View key={item.foodId} style={{ width: width - 32, marginRight: 12 }}>
                <FeaturedCard
                  nameKo={item.foodName}
                  nameLocalized={undefined}
                  emoji="🍲"
                  imageUrl={item.foodPicture}
                  subtitle={item.category}
                  description={Array.isArray(item.features) ? item.features.join(', ') : ''}
                  badgeLabel={t('featured.todayRecommendation')}
                  onPress={() => router.push(`/food/${item.foodId}`)}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {todayRecommendations.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  {
                    backgroundColor:
                      index === activeSlide ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      ) : isRecommendationLoading ? (
        <View style={styles.loaderContainer}>
          <FeaturedCard
            nameKo={t('common.loading', '로딩 중...')}
            emoji="⏳"
            subtitle={t('home.todayRecommendation')}
            description={t('common.loadingDesc', '추천 음식을 불러오는 중입니다.')}
            onPress={() => { }}
          />
        </View>
      ) : null}

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

      {isSearching && (
        <SearchOverlay
          onClose={() => setIsSearching(false)}
          onSearch={handleSearch}
          initialValue={searchVal}
        />
      )}
    </>
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
  carouselWrapper: {
    marginVertical: 8,
  },
  carouselScrollView: {
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  loaderContainer: {
    width: width - 32,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overlaySectionTitle: {
    marginBottom: 0,
    fontSize: 17,
  },
  emptyHistoryContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export { HomeScreen as default };
