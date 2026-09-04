import { describe, expect, it } from 'vitest';
import { asIanaZone, asIsoUtc } from '../../src/core/time';
import type { EventCore, Performer } from '../../src/core/schema';
import { CAPS, computeLoss, RAVEPAGE_CAPS, VRCPOP_CAPS, VRCTL_CAPS } from '../../src/core/capabilities';

const START = asIsoUtc('2030-01-05T22:00:00.000Z');
function dj(name: string, id?: string): Performer {
  return { name, aliases: id ? [{ platform: 'vrctl', id, name }] : [] };
}
function core(performers: Performer[]): EventCore {
  return {
    title: 'x',
    start: START,
    zone: asIanaZone('UTC'),
    organizer: { name: '', platformIds: {} },
    lineup: [{ order: 1, start: START, performers, dancers: [] }],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'unlisted' },
    flags: { nsfw: false },
    music: { genres: [] },
    links: {},
    extras: {},
  };
}

describe('performerIds capability', () => {
  it('vrc.tl requires ids; vrcpop/rave.page are optional', () => {
    expect(VRCTL_CAPS.performerIds).toBe('required');
    expect(VRCPOP_CAPS.performerIds).toBe('optional');
    expect(RAVEPAGE_CAPS.performerIds).toBe('optional');
  });

  it('computeLoss flags a free-text performer as required on vrc.tl', () => {
    const loss = computeLoss(core([dj('Example DJ')]), CAPS.vrctl);
    expect(loss.required.map((r) => r.path)).toContain('lineup.0.performers.0');
    expect(loss.required.find((r) => r.path === 'lineup.0.performers.0')?.reason).toMatch(/known performer/);
  });

  it('a performer WITH a vrc.tl alias id is not required', () => {
    const loss = computeLoss(core([dj('Example DJ', '300001')]), CAPS.vrctl);
    expect(loss.required.some((r) => r.path.startsWith('lineup.0.performers'))).toBe(false);
  });

  it('optional platforms never flag a free-text performer', () => {
    expect(computeLoss(core([dj('Example DJ')]), CAPS.vrcpop).required.some((r) => r.path.includes('performers'))).toBe(false);
    expect(computeLoss(core([dj('Example DJ')]), CAPS.ravepage).required.some((r) => r.path.includes('performers'))).toBe(false);
  });
});
