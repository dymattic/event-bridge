// Typed storage.local settings. Page-side (dashboard/popup); DOM/chrome types.
import { ext } from '../shared/webext';

export interface Settings {
  closeOpenedTabs: boolean;
  testPrefix: string;
}

export const DEFAULT_SETTINGS: Settings = {
  closeOpenedTabs: true,
  testPrefix: '[event-bridge test] ',
};

const KEY = 'settings';

function merge(stored: unknown): Settings {
  const s = (typeof stored === 'object' && stored !== null ? stored : {}) as Partial<Settings>;
  return { ...DEFAULT_SETTINGS, ...s };
}

export async function getSettings(): Promise<Settings> {
  const got = await ext.storage.local.get(KEY);
  return merge(got[KEY]);
}

export async function setSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await getSettings()), ...patch };
  await ext.storage.local.set({ [KEY]: next });
  return next;
}

export function onSettingsChange(cb: (s: Settings) => void): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: chrome.storage.AreaName,
  ): void => {
    if (area === 'local' && KEY in changes) cb(merge(changes[KEY]?.newValue));
  };
  ext.storage.onChanged.addListener(listener);
  return () => ext.storage.onChanged.removeListener(listener);
}
