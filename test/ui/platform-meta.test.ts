import { describe, expect, it } from 'vitest';
import { PUBLIC_EVENT_URL, PUBLIC_PERFORMER_URL } from '../../src/ui/lib/platform-meta';

describe('PUBLIC_EVENT_URL — public share links (pure)', () => {
  it('builds the third-party public event pages', () => {
    expect(PUBLIC_EVENT_URL.vrctl('42')).toBe('https://vrc.tl/event/42');
    expect(PUBLIC_EVENT_URL.vrcpop('7')).toBe('https://vrcpop.com/event/7');
  });
});

describe('PUBLIC_PERFORMER_URL', () => {
  it('builds the vrcpop performer profile from a slug', () => {
    expect(PUBLIC_PERFORMER_URL.vrcpop('dymattic')).toBe('https://vrcpop.com/u/dymattic');
  });
});
