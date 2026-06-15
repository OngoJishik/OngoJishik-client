import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { TUserProfile } from '@ongo/api-client';

/**
 * 인증 액세스 토큰 상태 Atom (AsyncStorage 영속)
 * @author Antigravity
 */
export const authTokenAtom = atomWithStorage<string | null>(
  'ongo_auth_token',
  null,
  createJSONStorage(() => AsyncStorage)
);

/**
 * 인증 리프레시 토큰 상태 Atom (AsyncStorage 영속)
 * @author Antigravity
 */
export const refreshTokenAtom = atomWithStorage<string | null>(
  'ongo_refresh_token',
  null,
  createJSONStorage(() => AsyncStorage)
);

/**
 * 로그인된 유저의 프로필 정보 상태 Atom (AsyncStorage 영속)
 * @author Antigravity
 */
export const userProfileAtom = atomWithStorage<TUserProfile | null>(
  'ongo_user_profile',
  null,
  createJSONStorage(() => AsyncStorage)
);


/**
 * 사용자가 인증(로그인)되었는지 여부를 확인하는 파생 Atom
 * @author Antigravity
 */
export const isAuthenticatedAtom = atom<boolean>((get) => !!get(authTokenAtom));


