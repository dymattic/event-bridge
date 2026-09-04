import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { EventCore, IsoUtc, Slot } from '../../src/core/schema';
import { fromRavepage } from '../../src/core/mapping/from-ravepage';
import type { EventOut } from '../../src/adapters/ravepage/api-client/models/EventOut';
import { asIsoUtc, toDatetimeLocal } from '../../src/core/time';
import { deriveEnd, emptyForm, formIssues, fromCore, toCore } from '../../src/ui/lib/event-form';

function fx<T>(rel: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), 'test', 'fixtures', rel), 'utf8')) as T;
}

describe('event-form round-trip', () => {
  it('toCore(fromCore(x)) deep-equals the lineup-sample core (incl. sub-second instants + carried slot fields)', () => {
    const x = fx<EventCore>('core/lineup-sample.json');
    expect(toCore(fromCore(x))).toEqual(x);
  });

  it('toCore(fromCore(x)) deep-equals a rave.page event mapped through from-ravepage (empty-string vs undefined preserved)', () => {
    const x = fromRavepage(fx<EventOut>('ravepage/event-out.json'));
    expect(toCore(fromCore(x))).toEqual(x);
  });
});

describe('event-form time handling', () => {
  it('resolves a spring-forward gap (Europe/Berlin 2026-03-29 02:30) forward past the gap', () => {
    const f = emptyForm('Europe/Berlin');
    f.startLocal = '2026-03-29T02:30';
    const core = toCore(f);
    expect(core.start).toBe('2026-03-29T01:30:00Z');
    expect(fromCore(core).startLocal).toBe('2026-03-29T03:30'); // wall time reads forward
  });

  it('keeps an untouched instant byte-for-byte (no millis/second re-normalization)', () => {
    const x = fx<EventCore>('core/lineup-sample.json');
    expect(toCore(fromCore(x)).start).toBe(x.start); // '…:00.000Z' preserved via source
  });
});

describe('formIssues', () => {
  it('flags end before start', () => {
    const f = emptyForm('Europe/Berlin');
    f.title = 'Night';
    f.startLocal = '2026-09-10T22:00';
    f.endLocal = '2026-09-10T21:00';
    expect(formIssues(f).some((i) => i.path === 'end')).toBe(true);
  });

  it('flags doors after start', () => {
    const f = emptyForm('Europe/Berlin');
    f.title = 'Night';
    f.startLocal = '2026-09-10T22:00';
    f.doorsLocal = '2026-09-10T23:00';
    expect(formIssues(f).some((i) => i.path === 'doorsOpen')).toBe(true);
  });

  it('flags an invalid zone without throwing', () => {
    const f = emptyForm('Not/AZone');
    f.title = 'Night';
    f.startLocal = '2026-09-10T22:00';
    const issues = formIssues(f);
    expect(issues.some((i) => i.path === 'zone')).toBe(true);
  });

  it('with derive opts, validates the derived end so a stale form end never trips end-before-start', () => {
    const f = emptyForm('Europe/Berlin');
    f.title = 'Night';
    f.startLocal = '2026-09-10T22:00';
    f.endLocal = '2026-09-10T21:00'; // stale (end is no longer user-edited); would fail a raw check
    expect(formIssues(f, { defaultDurationMin: 120 }).some((i) => i.path === 'end')).toBe(false);
  });
});

// Minimal core anchored at a wall start; lineup slots passed as core Slots.
function coreWith(startLocal: string, lineup: Slot[] = [], zone = 'Europe/Berlin'): EventCore {
  const f = emptyForm(zone);
  f.title = 'Night';
  f.startLocal = startLocal;
  f.lineup = lineup;
  return toCore(f);
}
function slot(order: number, start: string, end?: string): Slot {
  const s: Slot = { order, start: asIsoUtc(start), performers: [], dancers: [] };
  if (end) s.end = asIsoUtc(end);
  return s;
}

describe('deriveEnd', () => {
  it('no lineup -> start + defaultDurationMin', () => {
    const core = coreWith('2026-09-10T22:00'); // Europe/Berlin CEST -> 20:00Z
    expect(deriveEnd(core, { defaultDurationMin: 120 })).toBe('2026-09-10T22:00:00Z');
  });

  it('lineup -> latest slot end; a slot without an end is DEFAULT_SLOT_MINUTES (60) long', () => {
    const core = coreWith('2026-09-10T22:00', [
      slot(1, '2026-09-10T20:00:00Z', '2026-09-10T21:00:00Z'),
      slot(2, '2026-09-10T21:00:00Z'), // no end -> 21:00 + 60 = 22:00, the latest
    ]);
    expect(deriveEnd(core, { defaultDurationMin: 120 })).toBe('2026-09-10T22:00:00Z');
  });

  it('edit: keeps the source end when the derived end is not later (a shrunk lineup never truncates)', () => {
    const core = coreWith('2026-09-10T22:00'); // no lineup -> derived 22:00Z
    const sourceEnd = '2026-09-11T02:00:00Z' as IsoUtc; // later than derived
    expect(deriveEnd(core, { defaultDurationMin: 120, sourceEnd })).toBe(sourceEnd);
  });

  it('edit: a grown lineup extends past the source end', () => {
    const core = coreWith('2026-09-10T22:00', [slot(1, '2026-09-10T20:00:00Z', '2026-09-11T03:00:00Z')]);
    const sourceEnd = '2026-09-11T02:00:00Z' as IsoUtc; // earlier than the grown slot end
    expect(deriveEnd(core, { defaultDurationMin: 120, sourceEnd })).toBe('2026-09-11T03:00:00Z');
  });

  it('returns undefined without a start (create), and keeps the source end without a start (edit)', () => {
    const core = coreWith(''); // blank required start
    expect(deriveEnd(core, { defaultDurationMin: 120 })).toBeUndefined();
    const sourceEnd = '2026-09-11T02:00:00Z' as IsoUtc;
    expect(deriveEnd(core, { defaultDurationMin: 120, sourceEnd })).toBe(sourceEnd);
  });

  it('is DST-safe: adding the default duration across a spring-forward advances the wall clock 3h for a 2h instant', () => {
    const core = coreWith('2026-03-29T01:30'); // Berlin, just before the 02:00->03:00 gap -> 00:30Z
    const end = deriveEnd(core, { defaultDurationMin: 120 });
    expect(end).toBe('2026-03-29T02:30:00Z'); // +120 min of real time
    expect(toDatetimeLocal(end as IsoUtc, 'Europe/Berlin')).toBe('2026-03-29T04:30'); // wall clock jumped the gap
  });
});
