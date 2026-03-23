// In-memory store for article data during client-side navigation.
// This avoids all sessionStorage/SSR timing issues.

const store: Record<string, unknown> = {};

export function setArticle(key: string, data: unknown) {
  store[key] = data;
}

export function getArticle<T>(key: string): T | null {
  return (store[key] as T) ?? null;
}
