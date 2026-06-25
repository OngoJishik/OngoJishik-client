/**
 * 온고지식 검색 특징 분류 결과 타입
 * @author Antigravity
 */
export type TClassifiedFeatures = {
  taste: string[];
  color: string[];
  form: string[];
};

// 맛 그룹(taste)의 허용 label 목록
const TASTE_LABELS = new Set([
  '매운맛',
  '약간매운맛',
  '단맛',
  '짭짤한맛',
  '신맛',
  '쓴맛',
  '감칠맛',
  '깔끔한맛',
  '담백한맛',
  '진한맛',
  '마늘향',
  '고소한맛',
  '불향',
  '발효향',
  '바다향',
  '육향',
  '시원한맛',
  '기름진맛',
  '가벼운맛',
  '묵직한맛',
  '약재향',
  '견과류맛',
  '과일향',
  '콩맛',
  '알싸한맛',
  '균형잡힌맛',
  '육수맛',
]);

// 색감 그룹(color)의 허용 label 목록 (v1.0 '빨간색' 및 v1.1 '빨강' 계열 모두 지원)
const COLOR_LABELS = new Set([
  '빨강',
  '빨간색',
  '붉은색',
  '빨강색',
  '주황',
  '주황색',
  '노랑',
  '노란색',
  '초록',
  '초록색',
  '녹색',
  '하양',
  '하얀색',
  '흰색',
  '검정',
  '검은색',
  '흑색',
  '갈색',
  '노릇함',
  '맑음',
  '진함',
  '연함',
  '다채로운',
  '보라',
  '보라색',
  '자색',
  '분홍',
  '분홍색',
  '베이지',
  '베이지색',
]);

// 요리 형태 및 조리 방식, 카테고리 목록 통합 허용 label 목록
const FORM_LABELS = new Set([
  // 요리 형태 (dish_type)
  '밥류',
  '죽류',
  '면류',
  '국류',
  '탕류',
  '찌개류',
  '전골류',
  '찜류',
  '구이류',
  '볶음류',
  '조림류',
  '전류',
  '튀김류',
  '나물류',
  '무침류',
  '김치류',
  '장아찌류',
  '장류',
  '떡류',
  '한과류',
  '음청류',
  '후식류',
  '반찬류',
  '주요리',
  '간식류',
  '길거리음식',
  '쌈류',
  '만두류',

  // 조리 방식 (cooking_method)
  '끓인',
  '조린',
  '찐',
  '구운',
  '부친',
  '튀긴',
  '볶은',
  '생으로먹는',
  '데친',
  '절인',
  '발효한',
  '말린',
  '덖은',
  '무친',
  '싼',
  '찧은',
  '반죽한',
  '푹익힌',
  '차갑게비빈',
  '국물낸',
  '양념바른',
  '훈연한',
  '눌러만든',
  '겹쳐만든',

  // 카테고리 리스트 (ongojisik_category_list_v1.json)
  '죽/미음류',
  '국/탕류',
  '찌개/전골류',
  '전/부침류',
  '튀김/부각류',
  '나물/무침류',
  '김치/절임류',
  '장/양념류',
  '떡/병과류',
  '한과/과자류',
  '음청/차류',
  '후식/간식류',
  '궁중/의례음식',
]);

/**
 * 추출된 검색 특징 목록(extractedFeatures)을 맛, 색감, 요리형태로 정확하게 분류하는 함수
 * @param features 추출된 특징 목록 (예: ['매운맛', '빨강', '국류'])
 * @returns 맛, 색감, 형태로 분류된 결과 객체
 * @author Antigravity
 */
export function classifyFeatures(features: string[]): TClassifiedFeatures {
  const result: TClassifiedFeatures = {
    taste: [],
    color: [],
    form: [],
  };

  if (!Array.isArray(features)) {
    return result;
  }

  for (const feature of features) {
    if (TASTE_LABELS.has(feature)) {
      result.taste.push(feature);
    } else if (COLOR_LABELS.has(feature)) {
      result.color.push(feature);
    } else if (FORM_LABELS.has(feature)) {
      result.form.push(feature);
    }
  }

  return result;
}
