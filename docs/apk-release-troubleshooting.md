# APK 릴리즈 트러블슈팅 기록

> 환경: Expo SDK 52 / React Native 0.76 / pnpm 모노레포 / EAS Build (cloud)
> 목표: `eas build --platform android --profile preview` 로 standalone APK 생성

---

## 빌드 환경 요약

| 항목 | 값 |
|------|-----|
| Expo SDK | 52.0.49 |
| React Native | 0.76.9 |
| 패키지 매니저 | pnpm@9.1.4 (모노레포) |
| 빌드 방식 | EAS Build 클라우드 (`preview` 프로파일) |
| 배포 형태 | `distribution: "internal"` → APK 사이드로딩 |

---

## Issue 1 — expo-linear-gradient 버전 불일치

### 증상
```
Plugin [id: 'expo-module-gradle-plugin'] was not found
in expo-linear-gradient@56.0.4
```

### 원인
`package.json`에 `expo-linear-gradient: "^56.0.4"`가 설정되어 있었음.  
Expo는 SDK 53부터 패키지 버전을 SDK 버전 번호에 맞추는 새 체계로 변경했다.  
SDK 52에서의 올바른 버전은 `~14.0.2`이고, `56.x.x`는 SDK 56용이다.

`expo-linear-gradient@56.0.4`가 SDK 56용 Gradle 플러그인 인프라를 끌어와서,  
SDK 52의 `expo-modules-core@2.2.3`과 충돌 → 두 번째 Gradle 에러도 연쇄 발생.

### 수정
```diff
- "expo-linear-gradient": "^56.0.4"
+ "expo-linear-gradient": "~14.0.2"
```

---

## Issue 2 — expo-asset / expo-constants / expo-linking 누락

### 증상
빌드마다 하나씩 다른 에러가 나타남:
```
Error: The required package `expo-asset` cannot be found
```

### 원인
`expo-router`의 필수 peer 의존성들이 `package.json`에 명시되지 않았다.  
로컬에서는 pnpm이 암묵적으로 resolve해서 `expo export`가 성공했지만,  
EAS의 엄격한 환경에서는 직접 선언된 의존성만 사용 가능하다.

### 수정
```bash
npx expo install expo-asset expo-constants expo-linking
```

추가된 버전 (SDK 52 호환):
- `expo-asset@~11.0.5`
- `expo-constants@~17.0.8`
- `expo-linking@~7.0.5`

`app.config.ts` 플러그인에도 추가:
```diff
  plugins: [
    'expo-router',
+   'expo-asset',
  ],
```

---

## Issue 3 — 패키지 버전 구버전 (expo-doctor 발견)

### 증상
EAS 빌드 로그에서 `expo-doctor` 경고 발생.  
일부 패키지가 SDK 52와 정확히 호환되지 않는 버전이었다.

### 수정
```bash
npx expo install expo-image expo-linear-gradient react-native-screens react-native
```

| 패키지 | 이전 | 이후 |
|--------|------|------|
| `expo-image` | `~1.13.0` | `~2.0.7` |
| `expo-linear-gradient` | `~13.0.2` | `~14.0.2` |
| `react-native-screens` | `~4.0.0` | `~4.4.0` |
| `react-native` | `0.76.0` | `0.76.9` |

> **교훈**: 초기 세팅 시 `npx expo-doctor`를 먼저 실행해서 전체 호환성을 검증할 것.

---

## Issue 4 — `expo.core.ExpoModulesPackage` import 오류 (핵심 버그)

### 증상
```
/android/app/build/generated/autolinking/.../PackageList.java:16:
  error: cannot find symbol
  import expo.core.ExpoModulesPackage;
```
`--clear-cache` 플래그로 재빌드해도 동일하게 재현됨 → 캐시 문제 아님.

### 원인 분석 (심층)

#### 아키텍처 이해
Expo SDK 52에서는 두 개의 autolinking 시스템이 병렬 작동한다:

1. **`@react-native/gradle-plugin`** → `PackageList.java` 생성  
   - `settings.gradle`의 `ex.autolinkLibrariesFromCommand(command)` 호출
   - `expo-modules-autolinking react-native-config` 명령의 JSON 출력을 소비

