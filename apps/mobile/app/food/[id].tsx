import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

// Mock food detail data
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
    sourceName: '시의전서 (是議全書)',
    quoteOriginal: '육개장(肉芥醬)은 고기를 삶아 짓이겨 온갖 양념을 짜고 파를 많이 넣어 푹 삶는다.',
    quoteTranslation: '소고기를 푹 삶아 가늘게 결대로 찢은 후 갖은 양념에 무쳐 대파를 듬뿍 넣고 깊은 맛이 우러나올 때까지 끓여 낸다.',
    era: '조선 말기',
  },
  healthBenefits: '소고기의 단백질과 대파의 알리신 성분이 결합하여 피로 회복과 면역력 증진에 도움을 줍니다. 따뜻한 성질의 대파와 고사리는 혈액 순환을 돕고 몸을 따뜻하게 보호합니다.',
};

export default function FoodDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('조리법');
  const [isFavorite, setIsFavorite] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const tabs = ['조리법', '식재료', '역사이야기', '문헌', '건강'];

  const renderTabContent = () => {
    switch (activeTab) {
      case '식재료':
        return (
          <View style={styles.tabContent}>
            {MOCK_DETAILS.ingredients.map((ing, index) => (
              <View key={index} style={[styles.ingredientRow, { borderBottomColor: colors.border }]}>
                <Text style={{ marginRight: 8, color: colors.primary }}>•</Text>
                <Text variant="body">{ing}</Text>
              </View>
            ))}
          </View>
        );
      case '역사이야기':
        return (
          <View style={styles.tabContent}>
            <HistorySection story={MOCK_DETAILS.historyStory} />
          </View>
        );
      case '문헌':
        return (
          <View style={styles.tabContent}>
            <LiteratureQuote
              sourceName={MOCK_DETAILS.literature.sourceName}
              quoteOriginal={MOCK_DETAILS.literature.quoteOriginal}
              quoteTranslation={MOCK_DETAILS.literature.quoteTranslation}
              era={MOCK_DETAILS.literature.era}
            />
          </View>
        );
      case '건강':
        return (
          <View style={styles.tabContent}>
            <Text variant="body" style={styles.textBlock}>
              {MOCK_DETAILS.healthBenefits}
            </Text>
          </View>
        );
      case '조리법':
      default:
        return (
          <View style={styles.tabContent}>
            {MOCK_DETAILS.recipeSteps.map((step) => (
              <RecipeStep
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                isLast={step.stepNumber === MOCK_DETAILS.recipeSteps.length}
              />
            ))}
          </View>
        );
    }
  };

  return (
    <ScreenLayout scrollable>
      <Header
        title={MOCK_DETAILS.nameKo}
        onBack={() => router.back()}
        rightAction={
          <Pressable onPress={() => console.log('Share')}>
            <Icon name="share" size={20} />
          </Pressable>
        }
      />

      <View style={styles.heroSection}>
        <Text style={styles.largeEmoji}>{MOCK_DETAILS.emoji}</Text>
        <Text variant="h1" bold style={styles.foodTitle}>
          {MOCK_DETAILS.nameLocalized} ({MOCK_DETAILS.nameKo})
        </Text>
        <View style={styles.tagContainer}>
          {MOCK_DETAILS.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text variant="caption" style={{ color: colors.textSecondary }}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
        <Text variant="caption" style={[styles.disclaimer, { color: colors.textSecondary }]}>
          ⚠️ 사용자 이해를 돕기 위한 상징적 이모지 연출입니다.
        </Text>
      </View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {renderTabContent()}

      <DataSourceTag source={MOCK_DETAILS.source} />

      <FeedbackButtons
        selected={feedback}
        onThumbUp={() => setFeedback(feedback === 'up' ? null : 'up')}
        onThumbDown={() => setFeedback(feedback === 'down' ? null : 'down')}
      />

      <View style={styles.bottomActions}>
        <Pressable
          style={[styles.favBtn, { borderColor: isFavorite ? colors.primary : colors.border }]}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Icon name={isFavorite ? 'heart-filled' : 'heart'} size={24} color={isFavorite ? colors.primary : colors.textSecondary} />
        </Pressable>
        <Button
          title="📋 재료 구매처 보기 (전통시장)"
          onPress={() => console.log('Link to traditional markets')}
          style={styles.marketBtn}
        />
      </View>
    </ScreenLayout>
  );
}

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
