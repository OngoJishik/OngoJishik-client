import AsyncStorage from '@react-native-async-storage/async-storage';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

/**
 * 로컬 캐싱된 즐겨찾기(전통 음식 ID 목록) 상태 Atom
 * @author Antigravity
 */
export const localFavoritesAtom = atomWithStorage<string[]>(
  'ongo_favorites',
  [],
  createJSONStorage(() => AsyncStorage)
);
