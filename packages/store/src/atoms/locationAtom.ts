import { atom } from 'jotai';

/**
 * expo-location으로 취득한 사용자 좌표 타입.
 * null일 경우 권한이 없거나 아직 위치를 획득하지 못한 상태를 의미합니다.
 * @author Antigravity
 */
export type TUserLocation = {
  lat: number;
  lng: number;
} | null;

/**
 * 사용자의 현재 위치 좌표를 보관하는 Jotai Atom
 * @author Antigravity
 */
export const userLocationAtom = atom<TUserLocation>(null);
