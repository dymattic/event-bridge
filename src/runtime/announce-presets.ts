// User announcement-preset store (storage.local under `announcePresets`, user
// presets only — the three builtins live in core `DEFAULT_PRESETS`). Page/
// background side (webext storage); tested with a fake `ext.storage` like
// runtime/link-store. Views render a preset via core `renderAnnouncement`.
import { ext } from '../shared/webext';
import { BridgeError } from '../core/errors';
import { DEFAULT_PRESETS, type AnnouncePreset } from '../core/discord';

const KEY = 'announcePresets';

function isBuiltinId(id: string): boolean {
  return id.startsWith('builtin:');
}

export function newPresetId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `preset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function readUser(): Promise<AnnouncePreset[]> {
  const got = await ext.storage.local.get(KEY);
  const v = got[KEY];
  return Array.isArray(v) ? (v as AnnouncePreset[]) : [];
}

async function writeUser(list: AnnouncePreset[]): Promise<void> {
  await ext.storage.local.set({ [KEY]: list });
}

// Builtins first (fixed code order), then user presets newest-edited first.
export async function listPresets(): Promise<AnnouncePreset[]> {
  const user = [...(await readUser())].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return [...DEFAULT_PRESETS, ...user];
}

// Upsert a user preset by id. Refuses builtin ids (they live in code).
export async function savePreset(p: AnnouncePreset): Promise<void> {
  if (p.builtin || isBuiltinId(p.id)) throw new BridgeError('VALIDATION', 'cannot save a built-in preset');
  const now = new Date().toISOString();
  const user = (await readUser()).filter((u) => u.id !== p.id);
  user.push({ ...p, builtin: false, createdAt: p.createdAt || now, updatedAt: now });
  await writeUser(user);
}

// Remove a user preset. Refuses builtin ids.
export async function deletePreset(id: string): Promise<void> {
  if (isBuiltinId(id)) throw new BridgeError('VALIDATION', 'cannot delete a built-in preset');
  await writeUser((await readUser()).filter((u) => u.id !== id));
}

// Copy a builtin or user preset into a fresh user preset (new id, builtin=false).
export async function duplicatePreset(id: string, name: string): Promise<AnnouncePreset> {
  const src = (await listPresets()).find((p) => p.id === id);
  if (!src) throw new BridgeError('VALIDATION', `no preset ${id}`);
  const now = new Date().toISOString();
  const copy: AnnouncePreset = { ...src, id: newPresetId(), name, builtin: false, createdAt: now, updatedAt: now };
  const user = await readUser();
  user.push(copy);
  await writeUser(user);
  return copy;
}
