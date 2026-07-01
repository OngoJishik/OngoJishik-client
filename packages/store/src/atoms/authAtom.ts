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
  createJSONStorage(() => AsyncStorage),
  // getOnInit: 초기 마운트 시 저장소에서 토큰을 읽어 첫 렌더부터 인증 상태를 정확히 반영
  // (미설정 시 첫 렌더가 항상 null → 라우팅 판단 race 발생)
  { getOnInit: true }
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
  createJSONStorage(() => AsyncStorage),
  { getOnInit: true }
);


/**
 * 사용자가 인증(로그인)되었는지 여부를 확인하는 파생 Atom
 *
 * authTokenAtom은 AsyncStorage 기반 비동기 atom이라, getOnInit 읽기가 끝나기 전에는
 * get(authTokenAtom)이 "값"이 아니라 Promise를 반환한다. 단순히 `!!get(...)`로 판단하면
 * 미해소 Promise가 항상 truthy → 토큰이 없거나 null이어도 인증된 것으로 오판한다.
 * 따라서 실제 문자열 토큰일 때만 true로 판정한다.
 * @author Antigravity
 */
export const isAuthenticatedAtom = atom<boolean>((get) => {
  const token = get(authTokenAtom);
  return typeof token === 'string' && token.length > 0;
});


