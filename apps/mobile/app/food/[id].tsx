import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';

import { useFoodDetailQuery, useFoodHistoryStoryQuery } from '@ongo/api-client';
import { useTranslation } from '@ongo/i18n';
import { localFavoritesAtom, languageAtom } from '@ongo/store';
import {
  ScreenLayout,
  Header,
  TabBar,
  RecipeStep,
  HistorySection,
  LiteratureQuote,
  DataSourceTag,
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
 * @author Antigravity
 */
export const FoodDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentLang = useAtomValue(languageAtom);
  const [favorites, setFavorites] = useAtom(localFavoritesAtom);

  const { id } = useLocalSearchParams();
  const foodId = (id as string) || 'yukgaejang';

  // Fetch from TanStack Query with local mock fallback
  const { data: foodDetail } = useFoodDetailQuery(foodId);
  const { data: historyStory } = useFoodHistoryStoryQuery(foodId);

  const detail = foodDetail || MOCK_DETAILS;
  const storyText = historyStory?.story || detail.historyStory || '';

  const tabs = [
    t('detail.recipe'),
    t('detail.ingredients'),
    t('detail.historyStory'),
    t('detail.literature'),
    t('detail.health')
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isFavorite = favorites.includes(foodId);
  const displayName = formatFoodName(detail.nameKo, detail.nameLocalized, currentLang);

  const handleFavoriteToggle = () => {
    setFavorites((prev) =>
      prev.includes(foodId) ? prev.filter((favId) => favId !== foodId) : [...prev, foodId]
    );
  };

  const renderTabContent = () => {
    // Map internal UI tabs correctly independent of localized tab labels
    const currentTabName = tabs.indexOf(activeTab);

    switch (currentTabName) {
      case 1: // 식재료
        return (
          <View style={styles.tabContent}>
            {detail.ingredients.map((ing, index) => (
              <View key={index} style={[styles.ingredientRow, { borderBottomColor: colors.border }]}>
                <Text style={{ marginRight: 8, color: colors.primary }}>•</Text>
                <Text variant="body">{ing}</Text>
              </View>
            ))}
          </View>
        );
      case 2: // 역사이야기
        return (
          <View style={styles.tabContent}>
            <HistorySection
              type="origin"
              icon="📜"
              title={t('detail.historyStory')}
              content={storyText}
            />
          </View>
        );
      case 3: // 문헌
        {
          const literatureData = ('literatureQuotes' in detail && detail.literatureQuotes?.[0]) || MOCK_DETAILS.literature;
          return (
            <View style={styles.tabContent}>
              <LiteratureQuote
                sourceName={literatureData.sourceName}
                quoteOriginal={literatureData.quoteOriginal}
                quoteTranslation={literatureData.quoteTranslation}
                era={literatureData.era}
              />
            </View>
          );
        }
      case 4: // 건강
        return (
          <View style={styles.tabContent}>
            <Text variant="body" style={styles.textBlock}>
              {'healthBenefits' in detail ? (detail.healthBenefits as string) : ''}
            </Text>
          </View>
        );
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
    <ScreenLayout scrollable>
      <Header
        title={displayName}
        onBack={() => router.back()}
        rightAction={
          <Pressable
            onPress={() => {
              if (__DEV__) {
                console.log('Share pressed');
              }
            }}
          >
            <Icon name="share" size={20} color={colors.text} />
          </Pressable>
        }
      />

      <View style={styles.heroSection}>
        <Text style={styles.largeEmoji}>{detail.emoji}</Text>
        <Text variant="h1" bold style={styles.foodTitle}>
          {displayName}
        </Text>
        <View style={styles.tagContainer}>
          {detail.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text variant="caption" style={{ color: colors.textSecondary }}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
        <Text variant="caption" style={[styles.disclaimer, { color: colors.textSecondary }]}>
          ⚠️ {t('detail.aiImageDisclaimer')}
        </Text>
      </View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {renderTabContent()}

      <DataSourceTag source={detail.source} />

      <FeedbackButtons
        selected={feedback}
        onThumbUp={() => setFeedback(feedback === 'up' ? null : 'up')}
        onThumbDown={() => setFeedback(feedback === 'down' ? null : 'down')}
      />

      <View style={styles.bottomActions}>
        <Pressable
          style={[
            styles.favBtn,
            { borderColor: isFavorite ? colors.primary : colors.border },
          ]}
          onPress={handleFavoriteToggle}
        >
          <Icon
            name={isFavorite ? 'heart-filled' : 'heart'}
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
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  largeEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  foodTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    margin: 4,
  },
  disclaimer: {
    fontSize: 10,
    marginTop: 4,
  },
  tabContent: {
    paddingVertical: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  textBlock: {
    lineHeight: 22,
    fontSize: 14,
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

export default FoodDetailScreen;

