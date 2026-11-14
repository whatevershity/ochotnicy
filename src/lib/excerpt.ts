/** Pierwsze N pełnych zdań — bez ucinania w połowie. */
export function firstSentences(text: string, count = 2): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const ends = [...clean.matchAll(/[.!?…](?=\s|$)/g)];
  if (ends.length === 0) return clean;

  const nth = ends[Math.min(count, ends.length) - 1];
  const end = (nth.index ?? 0) + 1;
  return clean.slice(0, end).trim();
}

export function hasMoreAfter(full: string, shown: string): boolean {
  const a = full.replace(/\s+/g, " ").trim();
  const b = shown.replace(/\s+/g, " ").trim();
  if (!a) return false;
  if (/…|\.\.\.\s*$/.test(a) && a.length <= b.length + 4) return true;
  return a.length > b.length + 8;
}
