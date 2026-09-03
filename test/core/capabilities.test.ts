import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore } from '../../src/core/schema';
import { computeLoss, RAVEPAGE_CAPS, VRCPOP_CAPS, VRCTL_CAPS } from '../../src/core/capabilities';

function richCore(): EventCore {
  return {
    title: 'x',
    start: asIsoUtc('2026-09-03T20:00:00Z'),
    end: asIsoUtc('2026-09-03T23:00:00Z'),
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: '', platformIds: {} },
    lineup: [
      {
        order: 1,
        start: asIsoUtc('2026-09-03T20:00:00Z'),
        end: asIsoUtc('2026-09-03T21:00:00Z'),
        performers: [{ name: 'A', aliases: [] }],
        vj: { name: 'VJ', aliases: [] },
        dancers: [{ name: 'D', aliases: [] }],
        genre: 'DnB',
        energy: 'High',
      },
    ],
    hosts: [{ name: 'Host', aliases: [] }],
    dancers: [{ name: 'ED', aliases: [] }],
    visibility: { publish: false, audience: 'public' },
    flags: {},
    music: { genres: [] },
    links: {},
    extras: {},
  };
}

const paths = (arr: { path: string }[]): string[] => arr.map((e) => e.path);

describe('computeLoss', () => {
  it('vrc.tl drops vj/dancers/hosts/per-slot genre and requires NSFW', () => {
    const loss = computeLoss(richCore(), VRCTL_CAPS);
    expect(paths(loss.dropped)).toEqual(expect.arrayContaining(['lineup.0.vj', 'dancers', 'lineup.0.dancers', 'hosts', 'lineup.*.genre']));
    expect(paths(loss.required)).toContain('flags.nsfw');
  });

  it('rave.page drops vj/dancers but does not require NSFW', () => {
    const loss = computeLoss(richCore(), RAVEPAGE_CAPS);
    expect(paths(loss.dropped)).toEqual(expect.arrayContaining(['lineup.0.vj', 'dancers', 'hosts']));
    expect(loss.required).toHaveLength(0);
  });

  it('vrcpop keeps vj/dancers/genre (no drops for those)', () => {
    const loss = computeLoss(richCore(), VRCPOP_CAPS);
    expect(paths(loss.dropped)).not.toContain('lineup.0.vj');
    expect(paths(loss.dropped)).not.toContain('dancers');
  });

  it('gaps approximated on vrc.tl (contiguous) but not on rave.page', () => {
    const core = richCore();
    core.lineup = [
      { order: 1, start: asIsoUtc('2026-09-03T20:00:00Z'), end: asIsoUtc('2026-09-03T20:30:00Z'), performers: [], dancers: [] },
      { order: 2, start: asIsoUtc('2026-09-03T21:00:00Z'), end: asIsoUtc('2026-09-03T22:00:00Z'), performers: [], dancers: [] },
    ];
    core.hosts = [];
    core.dancers = [];
    expect(computeLoss(core, VRCTL_CAPS).approximated.some((e) => e.path === 'lineup')).toBe(true);
    expect(computeLoss(core, RAVEPAGE_CAPS).approximated.some((e) => e.path === 'lineup')).toBe(false);
  });
});
