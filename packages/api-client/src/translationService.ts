import type { TRecommendFoodItem } from './types/food';
import type { TFoodDetail } from './types/food';

declare const __DEV__: boolean;

/**
 * Google Cloud Translation API v2 요청 응답 타입
 * @author Antigravity
 */
type TGoogleTranslationResponse = {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
};

const TRANSLATION_API_BASE = 'https://translation.googleapis.com/language/translate/v2';

/**
 * 텍스트 배열을 Google Cloud Translation API로 번역합니다.
 * 실패 시 원문 배열을 그대로 반환합니다.
 * @param texts 번역할 텍스트 배열
 * @param targetLang 대상 언어 코드 (en, ja, zh 등)
 * @returns 번역된 텍스트 배열
 * @author Antigravity
 */
export const translateTexts = async (texts: string[], targetLang: string): Promise<string[]> => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_TRANSLATION_API_KEY;

  if (!apiKey) {
    if (__DEV__) {
      console.warn('[Translation] EXPO_PUBLIC_GOOGLE_TRANSLATION_API_KEY is not set. Returning original texts.');
    }
    return texts;
  }

  // 빈 텍스트는 건너뜀
  const nonEmptyTexts = texts.filter((t) => t.trim().length > 0);
  if (nonEmptyTexts.length === 0) {
    return texts;
  }

  try {
    const response = await fetch(`${TRANSLATION_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        source: 'ko',
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as TGoogleTranslationResponse;
    return json.data.translations.map((t) => t.translatedText);
  } catch (error) {
    if (__DEV__) {
      console.warn('[Translation] Failed to translate texts:', error);
    }
    return texts;
  }
};

/**
 * 음식 추천 결과 아이템을 지정 언어로 번역합니다.
 * foodName은 「한국어이름 (번역이름)」 형식으로 가공합니다.
 * 실패 시 원문 아이템을 그대로 반환합니다.
 * @param item 번역할 음식 추천 아이템
 * @param targetLang 대상 언어 코드
 * @returns 번역된 음식 추천 아이템
 * @author Antigravity
 */
export const translateFoodItem = async (
  item: TRecommendFoodItem,
  targetLang: string
): Promise<TRecommendFoodItem> => {
  const textsToTranslate = [
    item.foodName,
    item.category,
    ...item.features,
  ];

  const translated = await translateTexts(textsToTranslate, targetLang);

  const translatedFoodName = translated[0] ?? item.foodName;
  const translatedCategory = translated[1] ?? item.category;
  const translatedFeatures = translated.slice(2);

  // 음식 이름 포맷: 「냉면」 → 「Naengmyeon (Cold Noodles)」
  const formattedFoodName =
    translatedFoodName !== item.foodName
      ? `${item.foodName} (${translatedFoodName})`
      : item.foodName;

  return {
    ...item,
    foodName: formattedFoodName,
    category: translatedCategory,
    features: translatedFeatures,
  };
};

/**
 * 음식 상세 정보 전체를 지정 언어로 번역합니다.
 * 실패 시 원본 데이터를 그대로 반환합니다.
 * @param detail 번역할 음식 상세 데이터
 * @param targetLang 대상 언어 코드
 * @returns 번역된 음식 상세 데이터
 * @author Antigravity
 */
export const translateFoodDetail = async (
  detail: TFoodDetail,
  targetLang: string
): Promise<TFoodDetail> => {
  // 번역할 텍스트 목록 구성 (순서 유지가 중요)
  const baseTexts: string[] = [
    detail.nameKo,                        // 0: 음식 이름
    detail.description,                   // 1: 설명
    detail.historyStory ?? '',            // 2: 역사 이야기
    detail.ritualContext ?? '',           // 3: 의례 문맥
    detail.healthBenefits ?? '',          // 4: 건강 효능
  ];

  const ingredientTexts = detail.ingredients ?? [];
  const recipeStepTitles = (detail.recipeSteps ?? []).map((s) => s.title);
  const recipeStepDescs = (detail.recipeSteps ?? []).map((s) => s.description);
  const tagTexts = detail.tags ?? [];

  const allTexts = [
    ...baseTexts,
    ...ingredientTexts,
    ...recipeStepTitles,
    ...recipeStepDescs,
    ...tagTexts,
  ];

  const translated = await translateTexts(allTexts, targetLang);

  let idx = 0;
  const translatedName = translated[idx++] ?? detail.nameKo;
  const translatedDescription = translated[idx++] ?? detail.description;
  const translatedHistoryStory = translated[idx++] || detail.historyStory;
  const translatedRitualContext = translated[idx++] || detail.ritualContext;
  const translatedHealthBenefits = translated[idx++] || detail.healthBenefits;

  const translatedIngredients = ingredientTexts.map(() => translated[idx++] ?? '');
  const translatedStepTitles = recipeStepTitles.map(() => translated[idx++] ?? '');
  const translatedStepDescs = recipeStepDescs.map(() => translated[idx++] ?? '');
  const translatedTags = tagTexts.map(() => translated[idx++] ?? '');

  // 음식 이름 포맷: 「냉면」 → 「냉면 (Naengmyeon)」
  const formattedName =
    translatedName !== detail.nameKo
      ? `${detail.nameKo} (${translatedName})`
      : detail.nameKo;

  return {
    ...detail,
    nameKo: formattedName,
    nameLocalized: translatedName,
    description: translatedDescription,
    historyStory: translatedHistoryStory,
    ritualContext: translatedRitualContext,
    healthBenefits: translatedHealthBenefits,
    ingredients: translatedIngredients.length > 0 ? translatedIngredients : detail.ingredients,
    recipeSteps: (detail.recipeSteps ?? []).map((step, i) => ({
      ...step,
      title: translatedStepTitles[i] ?? step.title,
      description: translatedStepDescs[i] ?? step.description,
    })),
    tags: translatedTags.length > 0 ? translatedTags : detail.tags,
  };
};
