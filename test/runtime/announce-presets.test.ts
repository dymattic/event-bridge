import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { deletePreset, duplicatePreset, listPresets, newPresetId, savePreset } from '../../src/runtime/announce-presets';
import { DEFAULT_PRESETS, type AnnouncePreset } from '../../src/core/discord';

import { createFake } from './fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-07T00:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

const BUILTIN_COUNT = DEFAULT_PRESETS.length;

describe('announce-presets store', () => {
  it('lists builtins first, then user presets newest-edited first', async () => {
    const first = await duplicatePreset('builtin:classic', 'Alpha');
    vi.setSystemTime(new Date('2026-09-07T01:00:00Z'));
    const second = await duplicatePreset('builtin:compact', 'Beta');

    const all = await listPresets();
    expect(all.slice(0, BUILTIN_COUNT).every((p) => p.builtin)).toBe(true);
    expect(all.slice(0, BUILTIN_COUNT).map((p) => p.id)).toEqual(DEFAULT_PRESETS.map((p) => p.id));
    // user presets after the builtins, newest updatedAt first
    expect(all.slice(BUILTIN_COUNT).map((p) => p.id)).toEqual([second.id, first.id]);
  });

  it('savePreset refuses builtin ids', async () => {
    const builtin = DEFAULT_PRESETS[0]!;
    await expect(savePreset(builtin)).rejects.toMatchObject({ code: 'VALIDATION' });
    // a user-id preset carrying builtin:true is still refused
    const sneaky: AnnouncePreset = { ...builtin, id: newPresetId(), builtin: true };
    await expect(savePreset(sneaky)).rejects.toMatchObject({ code: 'VALIDATION' });
  });

  it('savePreset upserts a user preset by id and bumps updatedAt', async () => {
    const copy = await duplicatePreset('builtin:classic', 'Mine');
    vi.setSystemTime(new Date('2026-09-07T02:00:00Z'));
    await savePreset({ ...copy, footer: 'edited {links}' });
    const stored = (await listPresets()).filter((p) => !p.builtin);
    expect(stored).toHaveLength(1); // upsert, not append
    expect(stored[0]?.footer).toBe('edited {links}');
    expect(stored[0]?.updatedAt).toBe('2026-09-07T02:00:00.000Z');
  });

  it('duplicatePreset copies a builtin into a new user preset', async () => {
    const src = DEFAULT_PRESETS.find((p) => p.id === 'builtin:classic')!;
    const copy = await duplicatePreset('builtin:classic', 'Classic copy');
    expect(copy.builtin).toBe(false);
    expect(copy.id).not.toBe('builtin:classic');
    expect(copy.name).toBe('Classic copy');
    expect(copy.header).toBe(src.header);
    expect((await listPresets()).filter((p) => !p.builtin)).toHaveLength(1);
  });

  it('deletePreset removes a user preset and refuses builtin ids', async () => {
    const copy = await duplicatePreset('builtin:classic', 'Trash me');
    await deletePreset(copy.id);
    expect((await listPresets()).filter((p) => !p.builtin)).toHaveLength(0);
    await expect(deletePreset('builtin:classic')).rejects.toMatchObject({ code: 'VALIDATION' });
  });
});
