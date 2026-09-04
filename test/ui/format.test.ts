import { describe, expect, it } from 'vitest';
import { formatLocalDate, formatLocalDateTime, formatLocalTime, formatRelativeDay } from '../../src/ui/lib/format';

describe('formatLocalDateTime', () => {
  it('returns empty for missing / invalid input', () => {
    expect(formatLocalDateTime(undefined)).toBe('');
    expect(formatLocalDateTime('not-a-date')).toBe('');
  });

  it('formats a valid instant to a non-empty string', () => {
    expect(formatLocalDateTime('2026-09-03T20:00:00Z')).not.toBe('');
    expect(formatLocalDate('2026-09-03T20:00:00Z')).not.toBe('');
    expect(formatLocalTime('2026-09-03T20:00:00Z')).not.toBe('');
  });

  it('honours the event zone (a midnight-UTC instant differs across zones)', () => {
    const iso = '2026-01-01T00:30:00Z';
    const utc = formatLocalDate(iso, 'UTC');
    const ny = formatLocalDate(iso, 'America/New_York'); // still Dec 31 there
    expect(utc).not.toBe(ny);
  });

  it('falls back to local formatting for an invalid zone (no throw)', () => {
    expect(() => formatLocalDateTime('2026-09-03T20:00:00Z', 'Not/AZone')).not.toThrow();
    expect(formatLocalDateTime('2026-09-03T20:00:00Z', 'Not/AZone')).not.toBe('');
  });
});

describe('formatRelativeDay', () => {
  const now = Date.parse('2026-09-04T12:00:00Z');
  it('same instant reads as today', () => {
    expect(formatRelativeDay('2026-09-04T12:00:00Z', now).toLowerCase()).toContain('today');
  });
  it('future/past reads as a day count', () => {
    expect(formatRelativeDay('2026-09-06T12:00:00Z', now).toLowerCase()).toContain('day');
    expect(formatRelativeDay('2026-09-01T12:00:00Z', now).toLowerCase()).toContain('day');
  });
  it('empty for invalid', () => {
    expect(formatRelativeDay(undefined, now)).toBe('');
  });
});
