export function formatDate(dateString: string, locale: string = 'ko'): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * 음식 이름을 다국어 설정에 맞게 포맷팅 (항상 한국어 병기)
 * ko: "육개장"
 * en: "Yukgaejang 육개장"
 * ja: "ユッケジャン 육개장"
 * @author Antigravity
 */
export function formatFoodName(nameKo: string, nameLocalized?: string, lang: string = 'ko'): string {
  if (!nameLocalized || lang === 'ko' || nameLocalized === nameKo) {
    return nameKo;
  }
  return `${nameLocalized} ${nameKo}`;
}

