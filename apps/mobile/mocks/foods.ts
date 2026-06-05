import type { FoodCategory } from '@ongo/utils';

/**
 * 모바일 앱에서 사용되는 전통 음식 Mock 데이터 목록
 * @author Antigravity
 */
export const MOCK_FOODS = [
  {
    id: 'yukgaejang',
    nameKo: '육개장',
    nameLocalized: 'Yukgaejang',
    emoji: '🍲',
    category: 'soup' as FoodCategory,
    era: '조선시대',
    description: '매콤하고 깊은 맛의 소고기 국물 요리로 대파와 고사리를 듬뿍 넣어 푹 끓여낸 대표적인 전통 보양식.',
  },
  {
    id: 'gujelpan',
    nameKo: '구절판',
    nameLocalized: 'Gujeolpan',
    emoji: '🍱',
    category: 'tteok' as FoodCategory,
    era: '조선시대',
    description: '아홉 가지 재료를 둥근 목기에 담아내어 얇은 밀전병에 정성스럽게 싸 먹는 품격 높은 궁중 요리.',
  },
  {
    id: 'sinseollo',
    nameKo: '신선로',
    nameLocalized: 'Sinseollo',
    emoji: '🫕',
    category: 'soup' as FoodCategory,
    era: '조선시대',
    description: '여러 가지 어육과 채소를 신선로틀에 돌려 담고 장국을 부어 끓여 먹는 궁중 전골.',
  },
  {
    id: 'mandutguk',
    nameKo: '만두국',
    nameLocalized: 'Mandutguk',
    emoji: '🥟',
    category: 'soup' as FoodCategory,
    era: '조선시대',
    description: '고기와 야채로 속을 채운 만두를 사골 육수에 끓인 보양 국물 요리.',
  },
  {
    id: 'yakgwa',
    nameKo: '약과',
    nameLocalized: 'Yakgwa',
    emoji: '🍯',
    category: 'hangwa' as FoodCategory,
    era: '조선시대',
    description: '밀가루에 참기름, 꿀, 술을 넣고 반죽하여 기름에 지져 낸 고소하고 달콤한 한과.',
  },
];

export const MOCK_RECOMMENDATION = {
  id: 'gujelpan',
  nameKo: '구절판',
  nameLocalized: 'Gujeolpan',
  emoji: '🍱',
  subtitle: '아홉 가지 재료를 담은 궁중 요리',
  description: '밀전병을 중심에 두고 주위에 여덟 가지 고명(고기, 미나리, 버섯, 지단 등)을 채워 가며 싸 먹는 호화로운 조선 시대 궁중 음식입니다.',
};

export const MOCK_RESULTS = [
  {
    id: 'yukgaejang',
    nameKo: '육개장',
    nameLocalized: 'Yukgaejang',
    emoji: '🍲',
    category: 'soup' as FoodCategory,
    era: '조선시대',
    description: '매콤하고 깊은 맛의 소고기 국물 요리로 대파와 고사리를 듬뿍 넣어 푹 끓여낸 대표적인 전통 보양식.',
  },
  {
    id: 'gujelpan',
    nameKo: '구절판',
    nameLocalized: 'Gujeolpan',
    emoji: '🍱',
    category: 'tteok' as FoodCategory,
    era: '조선시대',
    description: '아홉 가지 재료를 둥근 목기에 담아내어 얇은 밀전병에 정성스럽게 싸 먹는 품격 높은 궁중 요리.',
  },
];

export const MOCK_DETAILS = {
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
  literatureQuotes: [
    {
      sourceName: '시의전서 (Space)',
      quoteOriginal: '육개장(肉芥醬)은 고기를 삶아 짓이겨 온갖 양념을 짜고 파를 많이 넣어 푹 삶는다.',
      quoteTranslation: '소고기를 푹 삶아 가늘게 결대로 찢은 후 갖은 양념에 무쳐 대파를 듬뿍 넣고 깊은 맛이 우러나올 때까지 끓여 낸다.',
      era: '조선 말기',
    }
  ],
  healthBenefits: '소고기의 단백질 and 대파의 알리신 성분이 결합하여 피로 회복과 면역력 증진에 도움을 줍니다. 따뜻한 성질의 대파 and 고사리는 혈액 순환을 돕고 몸을 따뜻하게 보호합니다.',
};
