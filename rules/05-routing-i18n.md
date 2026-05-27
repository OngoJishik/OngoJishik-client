# 05. Expo Router 라우팅 & 다국어 규칙

## 라우트 파일 → URL 매핑

```
app/
├── _layout.tsx              → Root Layout (Provider 래핑)
├── (tabs)/
│   ├── _layout.tsx          → Tab Navigator (5탭)
│   ├── index.tsx            → /            (🏠 홈)
│   ├── search.tsx           → /search      (🔍 검색)
│   ├── history.tsx          → /history     (📖 역사)
│   ├── community.tsx        → /community   (💬 커뮤니티)
│   └── mypage.tsx           → /mypage      (👤 마이)
├── food/[id].tsx            → /food/:id    (상세)
├── search/results.tsx       → /search/results
├── community/
│   ├── [postId].tsx         → /community/:postId
│   └── write.tsx            → /community/write
└── (auth)/login.tsx         → /login
```

## 네비게이션 패턴

```typescript
import { useRouter, Link, useLocalSearchParams } from "expo-router";

// 프로그래밍 방식
const router = useRouter();
router.push("/food/abc123");
router.push({ pathname: "/search/results", params: { query: "매콤한 국물" } });
router.back();

// 선언적
<Link href="/food/abc123"><FoodCard {...props} /></Link>

// 동적 파라미터
const { id } = useLocalSearchParams<{ id: string }>();
```

## Root Layout (Provider 래핑)

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <ThemeProvider>
            <Stack />
          </ThemeProvider>
        </I18nProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
```

---

## 다국어 번역 키

### 네임스페이스 구조

키는 `화면명.요소명` 2단 구조. 공통 텍스트는 `common`.

```jsonc
{
  "tabs": { "home": "홈", "search": "검색", "history": "역사", "community": "커뮤니티", "mypage": "마이" },
  "home": { "todayRecommendation": "오늘의 추천", "popularFoods": "인기 전통 음식", "searchPlaceholder": "어떤 전통 음식이 궁금하세요?" },
  "search": { "recentSearches": "최근 검색어", "resultCount": "{{count}}개 결과", "dataSource": "출처: 특허청 한국전통지식포탈" },
  "detail": { "recipe": "조리법", "ingredients": "식재료", "historyStory": "역사 이야기", "literature": "문헌 원문", "health": "건강 정보" },
  "community": { "all": "전체", "cookingReview": "조리 후기", "myRecipe": "나만의 레시피", "qna": "질문/답변" },
  "common": { "like": "좋아요", "share": "공유", "cancel": "취소", "confirm": "확인", "loading": "로딩 중..." }
}
```

### 규칙
- 동적 값: ICU 포맷 `"{{count}}개 결과"`
- 음식 이름은 번역하지 않음 (API에서 `nameKo` + `nameLocalized` 제공)

### 음식 이름 표시 (항상 한국어 병기)

```typescript
// ko → "육개장"
// en → "Yukgaejang 육개장"
// ja → "ユッケジャン 육개장"

export const formatFoodName = (nameKo: string, nameLocalized?: string, lang?: TLanguage): string => {
  if (!nameLocalized || lang === "ko") return nameKo;
  return `${nameLocalized} ${nameKo}`;
};
```
