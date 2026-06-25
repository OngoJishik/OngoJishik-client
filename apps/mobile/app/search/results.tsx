import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { useRecommendMutation, useImageJobQuery, useTranslatedFoodItem } from '@ongo/api-client';
import {
  ScreenLayout,
  Header,
  FoodResultCard,
  DataSourceTag,
  AIAnalysisBadge,
  Text,
  useTheme,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';
import { languageAtom } from '@ongo/store';

import type { TRecommendFoodItem } from '@ongo/api-client';

/**
 * 개별 추천 음식을 번역하고 이미지 생성 PENDING 시 상태 조회를 수행하는 래퍼 컴포넌트
 * @author Antigravity
 */
const RecommendationItem: React.FC<{
  item: TRecommendFoodItem;
  onPress: () => void;
}> = ({ item, onPress }) => {
  const lang = useAtomValue(languageAtom);
  const { translatedItem, isTranslating, translationError } = useTranslatedFoodItem(item, lang);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const isPending = item.imageStatus === 'PENDING';
  const { data: jobData, isTimedOut } = useImageJobQuery(item.imageJobId, isPending);

  // 최종 이미지 URL과 상태 결정
  let imageUrl: string | undefined = item.foodPicture || undefined;
  let status: 'PENDING' | 'COMPLETED' | 'FAILED' | undefined = item.imageStatus;

  if (isPending) {
    if (jobData?.status === 'COMPLETED' && jobData.imageUrl) {
      imageUrl = jobData.imageUrl;
      status = 'COMPLETED';
    } else if (jobData?.status === 'FAILED' || isTimedOut) {
      imageUrl = undefined;
      status = 'FAILED';
    } else {
      imageUrl = undefined;
      status = 'PENDING';
    }
  }

  return (
    <View>
      {isTranslating && (
        <View style={styles.translatingOverlay}>
          <ActivityIndicator size="small" color={designColors.primary.DEFAULT} />
          <Text variant="caption" style={{ color: colors.textSecondary, marginLeft: 6 }}>
            {t('results.translating', { defaultValue: '번역 중...' })}
          </Text>
        </View>
      )}
      {translationError && !isTranslating && (
        <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 11 }}>
          {t('results.translationFailed', { defaultValue: '번역 실패 — 원문으로 표시합니다' })}
        </Text>
      )}
      <FoodResultCard
        id={translatedItem.foodId}
        nameKo={translatedItem.foodName}
        nameLocalized={undefined}
        emoji="🍲"
        imageUrl={imageUrl}
        category={translatedItem.category as Parameters<typeof FoodResultCard>[0]['category']}
        era={undefined}
        description={Array.isArray(translatedItem.features) ? translatedItem.features.join(', ') : ''}
        onPress={onPress}
        imageStatus={status}
      />
    </View>
  );
};


/**
 * 전통 음식 검색 결과를 보여주는 화면 컴포넌트
 * POST /api/analysis/recommend 를 통해 AI 기반 음식 3개를 추천받아 렌더링합니다.
 * @author Antigravity
 */
export const SearchResultsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { q } = useLocalSearchParams<{ q: string }>();

  const queryStr = q || '';

  const { mutate: recommend, data: result, isPending, isError } = useRecommendMutation();

  useEffect(() => {
    if (queryStr.trim()) {
      recommend(queryStr);
    }
  }, [queryStr]);

  const recommendations = result?.recommendations ?? [];
  const extractedFeatures = result?.extractedFeatures ?? [];

  return (
    <ScreenLayout>
      <Header title={t('results.title')} onBack={() => router.back()} />

      <View style={[styles.queryBar, { borderBottomColor: colors.border }]}>
        <Text variant="body" bold style={{ color: colors.textSecondary }}>
          {t('results.queryPrefix')} <Text variant="body" bold style={{ color: designColors.primary.DEFAULT }}>"{queryStr}"</Text>
        </Text>
      </View>

      {isPending && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={designColors.primary.DEFAULT} />
          <Text variant="caption" style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('results.loading', { defaultValue: 'AI가 음식을 추천하고 있어요...' })}
          </Text>
        </View>
      )}

      {isError && (
        <View style={styles.loadingContainer}>
          <Text variant="body" style={{ color: colors.textSecondary }}>
            {t('results.error', { defaultValue: '추천 결과를 불러오지 못했어요. 다시 시도해주세요.' })}
          </Text>
        </View>
      )}

      {!isPending && !isError && (
        <>
          <Text variant="caption" style={[styles.resultCount, { color: colors.textSecondary }]}>
            {t('results.count', { count: recommendations.length })}
          </Text>

          {extractedFeatures.length > 0 && (
            <AIAnalysisBadge
              taste={extractedFeatures[0]}
              color={extractedFeatures[1]}
              form={extractedFeatures[2]}
              resultCount={recommendations.length}
              title={t('ai.analysisTitle')}
              tasteLabel={t('ai.taste')}
              colorLabel={t('ai.color')}
              formLabel={t('ai.form')}
              resultText={t('ai.resultCount', { count: recommendations.length })}
            />
          )}

          <FlatList
            data={recommendations}
            keyExtractor={(item) => item.foodId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RecommendationItem
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/food/[id]',
                    params: {
                      id: item.foodId,
                      imageJobId: item.imageJobId,
                      imageStatus: item.imageStatus,
                    },
                  })
                }
              />
            )}
            ListFooterComponent={<DataSourceTag source="특허청 한국전통지식포탈" />}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  queryBar: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  resultCount: {
    marginBottom: 8,
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 8,
  },
  translatingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
});

export { SearchResultsScreen as default };
