// vrcpop JSON read/response shapers. Create/update event payloads come from
// core `toVrcpopPayload`; this module handles vocab, performer search, and the
// delete payload. Write-response parsing lives in http-result.ts.
import { BridgeError } from '../../core/errors';
import type { VrcpopVocabItem } from '../../core/mapping/to-vrcpop';
import type { PerformerHit, VrcpopVocab } from './types';

interface GenresBody {
  genres?: { id: number; name: string }[];
}
interface EnergyBody {
  energy_levels?: { id: number; name: string }[];
}

function toItems(raw: { id: number; name: string }[] | undefined, what: string): VrcpopVocabItem[] {
  if (!Array.isArray(raw)) throw new BridgeError('PARSE', `vocab: ${what} array missing`);
  return raw.map((v) => ({ id: v.id, name: v.name }));
}

export function parseGenres(body: unknown): VrcpopVocabItem[] {
  return toItems((body as GenresBody)?.genres, 'genres');
}

export function parseEnergy(body: unknown): VrcpopVocabItem[] {
  return toItems((body as EnergyBody)?.energy_levels, 'energy_levels');
}

export function makeVocab(genresBody: unknown, energyBody: unknown): VrcpopVocab {
  return { genres: parseGenres(genresBody), energies: parseEnergy(energyBody) };
}

interface SearchAllBody {
  success?: boolean;
  profiles?: { name: string; profile_id?: number | null; id?: number | null; slug?: string | null }[];
  historical?: { name: string; use_count?: number; source?: string }[];
}

// action=search-all is the working performer lookup (action=search returns 400
// "Unknown action" per recon). Profiles (linked accounts) first, then historical
// free-text names the club has used before. `slug` (profile page) rides along
// when present — the owner's own name may return historical-only (no profiles).
export function parsePerformerSearchAll(body: unknown): PerformerHit[] {
  const b = (body ?? {}) as SearchAllBody;
  const out: PerformerHit[] = [];
  for (const p of b.profiles ?? []) {
    const hit: PerformerHit = { name: p.name, profileId: p.profile_id ?? p.id ?? null, source: 'profile' };
    if (p.slug) hit.slug = p.slug;
    out.push(hit);
  }
  for (const h of b.historical ?? []) {
    out.push({ name: h.name, profileId: null, source: 'historical' });
  }
  return out;
}

export function deletePayload(eventId: number): { event_id: number } {
  return { event_id: eventId };
}
