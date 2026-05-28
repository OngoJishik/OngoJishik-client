export function validateSearchQuery(query: string): boolean {
  return query.trim().length >= 2;
}

export function validateComment(content: string): boolean {
  return content.trim().length > 0 && content.length <= 500;
}

export function validatePost(content: string): boolean {
  return content.trim().length >= 5 && content.length <= 1000;
}
