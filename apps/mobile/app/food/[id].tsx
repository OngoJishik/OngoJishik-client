import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import { Image } from 'expo-image';
import * as Location from 'expo-location';

import {
  useFoodDetailQuery,
  useFoodDetailRawQuery,
  useAddBookmarkMutation,
  useDeleteBookmarkMutation,
  useImageJobQuery,
  useNearbyMarketsQuery,
  TMarketCategory,
} from '@ongo/api-client';
import { useTranslation } from '@ongo/i18n';
import { languageAtom, userLocationAtom, marketBottomSheetAtom } from '@ongo/store';
import {
  ScreenLayout,
  TabBar,
  RecipeStep,
  HistorySection,
  LiteratureQuote,
  FeedbackButtons,
  Button,
  Text,
  Icon,
  useTheme,
  BottomSheet,
  MarketCard,
  spacing,
} from '@ongo/ui';
import { formatFoodName } from '@ongo/utils';

/**
 * 음식 식재료 목록을 전통시장 카테고리 목록으로 매핑하는 헬퍼 함수
 * @param ingredients 식재료 문자열 배열
 * @returns 전통시장 카테고리 배열
 * @author Antigravity
 */
const mapIngredientsToMarketCategories = (ingredients: string[]): TMarketCategory[] => {
  const matched = new Set<TMarketCategory>();
  const rules: { cat: TMarketCategory; keywords: string[] }[] = [
    { cat: 'GRAIN', keywords: ['쌀', '찹쌀', '보리', '밀', '수수', '조', '곡물', '잡곡', '깨'] },
    { cat: 'VEGETABLE', keywords: ['배추', '무', '파', '마늘', '고추', '양파', '버섯', '당근', '나물', '야채', '채소', '시금치', '고사리', '미나리'] },
    { cat: 'FRUIT', keywords: ['사과', '배', '감', '밤', '대추', '귤', '포도', '참외', '수박', '과일', '청과'] },
    { cat: 'SEAFOOD', keywords: ['고등어', '조기', '명태', '오징어', '조개', '낙지', '새우', '게', '김', '미역', '수산', '해산물', '생선', '굴'] },
    { cat: 'MEAT', keywords: ['쇠고기', '돼지고기', '닭고기', '정육', '고기', '육류', '소고기', '돼지', '소', '닭', '오리'] },
    { cat: 'SAUCE', keywords: ['간장', '된장', '고추장', '젓갈', '식초', '설탕', '소금', '양념', '장류'] },
    { cat: 'HERB_MED', keywords: ['인삼', '홍삼', '감초', '약재', '당귀', '황기', '약초'] },
  ];

  for (const ing of ingredients) {
    for (const rule of rules) {
      if (rule.keywords.some((kw) => ing.includes(kw))) {
        matched.add(rule.cat);
      }
    }
  }

  return matched.size > 0 ? Array.from(matched) : [];
};

/**
 * 전통 음식의 상세 정보를 다양한 탭과 스토리로 제공하는 화면 컴포넌트
 * GET /api/analysis/{foodId} 기반 실제 데이터를 사용합니다.
 * @author Antigravity
 */
