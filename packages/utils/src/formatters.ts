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
 * Format food name localized as per guidelines: {nameLocalized} ({nameKo})
 */
export function formatFoodName(nameKo: string, nameLocalized?: string): string {
  if (!nameLocalized || nameLocalized === nameKo) {
    return nameKo;
  }
  return `${nameLocalized} (${nameKo})`;
}
