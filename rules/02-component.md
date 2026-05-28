# 02. 컴포넌트 작성 패턴

## 폴더 구조

```
ComponentName/
├── ComponentName.tsx          # 컴포넌트 로직
├── ComponentName.styles.ts    # StyleSheet 또는 NativeWind
└── index.ts                   # re-export
```

## 컴포넌트 템플릿

```typescript
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Text } from "../../primitives/Text";
import { styles } from "./FoodCard.styles";

export type FoodCardProps = {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  category: string;
  description: string;
  isFavorite: boolean;
  onPress: () => void;
  onFavoriteToggle: () => void;
};

/**
 * 전통 음식 카드 컴포넌트
 * 홈 화면의 인기 전통 음식 섹션에서 사용
 * @author 작성자
 */
export const FoodCard = ({
  nameKo,
  emoji,
  imageUrl,
  category,
  description,
  isFavorite,
  onPress,
  onFavoriteToggle,
}: FoodCardProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
      </View>
      <Text style={styles.name}>{nameKo}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
};
```

## index.ts

```typescript
/**
 * FoodCard는 전통 음식 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * @author 작성자
 */
export { FoodCard } from "./FoodCard";
export type { FoodCardProps } from "./FoodCard";
```

## 원칙

### 필수
- Named Export만 사용
- Props 타입은 컴포넌트 파일에 정의하고 export
- JSDoc + `@author`
- `Pressable` 사용 (TouchableOpacity 대신)
- `expo-image` 사용 (RN Image 대신)
- 외부에서 style prop으로 확장 가능하게

### 금지
- `export default`
- 인라인 스타일 (일회성 레이아웃 제외)
- 컴포넌트 내부에서 API 직접 호출 (훅을 통해)

## Import 순서

```typescript
// 1. React / React Native
import { useState } from "react";
import { View, Pressable } from "react-native";

// 2. 외부 라이브러리
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "expo-router";

// 3. @ongo 패키지
import { FoodCard } from "@ongo/ui";
import { useFoodDetailQuery } from "@ongo/api-client";
import { currentLanguageAtom } from "@ongo/store";

// 4. 상대 경로
import { FeedSkeleton } from "./components/FeedSkeleton";
import { styles } from "./Screen.styles";

// 5. 타입 (항상 마지막)
import type { TFood } from "@ongo/api-client";
```
