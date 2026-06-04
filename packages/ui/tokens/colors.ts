/**
 * 온고지식 서비스의 색상 토큰 정의 (Figma 명세 준수)
 * 한국 전통 단청/한지 색상 시스템을 반영합니다.
 * @author Antigravity
 */
export const colors = {
  // ── 브랜드 (적갈색 — 한국 전통 적토·단청 색) ──
  primary: {
    DEFAULT: '#962E22',   // 메인 브랜드: TabBar active, 레시피 태그 배경, AI 분석 제목
    dark:    '#6B241A',   // FeaturedCard 그라데이션 끝
  },

  // ── 자연 초록 (산림·나물 색) ──
  green: {
    DEFAULT: '#345237',   // 시대 태그 배경, AI 분석 결과 강조 텍스트
  },

  // ── 따뜻한 중성색 (한지·흙·옻 계열) ──
  surface: {
    base:    '#FDFBF7',   // 카드 배경 (FoodCard, ResultCard, PostCard)
    light:   '#F9F6F0',   // 화면/섹션 배경 (TabBar 배경)
    muted:   '#F2EDE3',   // 이미지 영역 배경, 카테고리 칩 배경
  },

  border: {
    DEFAULT: '#E0D9CE',   // 카드 border, 구분선, BottomNav 상단선
  },

  text: {
    primary:   '#261E17', // 제목, 음식 이름 (가장 진한 색)
    secondary: '#665C51', // 본문, 설명, 카테고리 라벨
    tertiary:  '#9E9487', // 비활성 탭, 날짜, 화살표, 좋아요 아이콘
  },

  // ── AI 분석 영역 (보라 계열 — 다른 영역과 시각적 구분) ──
  ai: {
    background: '#F2F0F7',
    border:     '#D9D1E5',
  },

  // ── FeaturedCard 전용 (적갈색 그라데이션 위의 텍스트) ──
  featured: {
    subtitle:    '#FFD9BF', // "오늘의 추천 전통 음식", 한자명
    description: '#FFE5D9', // 설명 텍스트
    tagBg:       'rgba(255, 255, 255, 0.2)', // 카테고리 태그 배경
  },

  // ── 시스템 ──
  white:   '#FFFFFF',
  black:   '#000000',

  // ── 의미 색상 ──
  semantic: {
    error:   '#D32F2F',
    success: '#2E7D32',
    warning: '#F9A825',
    info:    '#1565C0',
  },

  // ── 토글 (Switch 컴포넌트 전용) ──
  toggle: {
    trackInactive: '#D4CFC6',
    trackActive: '#FCEBE9',
    thumbInactive: '#F2EDE3',
  },

  // ── 전통 카테고리 색상 ──
  category: {
    tteok:    '#E8A87C', // 떡류
    soup:     '#962E22', // 국/탕류 (브랜드 적갈색 통일)
    grill:    '#8B5E3C', // 구이류
    namul:    '#345237', // 나물/무침류 (초록 통일)
    jjim:     '#B85C38', // 찜/조림류
    myeon:    '#D4CFC6', // 면류
    hangwa:   '#E8C87C', // 한과/유밀과류
    eumchung: '#7CB87C', // 음청류
  },

  // ── 하위 호환성 매핑 (Neutral & Legacy) ──
  neutral: {
    0:   '#FFFFFF',
    50:  '#F9F6F0',  // surface.light
    100: '#F2EDE3',  // surface.muted
    200: '#E0D9CE',  // border.DEFAULT
    300: '#D4CFC6',
    500: '#9E9487',  // text.tertiary
    700: '#665C51',  // text.secondary
    900: '#261E17',  // text.primary
  },
};

export type ColorTheme = typeof colors;
