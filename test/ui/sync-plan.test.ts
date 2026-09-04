import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore, Performer, PlatformId } from '../../src/core/schema';
import {
  planSync,
  projectScoped,
  scopedHash,
  type LinkSync,
  type SyncFields,
  type SyncLink,
} from '../../src/ui/lib/sync-plan';

const START = asIsoUtc('2030-01-05T22:00:00.000Z');
const ALL: SyncFields = { details: true, lineup: true, poster: true, publishState: true };

function dj(name: string, platform?: PlatformId, id?: string): Performer {
  return { name, aliases: platform ? [{ platform, id, name }] : [] };
}

function core(over: Partial<EventCore> = {}): EventCore {
  return {
    title: 'Rave',
    description: 'desc',
    start: START,
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: 'Club', platformIds: {} },
    lineup: [{ order: 1, start: START, performers: [dj('Example DJ')], dancers: [] }],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'unlisted' },
    flags: {},
    music: { genres: [] },
    links: {},
    extras: {},
    ...over,
  };
}

function link(sync: Partial<LinkSync> = {}, lastSynced?: SyncLink['lastSynced']): SyncLink {
  return {
    anchorId: 'a1',
    refs: [{ platform: 'vrcpop', id: '1' }, { platform: 'vrctl', id: '2' }],
    sync: { mode: 'notify', source: 'last-edited', fields: ALL, ...sync },
    lastSynced,
  };
}

