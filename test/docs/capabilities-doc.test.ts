// Cheap drift guard: the human capability matrix (docs/platforms/capabilities.md)
// must carry a row for every capability field + supported flag in the CAPS table.
// The label maps are EXHAUSTIVE over the code types, so adding a capability/flag
// to the schema fails compilation here until the doc is updated too.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAPS, type FlagKey, type PlatformCapabilities } from '../../src/core/capabilities';

const doc = readFileSync(join(process.cwd(), 'docs', 'platforms', 'capabilities.md'), 'utf8');

const ROW_LABEL: Record<keyof PlatformCapabilities, string | null> = {
  platform: null,
  draft: 'Draft',
  performerIds: 'Performer ids',
  vj: 'VJ slot',
  dancers: 'Dancers',
  hosts: 'Hosts',
  perSlotGenre: 'Per-slot genre',
  perSlotEnergy: 'Per-slot energy',
  b2b: 'B2B',
  slotGaps: 'Slot gaps',
  posterUrl: 'Poster by URL',
  posterUpload: 'Poster by upload',
  flags: null, // covered by per-flag rows
  descriptionMaxLength: null, // not shown as a matrix row
  requiredFields: 'Required fields',
};

const FLAG_LABEL: Record<FlagKey, string> = {
  nsfw: 'Flag: NSFW',
  ageGated: 'Flag: age-gated',
  openDecks: 'Flag: open decks',
  questCompatible: 'Flag: Quest compatible',
  platforms: 'Flag: platforms',
  photosensitivity: 'Flag: photosensitivity',
  avatarRestrictions: 'Flag: avatar restrictions',
};

describe('capability matrix doc', () => {
  it('names every platform', () => {
    for (const name of ['vrc.tl', 'vrcpop.com', 'rave.page']) expect(doc, name).toContain(name);
  });

  it('has a row for every capability field in CAPS', () => {
    for (const [key, label] of Object.entries(ROW_LABEL) as [keyof PlatformCapabilities, string | null][]) {
      if (label) expect(doc, key).toContain(label);
    }
  });

  it('has a row for every flag at least one platform supports', () => {
    const supported = new Set<FlagKey>();
    for (const caps of Object.values(CAPS)) {
      for (const k of Object.keys(caps.flags) as FlagKey[]) if (caps.flags[k]) supported.add(k);
    }
    for (const k of supported) expect(doc, k).toContain(FLAG_LABEL[k]);
  });
});
