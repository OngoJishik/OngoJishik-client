import { colors } from '../tokens/colors';

export const lightTheme = {
  dark: false,
  colors: {
    background: colors.white,          // 아키텍처 14.10: 모든 화면 기본 배경 (#FFFFFF)
    card: colors.surface.base,         // 카드 배경 (#FDFBF7)
    text: colors.text.primary,         // 제목 및 중요 텍스트 (#261E17)
    textSecondary: colors.text.secondary, // 설명 및 본문 (#665C51)
    textTertiary: colors.text.tertiary, // 비활성 탭, 날짜, 아이콘 (#9E9487)
    border: colors.border.DEFAULT,     // 카드 테두리 및 구분선 (#E0D9CE)
    primary: colors.primary.DEFAULT,   // 단청 적갈색 브랜드 컬러 (#962E22)
    primaryLight: colors.surface.muted, // 이미지/입력창 배경 (#F2EDE3)
    surfaceLight: colors.surface.light, // 한지 미색 배경 (#F9F6F0)
    secondary: colors.green.DEFAULT,    // 자연 초록 (#345237)
    success: colors.semantic.success,
    error: colors.semantic.error,
    warning: colors.semantic.warning,
    info: colors.semantic.info,
  },
};
export type Theme = typeof lightTheme;