export const FoodDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentLang = useAtomValue(languageAtom);

  const { id, imageJobId: paramImageJobId, imageStatus: paramImageStatus } = useLocalSearchParams();
  const foodId = (id as string) || '';

  // 실제 API 데이터 fetch (매핑된 TFoodDetail 형태)
  const { data: foodDetail, isLoading } = useFoodDetailQuery(foodId);
  // 원본 API 응답 (isBookmarked 초기값 활용)
  const { data: rawDetail } = useFoodDetailRawQuery(foodId);

  const { mutate: addBookmark } = useAddBookmarkMutation();
  const { mutate: deleteBookmark } = useDeleteBookmarkMutation();

  // isBookmarked: 서버 원본값 기반, 낙관적 업데이트는 QueryClient 캐시가 처리
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null);
  const serverFavorite = rawDetail?.isBookmarked ?? false;
  const isFavorite = optimisticFavorite !== null ? optimisticFavorite : serverFavorite;

  // 위치 권한 및 전통시장 조회용 상태
  const [userLocation, setUserLocation] = useAtom(userLocationAtom);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useAtom(marketBottomSheetAtom);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // 마운트 시 권한 상태 조회
  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => {
        setHasLocationPermission(status === 'granted');
      })
      .catch(() => {});
  }, [userLocation]);

  // 식재료 기반 마켓 카테고리 매핑
  const ingredientCategories = useMemo(() => {
    return mapIngredientsToMarketCategories(foodDetail?.ingredients ?? []);
  }, [foodDetail?.ingredients]);

  // 근처 시장 조회 Query
  const {
    data: nearbyMarkets,
    isLoading: isMarketsLoading,
    isFetching: isMarketsFetching,
    refetch: refetchMarkets,
  } = useNearbyMarketsQuery({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    ingredientCategories,
  });

  const handleMarketPress = async () => {
    try {
      // 이미 위치 정보가 있다면 빠른 응답성을 위해 바텀시트를 즉시 오픈하고, 백그라운드에서 신규 위치 갱신을 수행합니다.
      if (userLocation) {
        setIsBottomSheetOpen(true);
        refetchMarkets();
      }

      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        setHasLocationPermission(true);
        setIsBottomSheetOpen(true);
        refetchMarkets();
      } else if (existingStatus === 'denied') {
        Alert.alert(
          t('permissions.guideTitle', { defaultValue: '권한 설정 안내' }),
          t('market.buttonDisabledHint', { defaultValue: '주변 시장을 보려면 위치 권한이 필요합니다. 설정에서 권한을 허용해 주세요.' }),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.confirm'), onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        const { status: requestStatus } = await Location.requestForegroundPermissionsAsync();
        if (requestStatus === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
          setHasLocationPermission(true);
          setIsBottomSheetOpen(true);
          refetchMarkets();
        } else {
          Alert.alert(
            t('permissions.guideTitle', { defaultValue: '권한 설정 안내' }),
            t('market.buttonDisabledHint', { defaultValue: '주변 시장을 보려면 위치 권한이 필요합니다.' })
          );
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to get location:', error);
      }
      Alert.alert('Error', '위치 정보를 가져오는데 실패했습니다.');
    }
  };

  const detail = foodDetail || {
    id: '',
    nameKo: '',
    nameLocalized: '',
    emoji: '🍲',
    imageUrl: '',
    category: 'ETC' as any,
    description: '',
    tags: [],
    source: '',
    ingredients: [],
    recipeSteps: [],
    historyStory: '',
    ritualContext: '',
    literatureQuotes: [],
    imageStatus: undefined,
    imageJobId: undefined,
  };

  // 최종 이미지 URL 및 PENDING 상태 결정
  const queryJobId = paramImageJobId ? parseInt(paramImageJobId as string, 10) : undefined;
  const queryImageStatus = paramImageStatus as 'PENDING' | 'COMPLETED' | 'FAILED' | undefined;

  // 파라미터 또는 API 응답의 이미지 상태 결정 (API 응답이 이미 완료되었으면 완료로 유지)
  const effectiveImageStatus = detail.imageStatus === 'COMPLETED'
    ? 'COMPLETED'
    : (queryImageStatus || detail.imageStatus);

  const effectiveJobId = detail.imageJobId || queryJobId;

  const isImagePending = effectiveImageStatus === 'PENDING' && !!effectiveJobId;
  const { data: jobData, isTimedOut } = useImageJobQuery(effectiveJobId ?? 0, isImagePending);

  let imageUrl = detail.imageUrl;
  let currentImageStatus = effectiveImageStatus;

  if (isImagePending) {
    if (jobData?.status === 'COMPLETED' && jobData.imageUrl) {
      imageUrl = jobData.imageUrl;
      currentImageStatus = 'COMPLETED';
    } else if (jobData?.status === 'FAILED' || isTimedOut) {
      imageUrl = '';
      currentImageStatus = 'FAILED';
    } else {
      imageUrl = '';
      currentImageStatus = 'PENDING';
    }
  }

  const tabs = [
    t('detail.recipe'),
    t('detail.ingredients'),
    t('detail.historyAndLiterature'),
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const displayName = formatFoodName(detail.nameKo, detail.nameLocalized, currentLang);

  const handleFavoriteToggle = () => {
    const next = !isFavorite;
    setOptimisticFavorite(next);
    if (next) {
      addBookmark(foodId, {
        onError: () => setOptimisticFavorite(!next),
        onSettled: () => setOptimisticFavorite(null),
      });
    } else {
      deleteBookmark(foodId, {
        onError: () => setOptimisticFavorite(!next),
        onSettled: () => setOptimisticFavorite(null),
      });
    }
  };

  const activeTabIndex = tabs.indexOf(activeTab);
  const showFeedback = activeTabIndex === 2;

  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 1: // 식재료
        if (!detail.ingredients || detail.ingredients.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Text variant="body" style={styles.emptyText}>
                {t('detail.noIngredients')}
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.tabContent}>
            {detail.ingredients.map((ing, idx) => (
              <View key={`${ing}-${idx}`} style={[styles.ingredientRow, { borderBottomColor: colors.border }]}>
                <Text style={{ marginRight: 8, color: colors.primary }}>•</Text>
                <Text variant="body">{ing}</Text>
              </View>
            ))}
          </View>
        );
      case 2: // 역사&문헌
        {
          const hasStory = !!detail.historyStory;
          const hasRitual = !!detail.ritualContext;
          const hasQuotes = !!detail.literatureQuotes && detail.literatureQuotes.length > 0;

          if (!hasStory && !hasRitual && !hasQuotes) {
            return (
              <View style={styles.emptyContainer}>
                <Text variant="body" style={styles.emptyText}>
                  {t('detail.noHistoryData')}
                </Text>
              </View>
            );
          }

          return (
            <View style={styles.tabContent}>
              {hasStory && (
                <HistorySection
                  type="origin"
                  icon="📜"
                  title={t('history.originTitle', { defaultValue: '유래 이야기' })}
                  content={detail.historyStory ?? ''}
                />
              )}
              {hasRitual && (
                <HistorySection
                  type="ritual"
                  icon="🎎"
                  title={t('history.ritualTitle', { defaultValue: '의례와의 연결' })}
                  content={detail.ritualContext ?? ''}
                />
              )}
              {hasQuotes && (
                <View style={styles.literatureSection}>
                  <View style={styles.literatureHeader}>
                    <Text style={styles.literatureIcon}>📚</Text>
                    <Text variant="h3" bold style={[styles.literatureTitleText, { color: colors.text }]}>
                      {t('history.literatureTitle', { defaultValue: '문헌 기록' })}
                    </Text>
                  </View>
                  {detail.literatureQuotes?.map((quote, idx) => (
                    <LiteratureQuote
                      key={idx}
                      sourceName={quote.sourceName}
                      quoteOriginal={quote.quoteOriginal}
                      quoteTranslation={quote.quoteTranslation}
                      era={quote.era}
                      translationLabel={t('history.modernTranslation')}
                      author={quote.author}
                      publishYear={quote.publishYear}
                      originalUrl={quote.originalUrl}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        }
      case 0: // 조리법
      default:
        if (!detail.recipeSteps || detail.recipeSteps.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Text variant="body" style={styles.emptyText}>
                {t('detail.noRecipe')}
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.tabContent}>
            {detail.recipeSteps.map((step) => (
              <RecipeStep
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                isLast={step.stepNumber === detail.recipeSteps.length}
              />
            ))}
          </View>
        );
    }
  };

  return (
    <ScreenLayout scrollable style={{ paddingHorizontal: 0 }}>
      {/* Hero Image Area */}
      <View style={[styles.heroContainer, { backgroundColor: colors.primaryLight }]}>
        {currentImageStatus === 'PENDING' ? (
          <View style={styles.emojiWrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={styles.emojiWrapper}>
            <Text style={styles.largeEmoji}>{detail.emoji || '🍲'}</Text>
          </View>
        )}

        {/* Overlays */}
        <Pressable style={styles.overlayBackBtn} onPress={() => router.back()}>
          <Icon name="back" size={24} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.overlayFavBtn} onPress={handleFavoriteToggle}>
          <Icon
            name={isFavorite ? 'star-filled' : 'star'}
            size={24}
            color={isFavorite ? colors.primary : '#FFFFFF'}
          />
        </Pressable>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            ⚠️ {t('detail.aiImageDisclaimer')}
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Food Info */}
        <View style={styles.foodInfoSection}>
          <Text variant="h1" bold style={styles.foodTitle}>
            {displayName}
          </Text>
          {detail.nameLocalized && (
            <Text variant="body" style={[styles.foodSubTitle, { color: colors.textSecondary }]}>
              {detail.nameLocalized}
            </Text>
          )}
          <View style={styles.tagContainer}>
            {detail.tags.map((tag, idx) => (
              <View key={`${tag}-${idx}`} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
                <Text variant="caption" style={{ color: colors.textSecondary }}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="caption" style={[styles.sourceText, { color: colors.textTertiary }]}>
            {t('detail.dataSource')}
          </Text>
        </View>

        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading ? (
          <View style={styles.tabContent}>
            <View style={[styles.skeletonItem, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonItem, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonItem, { backgroundColor: colors.border }]} />
          </View>
        ) : (
          renderTabContent()
        )}

        {showFeedback && (
          <FeedbackButtons
            label={t('feedback.question')}
            selected={feedback}
            onPositive={() => setFeedback(feedback === 'up' ? null : 'up')}
            onNegative={() => setFeedback(feedback === 'down' ? null : 'down')}
            positiveLabel={t('feedback.positive')}
            negativeLabel={t('feedback.negative')}
          />
        )}

        <View style={styles.bottomActionsContainer}>
          <View style={styles.bottomActions}>
            <Pressable
              style={[
                styles.favBtn,
                { borderColor: isFavorite ? colors.primary : colors.border },
              ]}
              onPress={handleFavoriteToggle}
            >
              <Icon
                name={isFavorite ? 'star-filled' : 'star'}
                size={24}
                color={isFavorite ? colors.primary : colors.textSecondary}
              />
            </Pressable>
            <Button
              title={t('market.buttonLabel', { defaultValue: '근처 전통시장 보기' })}
              onPress={handleMarketPress}
              style={styles.marketBtn}
            />
          </View>
          {hasLocationPermission === false && !userLocation && (
            <Text variant="caption" style={[styles.disabledHintText, { color: colors.textSecondary }]}>
              {t('market.buttonDisabledHint')}
            </Text>
          )}
        </View>
      </View>

      <BottomSheet
        visible={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        maxHeight="75%"
      >
        <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
          <Text variant="h2" bold style={[styles.sheetTitle, { color: colors.text }]}>
            {t('market.nearbyTitle')}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.sheetScrollContent}>
          {isMarketsLoading || isMarketsFetching ? (
            <View style={styles.sheetCenterContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="body" style={{ marginTop: spacing.md, color: colors.textSecondary }}>
                {t('market.loadingLabel')}
              </Text>
            </View>
          ) : !nearbyMarkets || nearbyMarkets.length === 0 ? (
            <View style={styles.sheetCenterContainer}>
              <Text style={styles.largeEmojiFallback}>🏪</Text>
              <Text variant="body" style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('market.emptyResult')}
              </Text>
            </View>
          ) : (
            <>
              {nearbyMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  name={market.name}
                  distanceKm={market.distanceKm}
                  addressRoad={market.addressRoad}
                  openCycle={market.openCycle}
                  categoryLabel={market.categoryLabel}
                  hasParking={market.hasParking}
                  categoryGuideText={
                    market.categoryLabel
                      ? t('market.categoryLabel', { categories: market.categoryLabel })
                      : t('market.noCategory')
                  }
                  parkingLabel={t('market.hasParking')}
                  openCycleLabel={t('market.openCycleLabel', { cycle: market.openCycle })}
                />
              ))}
            </>
          )}
          <Text variant="caption" style={[styles.dataSourceText, { color: colors.textTertiary }]}>
            {t('market.dataSource')}
          </Text>
        </ScrollView>
      </BottomSheet>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  emojiWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeEmoji: {
    fontSize: 80,
  },
  overlayBackBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayFavBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  disclaimerText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  mainContent: {
    paddingHorizontal: 16,
  },
  foodInfoSection: {
    paddingVertical: 20,
  },
  foodTitle: {
    fontSize: 24,
    marginBottom: 4,
  },
  foodSubTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  sourceText: {
    fontSize: 12,
  },
  tabContent: {
    paddingVertical: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  bottomActionsContainer: {
    marginVertical: 24,
    width: '100%',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  marketBtn: {
    flex: 1,
  },
  disabledHintText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 18,
  },
  sheetScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheetCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  largeEmojiFallback: {
    fontSize: 48,
    marginBottom: 16,
  },
  dataSourceText: {
    marginTop: spacing.md,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  skeletonItem: {
    height: 60,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    opacity: 0.6,
  },
  literatureSection: {
    marginVertical: 12,
  },
  literatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  literatureIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  literatureTitleText: {
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888888',
  },
});

export { FoodDetailScreen as default };