2. **`useExpoModules()`** → `ExpoModulesPackageList.java` 생성  
   - Expo 전용 모듈 목록 관리 (별도 경로)

#### 버그 추적 경로

**Step 1**: `expo-modules-autolinking@2.0.8`의 `react-native-config` 출력 확인
```json
"expo": {
  "packageImportPath": "import expo.core.ExpoModulesPackage;"  ← 잘못됨
}
```
실제 클래스 위치: `expo/android/src/main/java/expo/modules/ExpoModulesPackage.kt`

**Step 2**: `expo` 패키지의 `react-native.config.js` 확인
```js
android: !isExpoModulesInstalledAndroid(projectRoot)
  ? null
  : {
      packageImportPath: 'import expo.modules.ExpoModulesPackage;',  // 올바른 경로
    },
```
→ 이 파일이 제대로 로드되면 올바른 경로가 사용됨.

**Step 3**: `expo-modules-autolinking`의 `loadConfigAsync()` 분석

`config.ts`의 `requireConfig()` 함수:
```js
function requireConfig(filepath, configContents) {
    try {
        const config = requireFromString(configContents, filepath, {
            prependPaths: [mockedNativeModules],  // CLI mock만 포함
        });
        return config.default ?? config ?? null;
    }
    catch {
        return null;  // 실패 시 조용히 null 반환
    }
}
```

**Step 4**: `require-from-string` 맥락에서 실패 확인
```
Error: Cannot find module 'expo-modules-autolinking/exports'
```
`require-from-string`은 `prependPaths`에 지정된 경로만 탐색한다.  
`expo`의 `react-native.config.js`가 필요로 하는 `expo-modules-autolinking/exports`는  
`mockedNativeModules` 에 없으므로 → 예외 → `null` 반환.

**Step 5**: `null` 반환 후 폴백 로직
```ts
// androidResolver.ts
const packageName = await parsePackageNameAsync(...)
// build.gradle: namespace "expo.core" 를 읽음 → "expo.core"

const packageImportPath =
  reactNativeConfig?.packageImportPath  // undefined (null 로드 실패)
  || `import ${packageName}.${nativePackageClassName};`  // "import expo.core.ExpoModulesPackage;"
```

Gradle `namespace`와 실제 Kotlin `package` 선언이 달라서 잘못된 경로가 생성됨:
- Gradle namespace: `expo.core` (Android 빌드 식별자)
- Kotlin 실제 패키지: `expo.modules` (클래스 패키지)

### 수정

`expo-modules-autolinking@2.0.8`을 `pnpm patch`로 수정.  
`requireConfig()`가 먼저 `require(filepath)`를 시도 → pnpm의 정상 모듈 해석 경로 사용.

```diff
 function requireConfig(filepath, configContents) {
     try {
-        const config = requireFromString(configContents, filepath, {
-            prependPaths: [mockedNativeModules],
-        });
+        delete require.cache[filepath];
+        const config = require(filepath);
         return config.default ?? config ?? null;
     }
     catch {
-        return null;
+        try {
+            const config = requireFromString(configContents, filepath, {
+                prependPaths: [mockedNativeModules],
+            });
+            return config.default ?? config ?? null;
+        }
+        catch {
+            return null;
+        }
     }
 }
```

패치 파일: `patches/expo-modules-autolinking@2.0.8.patch`  
`package.json`의 `patchedDependencies`에 자동 등록됨 → `pnpm install` 시 항상 재적용.

---

## Issue 5 — 앱 실행 즉시 종료 (`userInterfaceStyle: 'automatic'`)

### 증상
스플래시 화면 직후 앱이 바로 꺼짐. ADB 로그 없음 (네이티브 크래시).

### 원인
`app.config.ts`에 `userInterfaceStyle: 'automatic'`이 설정되어 있었는데,  
이 옵션을 사용하려면 `expo-system-ui`가 설치되어 있어야 한다.  
설치되지 않으면 `expo prebuild` 단계에서 경고만 출력하고 넘어가지만, 런타임에 네이티브 크래시가 발생한다.

### 수정
```bash
npx expo install expo-system-ui
```

---

## Issue 6 — `RCTText` view config getter undefined (pnpm 이중 react-native 인스턴스)

