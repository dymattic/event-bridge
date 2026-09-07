import { describe, expect, it } from 'vitest';
import { MAX_GIG_NAME_LEN, MAX_GIG_NAMES, normalizeGigNames } from '../../src/ui/lib/gig-names';

describe('normalizeGigNames', () => {
  it('trims, drops empties, keeps first-seen order', () => {
    expect(normalizeGigNames(['  DJ Example  ', '', '   ', 'Second'])).toEqual(['DJ Example', 'Second']);
  });

  it('dedupes case-insensitively, first spelling wins', () => {
    expect(normalizeGigNames(['DJ Example', 'dj example', 'DJ EXAMPLE', 'Other'])).toEqual(['DJ Example', 'Other']);
  });

  it('caps each name to MAX_GIG_NAME_LEN chars', () => {
    const long = 'a'.repeat(MAX_GIG_NAME_LEN + 20);
    const [only] = normalizeGigNames([long]);
    expect(only).toHaveLength(MAX_GIG_NAME_LEN);
  });

  it('caps the list to MAX_GIG_NAMES', () => {
    const many = Array.from({ length: MAX_GIG_NAMES + 5 }, (_, i) => `name${i}`);
    expect(normalizeGigNames(many)).toHaveLength(MAX_GIG_NAMES);
  });

  it('returns [] for an all-empty input', () => {
    expect(normalizeGigNames(['', '   ', '\t'])).toEqual([]);
  });
});
