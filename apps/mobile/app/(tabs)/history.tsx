import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  HistorySection,
  LiteratureQuote,
  Text,
} from '@ongo/ui';

import { MOCK_HISTORY_STORY, MOCK_QUOTES } from '../../mocks';

/**
 * 역사 탐색 화면 컴포넌트
 * 삼국시대부터 조선시대까지 우리 전통 음식의 시간 속 기록을 탐색합니다.
 * @author Antigravity
 */
export const HistoryTabScreen = () => {
  const { t } = useTranslation();

  return (
    <ScreenLayout scrollable>
      <Header title={`📖 ${t('history.title')}`} />
      
      <View style={styles.content}>
        <Text variant="h3" bold style={styles.introTitle}>
          {t('history.introTitle')}
        </Text>
        <Text variant="bodySecondary" style={styles.introDesc}>
          {t('history.introDesc')}
        </Text>

        <HistorySection
          type="origin"
          icon="📜"
          title={`유래 이야기 (${MOCK_HISTORY_STORY.era})`}
          content={MOCK_HISTORY_STORY.story}
        />

        <Text variant="h3" bold style={styles.sectionTitle}>
          {t('history.literatureQuotes')}
        </Text>

        {MOCK_QUOTES.map((quote, idx) => (
          <LiteratureQuote
            key={idx}
            sourceName={quote.sourceName}
            quoteOriginal={quote.quoteOriginal}
            quoteTranslation={quote.quoteTranslation}
            era={quote.era}
          />
        ))}
      </View>
    </ScreenLayout>
  );
};

export default HistoryTabScreen;

const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
  },
  introTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  introDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 16,
  },
});
