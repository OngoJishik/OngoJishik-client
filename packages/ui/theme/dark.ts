import { colors } from '../tokens/colors';
import { Theme } from './light';

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#1C1A16',          // 옻칠/전통 한지 어두운 배경색
    card: '#2C2520',                // 어두운 목재 톤 카드 배경
    text: '#F5F3EF',                // 밝은 한지 미색 텍스트
    textSecondary: '#A69E92',       // 중간 밝기 텍스트
    textTertiary: '#7A746B',        // 다크모드용 비활성/보조 텍스트
    border: '#453E35',              // 어두운 테두리 및 구분선
    primary: '#E57373',             // 다크모드용 소프트 적갈색
    primaryLight: '#3C1E1A',        // 어두운 적갈색 배경색
    surfaceLight: '#25201C',        // 어두운 한지 미색 대응 배경색
    secondary: '#81C784',           // 다크모드용 소프트 자연 초록
    success: colors.semantic.success,
    error: colors.semantic.error,
    warning: colors.semantic.warning,
    info: colors.semantic.info,
  },
};

