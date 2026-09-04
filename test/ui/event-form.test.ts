import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { EventCore } from '../../src/core/schema';
import { fromRavepage } from '../../src/core/mapping/from-ravepage';
import type { EventOut } from '../../src/adapters/ravepage/api-client/models/EventOut';
import { emptyForm, formIssues, fromCore, toCore } from '../../src/ui/lib/event-form';

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
});
