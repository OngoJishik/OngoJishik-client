# 로그인/인증 라우팅 이슈 해결 기록

> 작성일: 2026-06-30
> 관련 영역: `apps/mobile` 인증 라우팅, `@ongo/store` authAtom, Android debug 서명

## 증상

토큰이 없는 상태(미로그인)인데도 **로그인 화면이 뜨지 않고 곧바로 메인(`/(tabs)`) 화면으로 진입**하는 현상.

## 결정적 단서

`AuthNavigator`에 임시 디버그 로그를 넣어 부팅 시점의 값을 찍어보니 다음과 같은 **모순**이 확인됨:

```
[Auth] token at boot = null | isAuthenticated = true | segments = ["(tabs)"]
```

- 토큰을 직접 읽으면 `null` (실제로 토큰 없음)
- 그런데 `isAuthenticated`는 `true` → 인증된 것으로 오판 → 메인으로 진입

## 근본 원인: async atom의 Promise truthiness 버그

`authTokenAtom`은 **AsyncStorage 기반 비동기** `atomWithStorage`이고 `getOnInit: true`로 설정되어 있다. 저장소 읽기가 끝나기 전까지 이 atom의 값은 **Promise**다.

```ts
// packages/store/src/atoms/authAtom.ts
export const authTokenAtom = atomWithStorage<string | null>(
  'ongo_auth_token',
  null,
  createJSONStorage(() => AsyncStorage),
  { getOnInit: true }
);
```

문제는 파생 atom이었다:

```ts
// 버그 버전
export const isAuthenticatedAtom = atom<boolean>((get) => !!get(authTokenAtom));
```

Jotai v2에서 **동기 파생 atom**이 비동기 atom을 `get()`하면 resolve된 값이 아니라 **Promise 객체 자체**를 반환한다. 그리고 `!!Promise === true`이므로, 토큰이 무엇이든(심지어 `null`로 풀려도) `isAuthenticatedAtom`은 **항상 `true`**가 되었다.

- `useAtomValue(authTokenAtom)` → Suspense로 resolve된 실제 값 `null` 반환
- `useAtomValue(isAuthenticatedAtom)` → 미해소 Promise의 truthiness `true` 반환

→ 로그에서 본 `token=null` + `isAuthenticated=true` 모순의 정체.

`app/_layout.tsx`(AuthNavigator), `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `derived/currentUserAtom.ts` 등 **인증 분기를 모두 `isAuthenticatedAtom`에 의존**하고 있었기 때문에, 전 구간에서 "항상 인증됨"으로 판정되어 로그인 화면이 영영 노출되지 않았다.

> 참고: 빌드 시점에 박아두었던 디폴트 토큰(`EXPO_PUBLIC_API_TEMP_TOKEN`)이나 옛 `atom('mock-token')` 기본값은 **이 증상의 직접 원인이 아니었다.** 전자는 API 요청 헤더에만 쓰였고, 라우팅 분기는 오직 `authTokenAtom` 기반이다.

## 수정

### 1) 파생 atom을 올바르게 (소스 단일 수정 → 모든 소비자 정상화)

```ts
// packages/store/src/atoms/authAtom.ts
export const isAuthenticatedAtom = atom<boolean>((get) => {
  const token = get(authTokenAtom);
  return typeof token === 'string' && token.length > 0;
});
```

- 미해소 Promise → `typeof 'object'` → `false`
- resolve된 `null` → `false`
- 실제 문자열 토큰일 때만 → `true`
- 동기 atom을 유지하므로 기존 소비자들(Suspense 경계 변경 불필요) 그대로 동작.

### 2) AuthNavigator는 토큰을 직접 구독

```ts
// apps/mobile/app/_layout.tsx
const authToken = useAtomValue(authTokenAtom);
const isAuthenticated = typeof authToken === 'string' && authToken.length > 0;
```

`authTokenAtom`을 직접 구독하면 `getOnInit`의 AsyncStorage 읽기가 끝날 때까지 Suspense로 대기되고, 해소되면 실제 값(문자열 토큰 또는 `null`)을 반환한다. 인증 사용자 깜빡임 없이 정확히 분기.

### 3) 메인 화면의 중복 인증 로직 제거

라우팅이 `AuthNavigator` **단일 소스**로 신뢰성 있게 동작하게 되면서, 라우팅이 깨졌을 때의 임시 우회책들을 정리:

- 메인 화면 로그인 배너 버튼 + 전용 스타일(`loginBanner`, `loginButton`) 제거
- 검색바 인증 게이트 `isAuthenticated ? setIsSearching(true) : router.replace('/(auth)/login')` → `setIsSearching(true)`로 단순화
- `useEffect` 2중 인증 재확인 로직 제거
- 미사용이 된 `isAuthenticated` 변수, `useAtomValue`·`isAuthenticatedAtom` import 제거

## 곁가지로 해결한 빌드 이슈 (Android debug 서명)

`pnpm android` 실행 시 다음 오류로 빌드 실패:

```
com.android.ide.common.signing.KeytoolException: Failed to read key androiddebugkey
from store "android/app/debug.keystore": Keystore was tampered with, or password was incorrect
```

- `scripts/copy-keystore.js`가 복사해야 할 원본 `debug.keystore.shared`가 저장소에 없어 복사가 스킵됨
- 남아있던 `android/app/debug.keystore`가 표준 debug 비밀번호(`android`)로 열리지 않음(손상/불일치)

**조치:** `android/app/build.gradle`의 `signingConfigs.debug`를 release와 동일한 `@ongosub__ongo-jishik.jks` 키로 전환.

```gradle
debug {
    storeFile file(MYAPP_RELEASE_STORE_FILE)        // @ongosub__ongo-jishik.jks
    storePassword MYAPP_RELEASE_STORE_PASSWORD
    keyAlias MYAPP_RELEASE_KEY_ALIAS
    keyPassword MYAPP_RELEASE_KEY_PASSWORD
}
```

이 키의 SHA-1(`8A:3D:DC:9F:6E:82:03:69:40:6C:F5:EE:B5:BA:C3:5F:F0:CE:6B:07`)이 Google에 등록된 지문이므로 debug 빌드에서도 구글 로그인이 정상 동작한다. (서로 다른 키로 서명된 기존 설치본이 있으면 `adb uninstall com.ongo.jishik` 후 재설치 필요.)

## 검증 방법

1. 앱 데이터 삭제 또는 완전 삭제 후 재설치(토큰 없는 깨끗한 상태)
2. 부팅 시 로그인 화면이 정상 노출되는지 확인
3. 구글 로그인 → 메인 진입 → 재실행 시 로그인 유지(토큰 영속) 확인

## 교훈

- **비동기 `atomWithStorage`를 동기 파생 atom에서 `!!get(...)`로 판정하지 말 것.** 미해소 Promise는 항상 truthy다. `typeof === 'string'` 등 값 기반으로 판정하거나, 토큰을 직접 구독해 Suspense로 resolve된 값을 사용한다.
- 인증 분기는 **단일 소스(AuthNavigator)**로 일원화하고, 화면별 중복 가드는 두지 않는다.