### 증상
```
Invariant Violation: View config getter callback for component `RCTText`
must be a function (received `undefined`).

at: RCTText → Text → Header → ScreenLayout → HomeScreen
```
스플래시 후 앱이 즉시 종료. ADB logcat에서 확인:
```
E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
E AndroidRuntime: invariant@1:78303
```

### 진단 과정

**1차 의심 — `packages/ui`의 expo-linear-gradient 버전**  
`packages/ui/package.json`에 `expo-linear-gradient: "^56.0.4"`가 직접 의존성으로 남아 있었다.  
pnpm이 `packages/ui/node_modules/`에 SDK 56용 버전을 별도 설치 → 수정 적용.

**2차 — metro.config.js `extraNodeModules` 추가**  
react-native 중복 인스턴스를 방지하기 위해 Metro가 항상 앱 수준 react-native를 사용하도록 강제:
```js
config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules', 'react'),
  'react-native': path.resolve(projectRoot, 'node_modules', 'react-native'),
};
```

**3차 — 크래시 지속, 번들 오프셋 동일**  
새 빌드 후에도 `invariant@1:78303` 오프셋이 동일하게 유지됨.  
번들 오프셋이 동일하다는 것은 번들 내용 자체가 바뀌지 않았다는 의미.

**근본 원인 발견 — pnpm-lock.yaml에 react-native 두 버전 공존**

```bash
grep -c "react-native@0.76.0" pnpm-lock.yaml  # → 수십 개
grep -c "react-native@0.76.9" pnpm-lock.yaml  # → 수십 개
```

pnpm이 `packages/ui` 컨텍스트에서 expo 패키지들의 peer dep을 해석할 때,  
`packages/ui`에 `react-native`가 직접 의존성으로 없으므로 `0.76.0`으로 해석 → 두 버전이 공존.

원인 구조:
```
packages/ui/
  dependencies:
    expo-linear-gradient: ~14.0.2   ← react-native를 peer dep으로 요구
  devDependencies:
    expo-image: ~2.0.7              ← react-native를 peer dep으로 요구
  peerDependencies:
    react-native: ">=0.72.0"        ← 버전 범위가 너무 넓어 0.76.0으로 해석됨
```

`extraNodeModules`는 Metro의 JS 번들링 단계에서만 작동한다.  
pnpm이 이미 두 개의 react-native 물리 디렉터리를 node_modules에 생성해 버린 상황에서는  
bundle 시점의 리다이렉트만으로는 부족할 수 있다.

### 수정

**루트 `package.json`에 `pnpm.overrides` 추가** — 모노레포 전체에서 react-native 버전 단일화:
```json
"pnpm": {
  "overrides": {
    "react-native": "0.76.9"
  }
}
```

**`packages/ui/package.json` 재구성** — 네이티브 모듈을 peerDependencies로 이동:
```diff
  "dependencies": {
    "clsx": "^2.1.1",
-   "expo-linear-gradient": "~14.0.2",
    "tailwind-merge": "^2.3.0"
  },
  "peerDependencies": {
    "expo-image": "*",
+   "expo-linear-gradient": "*",
    "react": ">=18.0.0",
    "react-native": ">=0.72.0"
  },
  "devDependencies": {
    ...
-   "expo-image": "~2.0.7",
+   "expo-image": "~2.0.7",      // 유지 (타입 체크용)
+   "expo-linear-gradient": "~14.0.2",  // 추가 (타입 체크용)
  }
```

수정 후 pnpm install로 락파일 재생성:
```bash
pnpm install
# 검증
grep -c "react-native@0.76.0" pnpm-lock.yaml  # → 0
grep -c "react-native@0.76.9" pnpm-lock.yaml  # → 81
```

> **핵심 교훈**: pnpm 모노레포에서 라이브러리 패키지(`packages/*`)는 네이티브 모듈을  
> `dependencies`가 아닌 `peerDependencies`에 선언해야 한다.  
> `dependencies`에 두면 pnpm이 라이브러리 컨텍스트에서 별도의 peer dep 해석을 시도하고,  
> 앱의 버전과 다른 인스턴스가 생성될 수 있다.

---

## 전체 변경 내역 요약

### package.json (apps/mobile)

