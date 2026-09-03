import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deletePayload, makeVocab, parsePerformerSearchAll } from '../../../src/adapters/vrcpop/payloads';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrcpop');
const fx = (p: string): unknown => JSON.parse(readFileSync(join(FIX, p), 'utf8'));

describe('makeVocab', () => {
  it('maps the genres + energy vocabularies to {id,name}', () => {
    const vocab = makeVocab(fx('genres.json'), fx('energy.json'));
    expect(vocab.genres.length).toBeGreaterThan(10);
    expect(vocab.genres.find((g) => g.name === 'Trance')).toEqual({ id: 6, name: 'Trance' });
    expect(vocab.energies).toHaveLength(4);
    expect(vocab.energies[0]).toEqual({ id: 1, name: '⚡ Chill' });
  });
});

describe('parsePerformerSearchAll', () => {
  it('returns historical free-text names when no linked profile exists', () => {
    const hits = parsePerformerSearchAll({ success: true, profiles: [], historical: [{ name: 'Example DJ', use_count: 4, source: 'historical' }] });
    expect(hits).toEqual([{ name: 'Example DJ', profileId: null, source: 'historical' }]);
  });
  it('lists linked profiles first', () => {
    const hits = parsePerformerSearchAll({ profiles: [{ name: 'Linked', profile_id: 42 }], historical: [{ name: 'Old' }] });
    expect(hits[0]).toEqual({ name: 'Linked', profileId: 42, source: 'profile' });
    expect(hits[1]).toEqual({ name: 'Old', profileId: null, source: 'historical' });
  });
});

describe('deletePayload', () => {
  it('is {event_id} per the site delete handler', () => {
    expect(deletePayload(100001)).toEqual({ event_id: 100001 });
  });
});
