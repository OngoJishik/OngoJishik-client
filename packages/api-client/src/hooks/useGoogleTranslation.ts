import { useState, useEffect } from 'react';

import { translateFoodItem, translateFoodDetail } from '../translationService';
import type { TRecommendFoodItem, TFoodDetail } from '../types/food';

/**
 * 지원 언어 타입 (순환 참조 방지를 위해 @ongo/store에서 복사)
 * @author Antigravity
 */
type TLanguage = 'ko' | 'en' | 'ja' | 'zh';

/**
 * 음식 추천 아이템 단건을 현재 언어로 번역하는 훅.
 * lang이 'ko'이면 번역 없이 원문을 반환합니다.
 * @param item 번역할 음식 추천 아이템
 * @param lang 현재 앱 언어
 * @returns translatedItem, isTranslating, translationError
 * @author Antigravity
 */
export const useTranslatedFoodItem = (
  item: TRecommendFoodItem,
  lang: TLanguage
) => {
  const [translatedItem, setTranslatedItem] = useState<TRecommendFoodItem>(item);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    // 한국어는 번역 불필요
    if (lang === 'ko') {
      setTranslatedItem(item);
      setTranslationError(null);
      return;
    }

    let cancelled = false;

    const runTranslation = async () => {
      setIsTranslating(true);
      setTranslationError(null);
      try {
        const result = await translateFoodItem(item, lang);
        if (!cancelled) {
          setTranslatedItem(result);
        }
      } catch {
        if (!cancelled) {
          setTranslatedItem(item);
          setTranslationError('translation_failed');
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    runTranslation();

    return () => {
      cancelled = true;
    };
    // item.foodId + lang이 변경될 때만 재번역
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.foodId, lang]);

  return { translatedItem, isTranslating, translationError };
};

/**
 * 음식 상세 데이터 전체를 현재 언어로 번역하는 훅.
 * lang이 'ko'이면 번역 없이 원문을 반환합니다.
 * @param detail 번역할 음식 상세 데이터 (undefined일 수 있음)
 * @param lang 현재 앱 언어
 * @returns translatedDetail, isTranslating, translationError
 * @author Antigravity
 */
export const useTranslatedFoodDetail = (
  detail: TFoodDetail | undefined,
  lang: TLanguage
) => {
  const [translatedDetail, setTranslatedDetail] = useState<TFoodDetail | undefined>(detail);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    // 데이터 없으면 스킵
    if (!detail) {
      setTranslatedDetail(undefined);
      return;
    }

    // 한국어는 번역 불필요
    if (lang === 'ko') {
      setTranslatedDetail(detail);
      setTranslationError(null);
      return;
    }

    let cancelled = false;

    const runTranslation = async () => {
      setIsTranslating(true);
      setTranslationError(null);
      try {
        const result = await translateFoodDetail(detail, lang);
        if (!cancelled) {
          setTranslatedDetail(result);
        }
      } catch {
        if (!cancelled) {
          setTranslatedDetail(detail);
          setTranslationError('translation_failed');
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    runTranslation();

    return () => {
      cancelled = true;
    };
    // detail의 id + lang이 변경될 때만 재번역
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.id, lang]);

  return { translatedDetail, isTranslating, translationError };
};