| 패키지 | 변경 전 | 변경 후 | 사유 |
|--------|---------|---------|------|
| `expo-linear-gradient` | `^56.0.4` | `~14.0.2` | SDK 52 호환 버전 |
| `expo-asset` | 없음 | `~11.0.5` | expo-router peer dep |
| `expo-constants` | 없음 | `~17.0.8` | expo-router peer dep |
| `expo-linking` | 없음 | `~7.0.5` | expo-router peer dep |
| `expo-image` | `~1.13.0` | `~2.0.7` | SDK 52 호환 버전 |
| `react-native-screens` | `~4.0.0` | `~4.4.0` | SDK 52 호환 버전 |
| `react-native` | `0.76.0` | `0.76.9` | SDK 52 호환 버전 |
| `expo-system-ui` | 없음 | `~4.0.9` | userInterfaceStyle: 'automatic' 필수 dep |

### app.config.ts
- `expo-asset` 플러그인 추가
- EAS `projectId` 추가 (`69689eb8-3969-4c62-bcc3-5c4f4f73eaa9`)

### package.json (packages/ui)

| 항목 | 변경 전 | 변경 후 | 사유 |
|------|---------|---------|------|
| `expo-linear-gradient` (dependencies) | `~14.0.2` | 제거 | peerDeps로 이동 |
| `expo-linear-gradient` (peerDependencies) | 없음 | `*` | 앱이 버전 제공 |
| `expo-linear-gradient` (devDependencies) | 없음 | `~14.0.2` | 타입 체크용 |
| `expo-image` (devDependencies) | `~2.0.7` | `~2.0.7` | 유지 (타입 체크용) |

### 루트 package.json

```json
"pnpm": {
  "overrides": {
    "react-native": "0.76.9"
  }
}
```

### apps/mobile/metro.config.js

```js
config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules', 'react'),
  'react-native': path.resolve(projectRoot, 'node_modules', 'react-native'),
};
```

### 신규 파일
- `patches/expo-modules-autolinking@2.0.8.patch`

### EAS 환경변수
- `EXPO_PUBLIC_API_URL` (preview 환경, 임시 placeholder 값)

---

## 재발 방지 체크리스트

새 패키지를 추가하거나 Expo SDK를 업그레이드할 때:

- [ ] `npx expo-doctor` 실행 → 버전 불일치 사전 확인
- [ ] `npx expo install <package>` 사용 → SDK 호환 버전 자동 선택
- [ ] `expo-router` 사용 시 peer dep (`expo-asset`, `expo-constants`, `expo-linking`) 명시
- [ ] EAS 빌드 전 `npx expo export --platform android` 로컬 번들링 사전 검증
- [ ] `userInterfaceStyle` 설정 시 `expo-system-ui` 함께 설치 확인
- [ ] `packages/*` 라이브러리에 네이티브 모듈 추가 시 `peerDependencies`에 선언 (직접 의존성 금지)
- [ ] EAS 빌드 전 `pnpm-lock.yaml` 커밋 확인 (`git status`로 확인)
- [ ] react-native 버전 변경 시 루트 `pnpm.overrides`도 함께 업데이트
- [ ] `grep -c "react-native@X.XX.X" pnpm-lock.yaml` 로 단일 버전 확인

---

## 고민사항 / 향후 과제

1. **`expo-modules-autolinking` 패치의 유지 관리**  
   SDK 업그레이드 시 패치가 깨질 수 있다. Expo 공식 이슈로 리포트하거나,  
   SDK 53+ 로 마이그레이션하면 버전 체계가 달라져서 자연스럽게 해소될 가능성이 있다.

2. **API URL 임시 처리**  
   현재 `EXPO_PUBLIC_API_URL`이 placeholder 값이다.  
   백엔드 연결 준비 후 EAS 환경변수를 실제 주소로 업데이트해야 한다.

3. **프로덕션 빌드 전략**  
   Play Store 배포 시 `preview` → `production` 프로파일로 전환하고,  
   APK 대신 AAB(Android App Bundle) 형식으로 빌드해야 한다.

4. **Keystore 백업**  
   현재 EAS가 자동 생성·관리 중이다.  
   Play Store 배포 전에 `eas credentials` 로 keystore를 로컬에 백업해 둘 것.
