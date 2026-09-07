// DJ-name list normalizer for "My gigs". PURE (no runtime/webext imports) so
// node/happy-dom tests load it. The stored list is trimmed, non-empty, deduped
// case-insensitively (first spelling wins), each capped to MAX_GIG_NAME_LEN, and
// the whole list capped to MAX_GIG_NAMES.

export const MAX_GIG_NAMES = 10;
export const MAX_GIG_NAME_LEN = 64;

export function normalizeGigNames(names: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const n = raw.trim().slice(0, MAX_GIG_NAME_LEN);
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
    if (out.length >= MAX_GIG_NAMES) break;
  }
  return out;
}
