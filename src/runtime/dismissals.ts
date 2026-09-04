// Dismissed match suggestions (storage.local key `dismissedSuggestions`, a
// string[] of Suggestion keys). Persisting a dismissal hides that "probably the
// same event" suggestion for good. Tested with a fake `ext.storage`.
import { ext } from '../shared/webext';

const KEY = 'dismissedSuggestions';

async function readAll(): Promise<string[]> {
  const got = await ext.storage.local.get(KEY);
  const v = got[KEY];
  return Array.isArray(v) ? (v as string[]) : [];
}

export async function listDismissed(): Promise<string[]> {
  return readAll();
}

export async function dismissSuggestion(key: string): Promise<void> {
  const all = await readAll();
  if (all.includes(key)) return;
  await ext.storage.local.set({ [KEY]: [...all, key] });
}
