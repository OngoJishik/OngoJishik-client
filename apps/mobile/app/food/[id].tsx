import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Image } from 'expo-image';

import { useFoodDetailQuery, useFoodDetailRawQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } from '@ongo/api-client';
import { useTranslation } from '@ongo/i18n';
import { languageAtom } from '@ongo/store';
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
} from '@ongo/ui';
import { formatFoodName } from '@ongo/utils';

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

  const { id } = useLocalSearchParams();
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
  };

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
            {detail.ingredients.map((ing) => (
              <View key={ing} style={[styles.ingredientRow, { borderBottomColor: colors.border }]}>
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
        {'imageUrl' in detail && detail.imageUrl && (
          <Image source={{ uri: detail.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
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
            {detail.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
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
            title={t('food.marketButton')}
            onPress={() => {
              if (__DEV__) {
                console.log('Link to traditional markets');
              }
            }}
            style={styles.marketBtn}
          />
        </View>
      </View>
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
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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

