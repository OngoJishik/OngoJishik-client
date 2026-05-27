# 06. Git 커밋 규칙 & 생성 체크리스트

## Commit 메시지

형식: `<type>(<scope>): <subject>`

### Type

| Type | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | UI/스타일 변경 |
| `refactor` | 리팩토링 |
| `chore` | 빌드/설정/패키지 |
| `docs` | 문서 수정 |
| `test` | 테스트 추가/수정 |
| `!HOTFIX` | 긴급 수정 |

### Scope (선택)
`home`, `search`, `detail`, `community`, `mypage`, `ui`, `api`, `store`, `i18n`

### 예시
```bash
git commit -m "feat(search): 자연어 검색 입력 화면 구현"
git commit -m "fix(detail): 조리법 단계 연결선 렌더링 오류 수정"
git commit -m "refactor(store): searchAtom 파생 atom 분리"
git commit -m "chore: expo SDK 52로 업그레이드"
```

---

## 새 Package 생성 체크리스트

- [ ] `packages/[name]/` 폴더 생성
- [ ] `package.json` — `"name": "@ongo/[name]"`
- [ ] `tsconfig.json` — 적절한 config 확장
- [ ] `src/` 폴더 구조 생성
- [ ] `index.ts` 진입점 (공개 API re-export)
- [ ] 의존 패키지에 `workspace:*` 추가
- [ ] `pnpm install` → `pnpm --filter @ongo/[name] build`

## 새 화면 추가 체크리스트

- [ ] `app/` 하위에 라우트 파일 생성
- [ ] 컴포넌트 추가 (`@ongo/ui`)
- [ ] API 엔드포인트 + Query 훅 추가 (`@ongo/api-client`)
- [ ] 번역 키 추가 (`@ongo/i18n` — ko/en/ja/zh)
- [ ] 필요 시 atom 추가 (`@ongo/store`)
- [ ] JSDoc + @author 확인
- [ ] 네비게이션 연결 확인

## 새 컴포넌트 추가 체크리스트 (UI 패키지)

- [ ] `packages/ui/src/composites/[Name]/` 폴더
- [ ] `[Name].tsx` 컴포넌트 + Props 타입 export
- [ ] `[Name].styles.ts` 스타일
- [ ] `index.ts` re-export
- [ ] `packages/ui/src/composites/index.ts`에 추가
- [ ] JSDoc + @author
