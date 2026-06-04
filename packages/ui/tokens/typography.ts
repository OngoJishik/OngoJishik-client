/**
 * 온고지식 서비스의 타이포그래피 토큰 정의 (Figma 명세 준수)
 * @author Antigravity
 */
export const typography = {
  // ── Figma 추출 타이포그래피 시스템 ──
  // 제목
  display: {
    fontSize: 28,
    fontWeight: '700' as const, // Bold
  },
  heading: {
    large: { fontSize: 24, fontWeight: '700' as const },  // 헤더 제목
    medium: { fontSize: 20, fontWeight: '700' as const },  // ResultCard 음식 이름
  },

  // 본문
  body: {
    large:  { fontSize: 16, fontWeight: '700' as const },  // FoodCard 음식 이름
    medium: { fontSize: 14, fontWeight: '600' as const },  // PostCard 작성자, TabBar 선택
    small:  { fontSize: 13, fontWeight: '500' as const },  // PostCard 본문, AI 제목
  },

  // 캡션/라벨
  caption: {
    medium: { fontSize: 12, fontWeight: '400' as const },  // 로마자 표기, 설명, 날짜
    small:  { fontSize: 11, fontWeight: '500' as const },  // 태그 텍스트, PostCard 시간
    tiny:   { fontSize: 10, fontWeight: '500' as const },  // BottomNav 라벨, Tag
  },

  // 폰트 패밀리
  fontFamily: {
    sans: 'Inter',
  },

  // ── 하위 호환성용 스케일 (Legacy Support) ──
  fontFamilies: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};
export type TypographyTheme = typeof typography;
