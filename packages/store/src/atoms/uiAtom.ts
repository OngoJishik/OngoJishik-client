import { atom } from 'jotai';

/**
 * 다크모드 활성화 여부 상태 Atom
 * @author Antigravity
 */
export const isDarkModeAtom = atom<boolean>(false);

/**
 * 하단 탭바 활성 탭 상태 Atom
 * @author Antigravity
 */
export const activeTabAtom = atom<string>('home');

/**
 * 메인 검색 모달 노출 여부 상태 Atom
 * @author Antigravity
 */
export const searchModalOpenAtom = atom<boolean>(false);

