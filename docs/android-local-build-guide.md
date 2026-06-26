# Android 로컬 릴리즈 빌드 가이드

> 환경: Expo SDK 52 / React Native 0.76 / pnpm 모노레포 (Turborepo)
> 빌드 방식: `expo prebuild` → Gradle 로컬 빌드

---

## 개요

이 문서는 pnpm 모노레포 환경에서 Android 릴리즈 APK/AAB를 로컬 Gradle 빌드로 생성하는 과정과, 이 과정에서 발생한 문제들의 원인 및 해결 방법을 정리한 문서입니다.

---

## 빌드 절차

### 1. android 폴더 초기화

기존 `android/` 폴더가 오염된 경우 삭제 후 재생성합니다.

```bash
cd apps/mobile
pnpm expo prebuild --platform android --clean
```

### 2. 릴리즈 서명 설정

`android/gradle.properties`에 키스토어 정보 추가:

```properties
MYAPP_RELEASE_STORE_FILE=your-keystore.jks
MYAPP_RELEASE_KEY_ALIAS=your-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

`android/app/build.gradle`의 `android {}` 블록에 서명 설정 추가:

```groovy
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        storeFile file(MYAPP_RELEASE_STORE_FILE)
        storePassword MYAPP_RELEASE_STORE_PASSWORD
        keyAlias MYAPP_RELEASE_KEY_ALIAS
        keyPassword MYAPP_RELEASE_KEY_PASSWORD
    }
}
buildTypes {
    debug { signingConfig signingConfigs.debug }
    release { signingConfig signingConfigs.release }
}
```

### 3. APK / AAB 빌드

```bash
cd apps/mobile/android

# APK (기기 직접 설치용)
.\gradlew assembleRelease

# AAB (Google Play 스토어 업로드용)
.\gradlew bundleRelease

# 동시 빌드
.\gradlew assembleRelease bundleRelease
```

**출력 경로:**
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### 4. 기기에 설치 (ADB)

```bash
# 최초 설치
adb install app-release.apk

# 기존 앱 덮어쓰기
adb install -r app-release.apk
```

---

## 해결한 문제들

### 문제 1: Metro 번들러가 모노레포 루트에서 진입점을 찾지 못함

**증상:**
```
Error: Unable to resolve module ./index.js from C:\ongo\client/.:
None of these files exist:
  * ..\..\index.js
```

**원인:**

`@expo/metro-config`의 `getMetroServerRoot()` 함수가 pnpm 모노레포에서 워크스페이스 루트(`C:\ongo\client`)를 반환합니다. 이 값이 Metro 서버의 `unstable_serverRoot`로 설정되어, Metro가 진입점 `./index.js`를 **모노레포 루트**에서 해석하려 합니다. 실제 파일은 `apps/mobile/index.js`에 있으므로 해석에 실패합니다.

```
serverRoot = C:\ongo\client          ← 잘못된 기준
./index.js → C:\ongo\client\index.js ← 존재하지 않음
```

**해결:**

`apps/mobile/.env`에 아래 환경변수 추가:

```env
EXPO_NO_METRO_WORKSPACE_ROOT=1
```

이 플래그를 설정하면 `getMetroServerRoot()`가 워크스페이스 루트 대신 `projectRoot`(`apps/mobile`)를 반환합니다.

```
serverRoot = C:\ongo\client\apps\mobile   ← 올바른 기준
./index.js → apps/mobile/index.js         ← 정상 해석
```

> **참고:** `apps/mobile/metro.config.js`에서 `watchFolders`와 `nodeModulesPaths`를 수동으로 모노레포 전체 경로로 설정하고 있으므로, 이 플래그를 설정해도 모노레포 패키지 해석에는 영향이 없습니다.

---

## 주의사항

- 소스 코드 변경 후 빌드 결과물이 반영되지 않는 경우 `.\gradlew clean` 후 재빌드하세요.
- 키스토어 파일(`*.jks`)과 비밀번호는 절대 커밋하지 마세요.
- `EXPO_NO_METRO_WORKSPACE_ROOT=1`은 `.env`에 영구 설정되어 있으므로 별도 조치 불필요합니다.
