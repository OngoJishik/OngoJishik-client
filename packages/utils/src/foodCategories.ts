export type FoodCategory =
  | 'tteok'     // 떡류
  | 'soup'      // 국/탕
  | 'grill'     // 구이
  | 'namul'     // 나물
  | 'jjim'      // 찜/조림
  | 'myeon'     // 면류
  | 'hangwa'    // 한과
  | 'eumchung'; // 음청류

export const foodCategoryNames: Record<FoodCategory, { ko: string; en: string }> = {
  tteok: { ko: '떡류', en: 'Rice Cakes' },
  soup: { ko: '국/탕류', en: 'Soups & Stews' },
  grill: { ko: '구이류', en: 'Grilled Dishes' },
  namul: { ko: '나물류', en: 'Seasoned Vegetables' },
  jjim: { ko: '찜/조림류', en: 'Steamed & Braised' },
  myeon: { ko: '면류', en: 'Noodles' },
  hangwa: { ko: '한과류', en: 'Traditional Sweets' },
  eumchung: { ko: '음청류', en: 'Traditional Beverages' },
};

export const foodCategoryEmojis: Record<FoodCategory, string> = {
  tteok: '🍡',
  soup: '🍲',
  grill: '🥩',
  namul: '🥗',
  jjim: '🍲',
  myeon: '🍜',
  hangwa: '🍯',
  eumchung: '🍵',
};
