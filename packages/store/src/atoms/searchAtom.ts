import { atom } from 'jotai';
import type { TSearchFilters } from '@ongo/api-client';

/**
 * 현재 입력된 검색어 상태 Atom
 * @author Antigravity
 */
export const searchQueryAtom = atom<string>('');

/**
 * 검색 필터 옵션 상태 Atom
 * @author Antigravity
 */
export const searchFiltersAtom = atom<TSearchFilters>({});

/**
 * 최근 검색 기록 목록 상태 Atom
 * @author Antigravity
 */
export const searchHistoryAtom = atom<string[]>([]);

