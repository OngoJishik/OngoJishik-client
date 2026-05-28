import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  ScreenLayout,
  Header,
  HistorySection,
  LiteratureQuote,
  Text,
} from '@ongo/ui';

const MOCK_HISTORY_STORY = {
  era: '조선시대 (19세기)',
  story: '육개장은 조선 시대 대구 지방의 향토 음식에서 유래한 고기 국물 요리입니다. 원래 개고기를 끓인 개장국에서 출발하였으나, 개고기를 먹지 못하는 사람들을 위해 소고기(육, 肉)를 사용하기 시작하면서 육개장이라는 이름이 탄생하였습니다. 매콤한 고춧가루 양념과 잘게 찢은 소고기, 대파, 토란대 등을 가득 넣어 삼복더위에 기운을 돋우는 대표적인 보양식으로 즐겼습니다.',
};

const MOCK_QUOTES = [
  {
    sourceName: '동국세시기 (東國歲時記)',
    quoteOriginal: '복날에 개장국을 끓여 먹으며 땀을 내면 더위를 물리치고 보신이 된다.',
    quoteTranslation: '삼복더위에는 파를 듬뿍 넣은 매콤한 장국을 먹고 땀을 흘림으로써 몸 안에 머물고 있는 나쁜 기운을 배출하고 건강을 증진시킨다.',
    era: '조선 정조~헌종',
  },
  {
    sourceName: '시의전서 (是議全書)',
    quoteOriginal: '육개장(肉芥醬)은 고기를 삶아 짓이겨 온갖 양념을 짜고 파를 많이 넣어 푹 삶는다.',
    quoteTranslation: '소고기를 푹 삶아 가늘게 결대로 찢은 후 갖은 양념에 무쳐 대파를 듬뿍 넣고 깊은 맛이 우러나올 때까지 끓여 낸다.',
    era: '조선 말기',
  },
];

export default function HistoryTabScreen() {
  return (
    <ScreenLayout scrollable>
      <Header title="📖 역사 탐색" />
      
      <View style={styles.content}>
        <Text variant="h3" bold style={styles.introTitle}>
          시간을 담은 우리의 맛
        </Text>
        <Text variant="bodySecondary" style={styles.introDesc}>
          전통 지식 데이터베이스와 고문헌 기록을 바탕으로 엄선한 우리 고유 음식의 역사와 문헌적 유래를 확인하세요.
        </Text>

        <HistorySection
          era={MOCK_HISTORY_STORY.era}
          story={MOCK_HISTORY_STORY.story}
        />

        <Text variant="h3" bold style={styles.sectionTitle}>
          고문헌 속 원문 인용
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
}

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
