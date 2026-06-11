# API 연동 예시 (`@travel-gacha/api`)

## env

```env
# apps/mobile/.env
EXPO_PUBLIC_API_BASE_URL=https://api.example.com

# apps/web/.env.local
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## packages/api — query 추가

`packages/api/src/queries/example.ts` 를 복사해 `travels.ts` 등으로 추가.

```ts
// packages/api/src/queries/travels.ts
import { queryOptions } from '@tanstack/react-query';
import { getApiClient } from '../client';

export type Travel = { id: string; title: string };

export const travelsQueryKey = ['travels', 'list'] as const;

export const travelsQueryOptions = () =>
  queryOptions({
    queryKey: travelsQueryKey,
    queryFn: async () => {
      const { data } = await getApiClient().get<Travel[]>('/api/travels');
      return data;
    },
    staleTime: 60 * 1000
  });
```

```ts
// packages/api/src/index.ts
export { travelsQueryOptions, travelsQueryKey, type Travel } from './queries/travels';
```

## GET — useQuery

```tsx
import { useQuery } from '@tanstack/react-query';
import { travelsQueryOptions, isApiError } from '@travel-gacha/api';

export function TravelList() {
  const { data, error, isLoading, refetch } = useQuery(travelsQueryOptions());

  if (isLoading) return null;
  if (error) {
    const message = isApiError(error) ? `${error.status}: ${error.message}` : '요청 실패';
    return <Text>{message}</Text>;
  }

  return data?.map((t) => <Text key={t.id}>{t.title}</Text>);
}
```

```tsx
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { travelsQueryOptions, isApiError } from '@travel-gacha/api';

export function TravelList() {
  const { data, error, isLoading } = useQuery(travelsQueryOptions());

  useEffect(() => {
    if (!error) return;
    if (isApiError(error)) {
      console.log(error.status, error.message);
    }
  }, [error]);

  // ...
}
```

## POST — useMutation (onSuccess / onError)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient, isApiError, travelsQueryKey } from '@travel-gacha/api';

function useCreateTravel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { title: string }) => {
      const { data } = await getApiClient().post('/api/travels', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: travelsQueryKey });
    },
    onError: (error) => {
      if (isApiError(error)) {
        console.log(error.status, error.message);
      }
    }
  });
}
```

```tsx
const { mutate } = useCreateTravel();

mutate(
  { title: '제주' },
  {
    onSuccess: () => {},
    onError: (error) => {
      if (isApiError(error)) {
      }
    }
  }
);
```

## 직접 호출 (Query 없이)

```tsx
import { getApiClient, isApiError } from '@travel-gacha/api';

try {
  const { data } = await getApiClient().get('/api/travels/1');
} catch (error) {
  if (isApiError(error)) {
    console.log(error.status, error.message);
  }
}
```
