// Typed storage.local settings. Page-side (dashboard/popup); DOM/chrome types.
import { ext } from '../shared/webext';
import type { Platform } from '../shared/agent-protocol';
// Type-only (erased): sync default shape owned by the pure sync planner.
import type { SyncSettings } from '../ui/lib/sync-plan';

// rave.page instance the extension talks to. Configurable so a self-hosted /
// federated rave.page can be used instead of the default dev instance.
export interface RavepageInstance {
  appOrigin: string; // SPA origin (bridge page + event links)
  apiOrigin: string; // API origin (OpenAPI base + token exchange)
}

export interface Settings {
  closeOpenedTabs: boolean;
  testPrefix: string;
  experimental: { ravepage: boolean }; // rave.page integration off by default
  ravepage: RavepageInstance;
  sync: SyncSettings; // defaults new links inherit (off by default)
}

// Default sync settings a new link inherits: off, source = last-edited, publish
// state NOT synced by default (a publish flip is deliberate, never automatic).
export const DEFAULT_SYNC: SyncSettings = {
  mode: 'off',
  source: 'last-edited',
  fields: { details: true, lineup: true, poster: true, publishState: false },
};

// Default (dev) rave.page instance. THE ONLY place these hosts are literal in src.
export const RAVEPAGE_DEFAULT_INSTANCE: RavepageInstance = {
  appOrigin: 'https://development.rave.page',
  apiOrigin: 'https://development.api.rave.page',
};

export const DEFAULT_SETTINGS: Settings = {
  closeOpenedTabs: true,
  testPrefix: '[event-bridge test] ',
  experimental: { ravepage: false },
  ravepage: { ...RAVEPAGE_DEFAULT_INSTANCE },
  sync: { ...DEFAULT_SYNC, fields: { ...DEFAULT_SYNC.fields } },
};

const KEY = 'settings';

// Deep-merge nested defaults so settings stored before these keys existed load.
function merge(stored: unknown): Settings {
  const s = (typeof stored === 'object' && stored !== null ? stored : {}) as Partial<Settings>;
  const exp = (typeof s.experimental === 'object' && s.experimental !== null ? s.experimental : {}) as Partial<Settings['experimental']>;
  const rp = (typeof s.ravepage === 'object' && s.ravepage !== null ? s.ravepage : {}) as Partial<RavepageInstance>;
  const sy = (typeof s.sync === 'object' && s.sync !== null ? s.sync : {}) as Partial<SyncSettings>;
  const syFields = (typeof sy.fields === 'object' && sy.fields !== null ? sy.fields : {}) as Partial<SyncSettings['fields']>;
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    experimental: { ...DEFAULT_SETTINGS.experimental, ...exp },
    ravepage: { ...DEFAULT_SETTINGS.ravepage, ...rp },
    sync: { ...DEFAULT_SYNC, ...sy, fields: { ...DEFAULT_SYNC.fields, ...syFields } },
  };
}

export async function getSettings(): Promise<Settings> {
  const got = await ext.storage.local.get(KEY);
  return merge(got[KEY]);
}

// Shallow patch over current settings, persisted. Nested objects replace whole
// (callers pass complete `experimental`/`ravepage` objects).
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

// Normalize a user-typed instance origin. Accepts https (any host) or http for
// localhost/127.0.0.1 only; drops path/query/hash/credentials; lowercases host.
export function normalizeOrigin(input: string): { ok: true; origin: string } | { ok: false; reason: string } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, reason: 'origin is empty' };
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, reason: 'not a valid URL' };
  }
  const host = url.hostname.toLowerCase();
  const local = host === 'localhost' || host === '127.0.0.1';
  if (url.protocol === 'https:') {
    // ok
  } else if (url.protocol === 'http:') {
    if (!local) return { ok: false, reason: 'http allowed only for localhost/127.0.0.1' };
  } else {
    return { ok: false, reason: 'scheme must be https' };
  }
  // URL.origin already drops path/query/hash/credentials and lowercases the host.
  return { ok: true, origin: url.origin };
}

export async function getRavepageInstance(): Promise<RavepageInstance> {
  return (await getSettings()).ravepage;
}

export async function isRavepageEnabled(): Promise<boolean> {
  return (await getSettings()).experimental.ravepage;
}

// Platforms that appear in the product, in fixed display order. rave.page only
// when the experimental toggle is on.
export function enabledPlatforms(s: Settings): Platform[] {
  return s.experimental.ravepage ? ['vrctl', 'vrcpop', 'ravepage'] : ['vrctl', 'vrcpop'];
}