describe('projectScoped', () => {
  it('includes only the opted-in fields', () => {
    const c = core({ description: 'hi' });
    expect(Object.keys(projectScoped(c, { details: true, lineup: false, poster: false, publishState: false }))).toEqual(['details']);
    expect(Object.keys(projectScoped(c, { details: false, lineup: true, poster: false, publishState: false }))).toEqual(['lineup']);
    expect(Object.keys(projectScoped(c, { details: false, lineup: false, poster: false, publishState: true }))).toEqual(['publishState']);
  });

  it('never projects poster bytes (bytes -> null)', () => {
    const c = core({ poster: { kind: 'bytes', bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/png' } });
    expect(projectScoped(c, { details: false, lineup: false, poster: true, publishState: false }).poster).toBeNull();
  });
});

describe('scopedHash', () => {
  it('is stable for the same core + fields', async () => {
    expect(await scopedHash(core(), ALL)).toBe(await scopedHash(core(), ALL));
  });
  it('ignores a change OUTSIDE the scope', async () => {
    const fields: SyncFields = { details: true, lineup: false, poster: false, publishState: false };
    const a = await scopedHash(core(), fields);
    const b = await scopedHash(core({ lineup: [{ order: 1, start: START, performers: [dj('Different')], dancers: [] }] }), fields);
    expect(a).toBe(b); // lineup out of scope -> invisible
  });
  it('changes for a change INSIDE the scope', async () => {
    const a = await scopedHash(core(), ALL);
    const b = await scopedHash(core({ title: 'New Title' }), ALL);
    expect(a).not.toBe(b);
  });
});

describe('projectScoped canonicalization (P7.2)', () => {
  const withLineup = (perfs: string[], genres: string[]): EventCore =>
    core({ music: { genres }, lineup: [{ order: 1, start: START, performers: perfs.map((n) => dj(n)), dancers: [] }] });

  it('hashes equal when performers and genres are only reordered', async () => {
    const a = await scopedHash(withLineup(['Alice', 'Bob'], ['House', 'Techno']), ALL);
    const b = await scopedHash(withLineup(['Bob', 'Alice'], ['Techno', 'House']), ALL);
    expect(a).toBe(b);
  });

  it('hashes equal when slots are reordered (canonical start order)', async () => {
    const s1 = { order: 1, start: asIsoUtc('2030-01-05T22:00:00.000Z'), performers: [dj('A')], dancers: [] };
    const s2 = { order: 2, start: asIsoUtc('2030-01-05T23:00:00.000Z'), performers: [dj('B')], dancers: [] };
    expect(await scopedHash(core({ lineup: [s1, s2] }), ALL)).toBe(await scopedHash(core({ lineup: [s2, s1] }), ALL));
  });

  it('still differs for a real change (renamed performer or added genre)', async () => {
    const base = await scopedHash(withLineup(['Alice', 'Bob'], ['House']), ALL);
    expect(await scopedHash(withLineup(['Alice', 'Carol'], ['House']), ALL)).not.toBe(base);
    expect(await scopedHash(withLineup(['Alice', 'Bob'], ['House', 'Trance']), ALL)).not.toBe(base);
  });
});

describe('planSync states', () => {
  const cores = { vrcpop: core(), vrctl: core() };

  it('off -> off', () => {
    const a = planSync({ link: link({ mode: 'off' }), cores, hashes: { vrcpop: 'h', vrctl: 'h' } });
    expect(a.state).toBe('off');
  });

  it('in-sync when all hashes match their baseline', () => {
    const a = planSync({
      link: link({}, { vrcpop: { hash: 'h', at: 't' }, vrctl: { hash: 'h', at: 't' } }),
      cores,
      hashes: { vrcpop: 'h', vrctl: 'h' },
    });
    expect(a.state).toBe('in-sync');
    expect(a.changedSince).toEqual([]);
  });

  it('pending (last-edited, single changed) -> source is the changed ref, other is the target', () => {
    const a = planSync({
      link: link({}, { vrcpop: { hash: 'old', at: 't' }, vrctl: { hash: 'h2', at: 't' } }),
      cores: { vrcpop: core({ title: 'Changed' }), vrctl: core() },
      hashes: { vrcpop: 'h1', vrctl: 'h2' }, // vrcpop drifted
    });
    expect(a.state).toBe('pending');
    expect(a.source).toBe('vrcpop');
    expect(a.changedSince).toEqual(['vrcpop']);
    expect(a.targets.map((t) => t.platform)).toEqual(['vrctl']);
    expect(a.targets[0]?.conflict).toBe(false);
    expect(a.targets[0]?.changes.some((c) => c.path === 'details.title')).toBe(true);
  });

  it('conflict (last-edited, >1 changed with baselines)', () => {
    const a = planSync({
      link: link({}, { vrcpop: { hash: 'oldA', at: 't' }, vrctl: { hash: 'oldB', at: 't' } }),
      cores: { vrcpop: core({ title: 'A' }), vrctl: core({ title: 'B' }) },
      hashes: { vrcpop: 'hA', vrctl: 'hB' }, // both drifted, hashes differ
    });
    expect(a.state).toBe('conflict');
    expect(a.changedSince).toEqual(['vrctl', 'vrcpop']); // PLATFORM_ORDER
    expect(a.targets.some((t) => t.conflict)).toBe(true);
  });

  it('pick-source (first run, no baseline, refs differ)', () => {
    const a = planSync({
      link: link(), // no lastSynced
      cores: { vrcpop: core({ title: 'A' }), vrctl: core({ title: 'B' }) },
      hashes: { vrcpop: 'hA', vrctl: 'hB' },
    });
    expect(a.state).toBe('pick-source');
    expect(a.source).toBe('vrctl'); // first present by PLATFORM_ORDER
  });

  it('in-sync (first run, no baseline, refs identical)', () => {
    const a = planSync({ link: link(), cores, hashes: { vrcpop: 'same', vrctl: 'same' } });
    expect(a.state).toBe('in-sync');
  });

  it('explicit source -> pending toward the other; a drifted target is a conflict', () => {
    const pending = planSync({
      link: link({ source: 'vrcpop' }, { vrcpop: { hash: 'h1', at: 't' }, vrctl: { hash: 'h2', at: 't' } }),
      cores: { vrcpop: core({ title: 'Src' }), vrctl: core() },
      hashes: { vrcpop: 'h1', vrctl: 'h2' }, // neither drifted from baseline
    });
    expect(pending.state).toBe('pending');
    expect(pending.source).toBe('vrcpop');
    expect(pending.targets[0]?.conflict).toBe(false);

    const conflict = planSync({
      link: link({ source: 'vrcpop' }, { vrcpop: { hash: 'h1', at: 't' }, vrctl: { hash: 'oldB', at: 't' } }),
      cores: { vrcpop: core({ title: 'Src' }), vrctl: core({ title: 'TgtEdited' }) },
      hashes: { vrcpop: 'h1', vrctl: 'hB' }, // vrctl drifted from its baseline
    });
    expect(conflict.state).toBe('conflict');
    expect(conflict.targets.find((t) => t.platform === 'vrctl')?.conflict).toBe(true);
  });
});

describe('planSync field scoping', () => {
  it('a change outside the scope is invisible (no pending)', () => {
    const fields: SyncFields = { details: true, lineup: false, poster: false, publishState: false };
    // vrcpop drifted only in lineup (out of scope) -> its scoped hash equals baseline in a real run.
    const a = planSync({
      link: link({ fields }, { vrcpop: { hash: 'h', at: 't' }, vrctl: { hash: 'h', at: 't' } }),
      cores: { vrcpop: core({ lineup: [{ order: 1, start: START, performers: [dj('X')], dancers: [] }] }), vrctl: core() },
      hashes: { vrcpop: 'h', vrctl: 'h' }, // engine computed equal scoped hashes (lineup excluded)
    });
    expect(a.state).toBe('in-sync');
  });
});
