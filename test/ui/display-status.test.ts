import { describe, expect, it } from 'vitest';
import { displayStatus, inTimeScope, type EventRow } from '../../src/ui/lib/event-filters';

const NOW = Date.parse('2026-09-04T12:00:00Z');
const PAST = '2026-01-01T20:00:00Z';
const FUTURE = '2030-01-01T20:00:00Z';

function row(over: Partial<EventRow>): EventRow {
  return { platform: 'ravepage', id: '1', title: 't', clubId: 'c', clubName: 'C', ...over };
}

describe('displayStatus', () => {
  it('shows "ended" for a past event whose status still reads active', () => {
    expect(displayStatus({ start: PAST, status: 'scheduled' }, NOW)).toBe('ended');
    expect(displayStatus({ start: PAST, status: 'published' }, NOW)).toBe('ended');
    expect(displayStatus({ start: PAST, status: 'promoted' }, NOW)).toBe('ended');
  });
  it('keeps the raw status for an upcoming event', () => {
    expect(displayStatus({ start: FUTURE, status: 'scheduled' }, NOW)).toBe('scheduled');
    expect(displayStatus({ start: FUTURE, status: 'published' }, NOW)).toBe('published');
  });
  it('uses end when known (past start, future end -> still active)', () => {
    expect(displayStatus({ start: PAST, end: FUTURE, status: 'live' }, NOW)).toBe('live');
  });
  it('leaves a non-active status unchanged (e.g. already "past")', () => {
    expect(displayStatus({ start: PAST, status: 'past' }, NOW)).toBe('past');
    expect(displayStatus({ status: 'draft' }, NOW)).toBe('draft'); // no date -> unchanged
  });
  it('keeps "draft" for a PAST draft (it never happened -> not "ended")', () => {
    expect(displayStatus({ start: PAST, status: 'draft' }, NOW)).toBe('draft');
    expect(displayStatus({ start: PAST, end: PAST, status: 'draft' }, NOW)).toBe('draft');
  });
});

describe('inTimeScope', () => {
  it('upcoming excludes past rows, all/past include them', () => {
    const past = row({ start: PAST, status: 'published' });
    const future = row({ start: FUTURE, status: 'published' });
    expect(inTimeScope(future, 'upcoming', NOW)).toBe(true);
    expect(inTimeScope(past, 'upcoming', NOW)).toBe(false);
    expect(inTimeScope(past, 'past', NOW)).toBe(true);
    expect(inTimeScope(future, 'past', NOW)).toBe(false);
    expect(inTimeScope(past, 'all', NOW)).toBe(true);
    expect(inTimeScope(future, 'all', NOW)).toBe(true);
  });
});
