import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
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

import { MOCK_RESULTS } from '../../mocks';

/**
 * 전통 음식 검색 결과를 보여주는 화면 컴포넌트
 * 입력된 쿼리에 근거해 AI 분석 배지 및 검색 결과를 정렬 렌더링합니다.
 * @author Antigravity
 */
export const SearchResultsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { q } = useLocalSearchParams<{ q: string }>();

  const queryStr = q || '';

  // Extract mock values based on search terms
  const hasTaste = queryStr.includes('매콤') || queryStr.includes('매운') || queryStr.includes('빨간');
  const hasColor = queryStr.includes('빨간') || queryStr.includes('빨강');
  const hasForm = queryStr.includes('국물') || queryStr.includes('탕') || queryStr.includes('찌개');

  return (
    <ScreenLayout>
      <Header title={t('results.title')} onBack={() => router.back()} />

      <View style={[styles.queryBar, { borderBottomColor: colors.border }]}>
        <Text variant="body" bold style={{ color: colors.textSecondary }}>
          {t('results.queryPrefix')} <Text variant="body" bold style={{ color: designColors.primary.DEFAULT }}>"{queryStr}"</Text>
        </Text>
      </View>

      <Text variant="caption" style={[styles.resultCount, { color: colors.textSecondary }]}>
        {t('results.count', { count: MOCK_RESULTS.length })}
      </Text>

      {(hasTaste || hasColor || hasForm) && (
        <AIAnalysisBadge
          taste={hasTaste ? '매운맛' : undefined}
          color={hasColor ? '빨강' : undefined}
          form={hasForm ? '국/탕' : undefined}
          resultCount={MOCK_RESULTS.length}
          title={t('ai.analysisTitle')}
          tasteLabel={t('ai.taste')}
          colorLabel={t('ai.color')}
          formLabel={t('ai.form')}
          resultText={t('ai.resultCount', { count: MOCK_RESULTS.length })}
        />
      )}

      <FlatList
        data={MOCK_RESULTS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodResultCard
            id={item.id}
            nameKo={item.nameKo}
            nameLocalized={item.nameLocalized}
            emoji={item.emoji}
            category={item.category}
            era={item.era}
            description={item.description}
            onPress={() => router.push(`/food/${item.id}`)}
          />
        )}
        ListFooterComponent={<DataSourceTag source="특허청 한국전통지식포탈" />}
        contentContainerStyle={styles.listContainer}
      />
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
});

export { SearchResultsScreen as default };
