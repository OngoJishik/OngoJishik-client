/**
 * 전통시장 연계 기능에 사용되는 공통 타입 정의
 * @author Antigravity
 */

export type TMarketCategory =
  | 'GRAIN'
  | 'VEGETABLE'
  | 'FRUIT'
  | 'SEAFOOD'
  | 'MEAT'
  | 'SAUCE'
  | 'HERB_MED'
  | 'ETC';

/**
 * vworld전통시장 레이어(LT_P_TRADSIJANG)의 properties 스펙
 * @author Antigravity
 */
export type TVworldMarketProperties = {
  name: string;
  category: string;
  adr_road: string;
  adr_jibun?: string;
  opn_per: string;
  items: string;
  park: string; // 'Y' | 'N'
};

/**
 * vworld API 응답 Feature 타입
 * @author Antigravity
 */
export type TVworldMarketFeature = {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: TVworldMarketProperties;
};

/**
 * 앱 전반에서 사용하기 위해 정규화된 시장 데이터 구조
 * @author Antigravity
 */
export type TMarket = {
  id: string;
  name: string;
  distanceKm: number;
  addressRoad: string;
  openCycle: string;
  matchedCategories: TMarketCategory[];
  categoryLabel: string;
  hasParking: boolean;
  latitude: number;
  longitude: number;
};

/**
 * 근처 전통시장 조회를 위한 파라미터 타입
 * @author Antigravity
 */
export type TNearbyMarketsParams = {
  lat: number;
  lng: number;
  ingredientCategories?: TMarketCategory[];
};
