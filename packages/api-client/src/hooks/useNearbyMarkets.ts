import { useQuery } from '@tanstack/react-query';
import type { TMarket, TMarketCategory, TVworldMarketFeature } from '../types/market';
import { marketKeys } from './queryKeys';

declare const __DEV__: boolean;

const CATEGORY_KEYWORD_MAP: Record<TMarketCategory, string[]> = {
  GRAIN: ['곡물', '쌀', '방앗간', '잡곡', '정미소'],
  VEGETABLE: ['채소', '농산물', '나물', '야채', '채소류'],
  FRUIT: ['과일', '청과', '과실'],
  SEAFOOD: ['수산', '어물', '건어물', '해산물', '생선', '조개'],
  MEAT: ['정육', '축산', '고기', '닭', '오리'],
  SAUCE: ['장류', '양념', '젓갈', '간장', '된장', '고추장', '반찬'],
  HERB_MED: ['약재', '한약', '인삼', '건재', '약초'],
  ETC: [],
};

const CATEGORY_LABELS: Record<TMarketCategory, string> = {
  GRAIN: '곡물',
  VEGETABLE: '채소',
  FRUIT: '과일',
  SEAFOOD: '수산물',
  MEAT: '정육',
  SAUCE: '장류',
  HERB_MED: '약재',
  ETC: '기타',
};

/**
 * 두 지점 간의 위도/경도를 기반으로 Haversine 공식을 사용해 거리를 계산합니다.
 * @returns 두 지점 사이의 거리 (단위: km)
 * @author Antigravity
 */
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 취급품목 텍스트를 파싱하여 매칭되는 카테고리 리스트와 라벨을 반환합니다.
 * @author Antigravity
 */
const matchCategories = (itemsText: string): { categories: TMarketCategory[]; label: string } => {
  if (!itemsText) {
    return { categories: [], label: '' };
  }

  const matched: TMarketCategory[] = [];
  const keys = Object.keys(CATEGORY_KEYWORD_MAP) as TMarketCategory[];

  for (const key of keys) {
    if (key === 'ETC') continue;
    const keywords = CATEGORY_KEYWORD_MAP[key];
    const hasMatch = keywords.some((kw) => itemsText.includes(kw));
    if (hasMatch) {
      matched.push(key);
    }
  }

  const labels = matched.map((cat) => CATEGORY_LABELS[cat]);
  return {
    categories: matched,
    label: labels.join(', '),
  };
};

/**
 * vworld Data API 2.0을 사용해 반경 5km 내의 전통시장을 조회하고 정규화합니다.
 * 위치 정보가 유효할 때만 실행됩니다.
 *
 * @param params 위도, 경도 및 매칭할 식재료 카테고리 정보
 * @author Antigravity
 */
export const useNearbyMarketsQuery = (params: {
  lat?: number;
  lng?: number;
  ingredientCategories?: TMarketCategory[];
}) => {
  const { lat, lng, ingredientCategories } = params;
  const apiKey = process.env.EXPO_PUBLIC_VWORLD_API_KEY || '';

  if (__DEV__ && !apiKey) {
    console.warn(
      '[useNearbyMarketsQuery] VWORLD API Key (EXPO_PUBLIC_VWORLD_API_KEY) is missing in environment variables. Please check your .env file and restart the Expo dev server (e.g. npx expo start --clear).'
    );
  }

  return useQuery<TMarket[]>({
    queryKey: marketKeys.nearby(lat ?? 0, lng ?? 0, ingredientCategories),
    queryFn: async () => {
      if (lat === undefined || lng === undefined) {
        return [];
      }

      // vworld Data API 2.0 endpoint 및 파라미터 구성
      // ±2도 바운딩 박스를 계산하여 사용자의 주변 및 인접 지역 시장 데이터를 거리 제한 없이 가져옴
      const minLng = lng - 2.0;
      const minLat = lat - 2.0;
      const maxLng = lng + 2.0;
      const maxLat = lat + 2.0;

      const url = new URL('https://api.vworld.kr/req/data');
      url.searchParams.append('service', 'data');
      url.searchParams.append('request', 'GetFeature');
      url.searchParams.append('data', 'LT_P_TRADSIJANG');
      url.searchParams.append('key', apiKey);
      url.searchParams.append('domain', 'localhost'); // React Native 환경 기본값
      url.searchParams.append('geomFilter', `BOX(${minLng},${minLat},${maxLng},${maxLat})`);
      url.searchParams.append('size', '500'); // 최대 1000개 조회하여 클라이언트에서 정렬 및 필터링
      url.searchParams.append('format', 'json');
      url.searchParams.append('crs', 'EPSG:4326');

      if (__DEV__) {
        console.log(`[useNearbyMarketsQuery] Request URL: ${url.toString()}`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃 설정

      try {
        const response = await fetch(url.toString(), { signal: controller.signal });
        clearTimeout(timeoutId);

        if (__DEV__) {
          console.log(`[useNearbyMarketsQuery] HTTP response status: ${response.status}`);
        }
        if (!response.ok) {
          throw new Error(`vworld API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (__DEV__) {
          console.log(`[useNearbyMarketsQuery] vworld API status: ${data.response?.status}`);
          if (data.response?.status === 'OK') {
            console.log(
              `[useNearbyMarketsQuery] Total records: ${data.response.record?.total}, Fetched count: ${data.response.result?.featureCollection?.features?.length}`
            );
          }
        }

        // 응답 상태 확인
        if (data.response?.status === 'NOT_FOUND') {
          return [];
        }

        if (data.response?.status !== 'OK') {
          if (__DEV__) {
            console.warn('vworld API status is not OK:', data.response?.error?.text || 'Unknown error');
          }
          return [];
        }

        const features: TVworldMarketFeature[] =
          data.response?.result?.featureCollection?.features ?? [];

        const normalized: TMarket[] = features.map((feat) => {
          const props = feat.properties;
          const [featLng, featLat] = feat.geometry.coordinates;
          const distanceKm = calculateDistanceKm(lat, lng, featLat, featLng);
          const { categories, label } = matchCategories(props.items);

          return {
            id: feat.id,
            name: props.name,
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            addressRoad: props.adr_road || props.adr_jibun || '',
            openCycle: props.opn_per || '',
            matchedCategories: categories,
            categoryLabel: label,
            hasParking: props.park === 'Y',
            latitude: featLat,
            longitude: featLng,
          };
        });

        // 정렬 조건:
        // 1. ingredientCategories와 일치하는 카테고리를 가진 시장이 상단
        // 2. 그 안에서는 거리 오름차순
        // 3. 일치하지 않는 시장은 거리 오름차순으로 하단에 배치
        return normalized.sort((a, b) => {
          const aHasMatch = ingredientCategories
            ? a.matchedCategories.some((cat) => ingredientCategories.includes(cat))
            : false;
          const bHasMatch = ingredientCategories
            ? b.matchedCategories.some((cat) => ingredientCategories.includes(cat))
            : false;

          if (aHasMatch && !bHasMatch) return -1;
          if (!aHasMatch && bHasMatch) return 1;
          return a.distanceKm - b.distanceKm;
        }).slice(0, 30); // 상위 30개만 선택하여 모바일 리스트 성능 최적화
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to fetch nearby markets:', error);
        }
        throw error;
      }
    },
    enabled: lat !== undefined && lng !== undefined && !!apiKey,
    staleTime: 0, // 항상 만료 상태로 간주하여 컴포넌트 마운트/활성화 시 매번 백그라운드 요청을 새로 보냄
    gcTime: 5 * 60 * 1000, // 5분 동안 미사용 캐시 유지
  });
};
