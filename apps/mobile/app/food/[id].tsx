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

import { MOCK_DETAILS } from '../../mocks';

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

  const detail = foodDetail || MOCK_DETAILS;
  const storyText = detail.historyStory || '';

  const tabs = [
    t('detail.recipe'),
    t('detail.ingredients'),
    t('detail.historyStory'),
    t('detail.literature'),
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
  const showFeedback = activeTabIndex === 2 || activeTabIndex === 3;

  const literatureData = detail.literatureQuotes?.[0] || MOCK_DETAILS.literatureQuotes[0];

  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 1: // 식재료
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
      case 2: // 역사이야기
        {
          const ritualText = detail.ritualContext ?? '';
          return (
            <View style={styles.tabContent}>
              <HistorySection
                type="origin"
                icon="📜"
                title={t('history.originTitle', { defaultValue: '유래 이야기' })}
                content={storyText}
              />
              <HistorySection
                type="literature"
                icon="📚"
                title={t('history.literatureTitle', { defaultValue: '문헌 기록' })}
                content={t('history.literatureQuoteText', { defaultValue: '고문헌 기록에 묘사된 내용입니다.' })}
                citation={{
                  quote: literatureData.quoteOriginal,
                  source: `${literatureData.sourceName} (${literatureData.era})`,
                  onViewOriginal: () => {
                    if (__DEV__) console.log('View original literature pressed');
                  }
                }}
                citationLabel={t('history.citation')}
                viewOriginalLabel={t('history.viewOriginal')}
              />
              <HistorySection
                type="ritual"
                icon="🎎"
                title={t('history.ritualTitle', { defaultValue: '의례와의 연결' })}
                content={ritualText}
              />
            </View>
          );
        }
      case 3: // 문헌
        {
          return (
            <View style={styles.tabContent}>
              <LiteratureQuote
                sourceName={literatureData.sourceName}
                quoteOriginal={literatureData.quoteOriginal}
                quoteTranslation={literatureData.quoteTranslation}
                era={literatureData.era}
                translationLabel={t('history.modernTranslation')}
              />
            </View>
          );
        }
      case 0: // 조리법
      default:
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
        {'imageUrl' in detail && detail.imageUrl ? (
          <Image source={{ uri: detail.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={styles.emojiWrapper}>
            <Text style={styles.largeEmoji}>{detail.emoji}</Text>
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

        {renderTabContent()}

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
});

export { FoodDetailScreen as default };

