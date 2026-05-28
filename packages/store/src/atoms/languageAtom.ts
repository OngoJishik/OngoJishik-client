import { atom } from 'jotai';

/**
 * 지원 다국어 타입
 * @author Antigravity
 */
export type TLanguage = 'ko' | 'en' | 'ja' | 'zh';

/**
 * 현재 설정된 앱 언어 상태 Atom
 * @author Antigravity
 */
export const languageAtom = atom<TLanguage>('ko');

