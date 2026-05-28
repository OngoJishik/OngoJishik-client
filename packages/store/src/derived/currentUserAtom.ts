import { atom } from 'jotai';
import { userProfileAtom, isAuthenticatedAtom } from '../atoms/authAtom';

/**
 * 인증 여부에 따라 현재 로그인된 사용자 정보를 조회하는 파생 Atom
 * @author Antigravity
 */
export const currentUserAtom = atom((get) => {
  const user = get(userProfileAtom);
  const authenticated = get(isAuthenticatedAtom);
  return authenticated ? user : null;
});

