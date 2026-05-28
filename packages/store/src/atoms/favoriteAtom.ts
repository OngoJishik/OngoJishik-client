import { atom } from 'jotai';

/**
 * 로컬 캐싱된 즐겨찾기(전통 음식 ID 목록) 상태 Atom
 * @author Antigravity
 */
export const localFavoritesAtom = atom<string[]>([]);

