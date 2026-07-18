# Expo SDK 52 → 54 업그레이드 (16kb 페이지 사이즈 대응)

> 브랜치: `chore/expo-sdk-54-16kb-upgrade`
> 배경: Google Play가 신규/업데이트 앱에 Android 16kb 메모리 페이지 크기 지원을 요구. Expo SDK 52 / RN 0.76 기반으로는 대응 불가하여 SDK 54 / RN 0.81로 업그레이드.

---

## 개요

이 문서는 pnpm 모노레포(`@ongo` workspace) 환경에서 Expo SDK 52 → 54로 업그레이드하며 발생한 변경 사항과, 과거 SDK 52에서 임시방편으로 적용했던 patch들을 제거하게 된 배경을 정리합니다.

관련 커밋:
- `2cc2bcc` chore: start expo sdk 52->54 upgrade for 16kb page size compliance
- `a9dd459` chore: remove react-native pnpm override to unblock expo sdk upgrade
- `8512d09` chore: complete Expo SDK 52 -> 54 upgrade, bump app to v2.1.0 (build 10)

---

## 주요 의존성 버전 변경

| 패키지 | 이전 | 이후 |
|---|---|---|
| expo | ~52.0.0 | ~54.0.36 |
| expo-router | ~4.0.0 | ~6.0.24 |
| react | 18.3.1 | 19.1.0 |
| react-native | 0.76.9 | 0.81.5 |
| react-native-safe-area-context | 4.12.0 | 5.6.2 |
| react-native-screens | ~4.4.0 | ~4.16.0 |
| react-native-svg (catalog) | ~15.8.0 | ^15.12.1 |
| @react-native-async-storage/async-storage (catalog) | 1.23.1 | ^2.2.0 |
| @types/react (catalog) | ~18.3.0 | ^19.1.17 |
| typescript (apps/mobile) | catalog (^5.4.5) | ~5.9.3 |
| babel-preset-expo | ~12.0.0 | ~54.0.12 |

`apps/mobile`에 `@expo/metro-runtime` 신규 추가 (SDK 54부터 Expo 앱에서 명시적으로 요구).

---

## 설정 변경

### 1. `apps/mobile/babel.config.js` / `babel.config.js`

```diff
  return {
    presets: ['babel-preset-expo'],
-   plugins: ['expo-router/babel'],
  };
```

`expo-router/babel` 플러그인은 SDK 50부터 `babel-preset-expo`에 내장되어 별도 등록 시 중복 등록 경고/충돌이 발생. 제거.

### 2. `apps/mobile/metro.config.js` — extraNodeModules 경로

```diff
  config.resolver.extraNodeModules = {
-   'react': path.resolve(projectRoot, 'node_modules', 'react'),
-   'react-native': path.resolve(projectRoot, 'node_modules', 'react-native'),
-   'react-native-svg': path.resolve(projectRoot, 'node_modules', 'react-native-svg'),
+   'react': path.resolve(workspaceRoot, 'node_modules', 'react'),
+   'react-native': path.resolve(workspaceRoot, 'node_modules', 'react-native'),
+   'react-native-svg': path.resolve(workspaceRoot, 'node_modules', 'react-native-svg'),
  };
```

`.npmrc`의 `node-linker=hoisted` 설정으로 인해 react/react-native/react-native-svg가 `apps/mobile/node_modules`가 아닌 workspace root `node_modules`에만 존재하게 됨. 기존 `projectRoot` 기준 경로는 SDK 54 + hoisted 링커 조합에서 존재하지 않는 경로를 가리켜 중복 모듈 인스턴스 문제를 유발할 수 있어 `workspaceRoot` 기준으로 수정.

### 3. `apps/mobile/app.config.ts` — router root

```diff
- import path from 'path';
  ...
  router: {
-     root: path.resolve(__dirname, 'app'),
+     root: 'app',
  },
```

기존에는 Expo CLI가 `apps/mobile`이 아닌 workspace root에서 호출될 때 `app/` 디렉터리를 못 찾는 문제를 절대 경로로 우회했었음. `apps/mobile/package.json` 스크립트를 workspace root의 Expo CLI 바이너리를 직접 `node`로 실행하도록 바꾸면서 이 문제가 스크립트 레벨에서 해결되어, 상대 경로로 되돌림.

### 4. `apps/mobile/package.json` — 스크립트가 workspace root CLI를 직접 호출

```diff
-   "start": "expo start",
+   "start": "node ../../node_modules/expo/bin/cli start",
```

`start`/`dev`/`android`/`ios`/`web`/`ts:check`/`typecheck` 전부 동일한 패턴으로 변경. hoisted 링커 환경에서 `apps/mobile`에 로컬 `expo`/`typescript` 바이너리가 없을 수 있어, workspace root에 설치된 CLI를 명시적으로 지정.

### 5. `pnpm-workspace.yaml` catalog 버전 상향 + patch 제거

`expo-modules-autolinking@2.0.8.patch`, `expo-modules-core.patch` 두 patch를 삭제 (`package.json`의 `pnpm.patchedDependencies`도 함께 제거). 두 patch 모두 SDK 52 시절 pnpm 모노레포 환경에서의 Android 빌드 이슈(react-native-config 로딩 방식, `REACT_NATIVE_DIR` 탐색 경로) 우회용이었고, SDK 54에서 올라간 `expo-modules-autolinking`/`expo-modules-core` 버전에 동일 수정 사항이 upstream으로 반영되어 더 이상 필요하지 않음.

---

## 버전 표기

앱 버전을 `1.2.4` → `2.1.0`, `versionCode`/`buildNumber`를 `7` → `10`으로 올림 (`app.config.ts`, 마이페이지/앱 정보 화면의 하드코딩된 버전 텍스트도 함께 동기화).

---

## 남은 작업 / 확인 필요 사항

- [ ] `expo prebuild --clean` 후 Android 로컬 빌드로 16kb 페이지 사이즈 컴플라이언스 확인 (`docs/android-local-build-guide.md` 참고)
- [ ] React 19 / RN 0.81 관련 런타임 회귀 여부 QA
- [ ] Google Play Console에 새 AAB 업로드 후 16kb 경고 해소 확인
