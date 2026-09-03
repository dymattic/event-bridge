import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { DEFAULT_SETTINGS, getSettings, onSettingsChange, setSettings, type Settings } from '../../src/runtime/settings';
import { createFake } from './fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('settings', () => {
  it('returns defaults when storage is empty', async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('merges a partial patch over defaults and persists', async () => {
    const next = await setSettings({ closeOpenedTabs: false });
    expect(next.closeOpenedTabs).toBe(false);
    expect(next.testPrefix).toBe(DEFAULT_SETTINGS.testPrefix);
    expect((await getSettings()).closeOpenedTabs).toBe(false);
  });

  it('emits merged settings on change, and stops after unsubscribe', async () => {
    const seen: Settings[] = [];
    const off = onSettingsChange((s) => seen.push(s));
    await setSettings({ testPrefix: 'X ' });
    expect(seen).toHaveLength(1);
    expect(seen[0]).toEqual({ closeOpenedTabs: true, testPrefix: 'X ' });
    off();
    await setSettings({ testPrefix: 'Y ' });
    expect(seen).toHaveLength(1);
  });
});
