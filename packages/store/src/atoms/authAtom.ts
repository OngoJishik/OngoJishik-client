import { atom } from 'jotai';
import type { TUserProfile } from '@ongo/api-client';

/**
 * 인증 액세스 토큰 상태 Atom
 * @author Antigravity
 */
export const authTokenAtom = atom<string | null>(null);

/**
 * 로그인된 유저의 프로필 정보 상태 Atom
 * @author Antigravity
 */
export const userProfileAtom = atom<TUserProfile | null>(null);

/**
 * 사용자가 인증(로그인)되었는지 여부를 확인하는 파생 Atom
 * @author Antigravity
 */
export const isAuthenticatedAtom = atom<boolean>((get) => !!get(authTokenAtom));

