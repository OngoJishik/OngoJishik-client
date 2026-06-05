import { atom } from 'jotai';
import { searchHistoryAtom } from '../atoms/searchAtom';

/**
 * 최근 검색어 관리 파생 Atom (읽기/쓰기 가능)
 * 새로운 검색어를 리스트 최상단에 올리고 최대 10개까지 제한하여 영속화
 * @author Antigravity
 */
export const recentSearchAtom = atom(
  (get) => get(searchHistoryAtom),
  (get, set, newSearch: string) => {
    const trimmed = newSearch.trim();
    if (!trimmed) return;

    const currentHistory = get(searchHistoryAtom);
    // atomWithStorage with AsyncStorage may return a Promise on the first read;
    // fall back to an empty array until the value is hydrated.
    const history = currentHistory instanceof Promise ? [] : currentHistory;
    const filtered = history.filter((item) => item !== trimmed);
    const updated = [trimmed, ...filtered].slice(0, 10); // Limit to top 10 items

    set(searchHistoryAtom, updated);
  }
);
