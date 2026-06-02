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

// Mock food detail data for premium visual layout fallbacks
const MOCK_DETAILS = {
  id: 'yukgaejang',
  nameKo: '육개장',
  nameLocalized: 'Yukgaejang',
  emoji: '🍲',
  category: 'soup',
  tags: ['국/탕류', '매운맛', '보양식', '소고기'],
  source: '특허청 한국전통지식포탈',
  ingredients: ['소고기(양지머리) 300g', '대파 3대', '고사리 100g', '토란대 100g', '느타리버섯 50g', '고춧가루 3큰술', '국간장 2큰술', '다진 마늘 1큰술'],
  recipeSteps: [
    { stepNumber: 1, title: '소고기 삶기', description: '냄비에 물을 충분히 붓고 소고기 양지머리를 넣어 푹 삶아 낸 후, 식혀서 결대로 가늘게 찢어 둡니다. 육수는 버리지 않고 체에 걸러 둡니다.' },
    { stepNumber: 2, title: '야채 데치고 양념하기', description: '대파는 반으로 갈라 5cm 길이로 썰어 데치고 고사리와 토란대도 끓는 물에 데쳐 둡니다. 가늘게 찢은 소고기, 대파, 고사리, 토란대에 고춧가루, 국간장, 다진 마늘, 참기름 등을 섞어 버무립니다.' },
    { stepNumber: 3, title: '육수 붓고 끓이기', description: '끓여 둔 고기 육수에 양념한 고기와 야채를 넣고 센 불에서 끓이다가 중약 불로 줄여 깊은 맛이 우러날 때까지 푹 끓여 냅니다.' },
  ],
  historyStory: '육개장은 조선 시대 대구 지방의 향토 음식에서 유래한 고기 국물 요리입니다. 삼복더위에 기운을 돋우는 대표적인 보양식으로 즐겼으며 고종황제도 즐겨 먹었던 궁중 보양 음식 중 하나입니다.',
  literature: {
    sourceName: '시의전서 (Space)',
    quoteOriginal: '육개장(肉芥醬)은 고기를 삶아 짓이겨 온갖 양념을 짜고 파를 많이 넣어 푹 삶는다.',
    quoteTranslation: '소고기를 푹 삶아 가늘게 결대로 찢은 후 갖은 양념에 무쳐 대파를 듬뿍 넣고 깊은 맛이 우러나올 때까지 끓여 낸다.',
    era: '조선 말기',
  },
  healthBenefits: '소고기의 단백질 and 대파의 알리신 성분이 결합하여 피로 회복과 면역력 증진에 도움을 줍니다. 따뜻한 성질의 대파와 고사리는 혈액 순환을 돕고 몸을 따뜻하게 보호합니다.',
};

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

  const [activeTab, setActiveTab] = useState('조리법');
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isFavorite = favorites.includes(foodId);
  const displayName = formatFoodName(detail.nameKo, detail.nameLocalized, currentLang);

  const tabs = [
    t('detail.recipe'),
    t('detail.ingredients'),
    t('detail.historyStory'),
    t('detail.literature'),
    t('detail.health')
  ];

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
            <HistorySection story={storyText} />
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
          title="📋 재료 구매처 보기 (전통시장)"
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

