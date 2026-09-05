import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import {
  DEFAULT_SETTINGS,
  RAVEPAGE_DEFAULT_INSTANCE,
  enabledPlatforms,
  getRavepageInstance,
  getSettings,
  isRavepageEnabled,
  normalizeOrigin,
  onSettingsChange,
  setSettings,
  type Settings,
} from '../../src/runtime/settings';
import { createFake } from './fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('settings defaults + merge', () => {
  it('returns defaults when storage is empty (rave.page off by default)', async () => {
    const s = await getSettings();
    expect(s).toEqual(DEFAULT_SETTINGS);
    expect(s.experimental.ravepage).toBe(false);
    expect(s.ravepage).toEqual(RAVEPAGE_DEFAULT_INSTANCE);
  });

  it('deep-merges nested defaults over a legacy stored shape', async () => {
    // Legacy settings predate experimental/ravepage — they must load with defaults.
    h.ext = createFake({ storage: { settings: { closeOpenedTabs: false, testPrefix: 'OLD ' } } }).ext;
    const s = await getSettings();
    expect(s.closeOpenedTabs).toBe(false);
    expect(s.testPrefix).toBe('OLD ');
    expect(s.experimental).toEqual({ ravepage: false });
    expect(s.ravepage).toEqual(RAVEPAGE_DEFAULT_INSTANCE);
  });

  it('defaults the editor duration and deep-merges a stored editor block', async () => {
    expect((await getSettings()).editor.defaultDurationMin).toBe(120);
    h.ext = createFake({ storage: { settings: { editor: { defaultDurationMin: 90 } } } }).ext;
    expect((await getSettings()).editor.defaultDurationMin).toBe(90);
  });

  it('defaults developer.panels off and deep-merges a stored developer block', async () => {
    expect((await getSettings()).developer.panels).toBe(false);
    // Legacy settings predate `developer` — it must load with the default.
    h.ext = createFake({ storage: { settings: { testPrefix: 'OLD ' } } }).ext;
    expect((await getSettings()).developer).toEqual({ panels: false });
    h.ext = createFake({ storage: { settings: { developer: { panels: true } } } }).ext;
    expect((await getSettings()).developer.panels).toBe(true);
  });

  it('deep-merges a partial nested object (keeps the other default fields)', async () => {
    h.ext = createFake({ storage: { settings: { ravepage: { apiOrigin: 'https://api.custom.example' } } } }).ext;
    const s = await getSettings();
    expect(s.ravepage.apiOrigin).toBe('https://api.custom.example');
    expect(s.ravepage.appOrigin).toBe(RAVEPAGE_DEFAULT_INSTANCE.appOrigin); // default preserved
  });

  it('merges a partial patch over defaults and persists', async () => {
    const next = await setSettings({ closeOpenedTabs: false });
    expect(next.closeOpenedTabs).toBe(false);
    expect(next.testPrefix).toBe(DEFAULT_SETTINGS.testPrefix);
    expect((await getSettings()).closeOpenedTabs).toBe(false);
  });

  it('emits merged settings on change, stops after unsubscribe', async () => {
    const seen: Settings[] = [];
    const off = onSettingsChange((s) => seen.push(s));
    await setSettings({ testPrefix: 'X ' });
    expect(seen).toHaveLength(1);
    expect(seen[0]?.testPrefix).toBe('X ');
    expect(seen[0]?.experimental).toEqual({ ravepage: false });
    off();
    await setSettings({ testPrefix: 'Y ' });
    expect(seen).toHaveLength(1);
  });
});

describe('isRavepageEnabled / getRavepageInstance', () => {
  it('reflects the stored toggle + instance', async () => {
    expect(await isRavepageEnabled()).toBe(false);
    await setSettings({ experimental: { ravepage: true } });
    expect(await isRavepageEnabled()).toBe(true);
    expect(await getRavepageInstance()).toEqual(RAVEPAGE_DEFAULT_INSTANCE);
  });
});

describe('enabledPlatforms', () => {
  it('two platforms by default (no rave.page)', () => {
    expect(enabledPlatforms(DEFAULT_SETTINGS)).toEqual(['vrctl', 'vrcpop']);
  });
  it('three with the toggle on, rave.page last', () => {
    expect(enabledPlatforms({ ...DEFAULT_SETTINGS, experimental: { ravepage: true } })).toEqual([
      'vrctl',
      'vrcpop',
      'ravepage',
    ]);
  });
});

describe('normalizeOrigin', () => {
  it('accepts https and drops path/query/hash/credentials, lowercases host', () => {
    expect(normalizeOrigin('https://API.Custom.Example/v1/x?y=1#z')).toEqual({ ok: true, origin: 'https://api.custom.example' });
    expect(normalizeOrigin('  https://rave.example  ')).toEqual({ ok: true, origin: 'https://rave.example' });
    expect(normalizeOrigin('https://user:pass@rave.example')).toEqual({ ok: true, origin: 'https://rave.example' });
    expect(normalizeOrigin('https://rave.example:8443')).toEqual({ ok: true, origin: 'https://rave.example:8443' });
  });

  it('allows http only for localhost / 127.0.0.1', () => {
    expect(normalizeOrigin('http://localhost:8000')).toEqual({ ok: true, origin: 'http://localhost:8000' });
    expect(normalizeOrigin('http://127.0.0.1:3000/x')).toEqual({ ok: true, origin: 'http://127.0.0.1:3000' });
    expect(normalizeOrigin('http://rave.example').ok).toBe(false);
  });

  it('rejects empty, non-URL, and non-http(s) schemes', () => {
    expect(normalizeOrigin('').ok).toBe(false);
    expect(normalizeOrigin('   ').ok).toBe(false);
    expect(normalizeOrigin('not a url').ok).toBe(false);
    expect(normalizeOrigin('ftp://rave.example').ok).toBe(false);
    expect(normalizeOrigin('rave.example').ok).toBe(false); // no scheme
  });
});
