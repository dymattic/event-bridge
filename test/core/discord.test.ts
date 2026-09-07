import { describe, expect, it } from 'vitest';
import {
  discordTs,
  escapeMd,
  renderAnnouncement,
  DEFAULT_PRESETS,
  PLACEHOLDER_HELP,
  type AnnouncePreset,
  type AnnounceContext,
  type DiscordTsStyle,
} from '../../src/core/discord';
import { asIsoUtc, asIanaZone } from '../../src/core/time';
import type { EventCore, Performer } from '../../src/core/schema';

const iso = (s: string) => asIsoUtc(s);
const U = (s: string) => Math.floor(Date.parse(s) / 1000);
const perf = (name: string): Performer => ({ name, aliases: [] });
const preset = (id: string) => DEFAULT_PRESETS.find((p) => p.id === id)!;

const S = '2026-09-10T20:00:00Z';
const E = '2026-09-10T23:30:00Z';
const S1 = '2026-09-10T20:00:00Z';
const E1 = '2026-09-10T21:30:00Z';
const S2 = '2026-09-10T21:30:00Z';
const E2 = '2026-09-10T23:00:00Z';

const core: EventCore = {
  title: 'Neon Rave',
  start: iso(S),
  end: iso(E),
  zone: asIanaZone('Europe/Berlin'),
  organizer: { name: 'Club A', platformIds: {} },
  lineup: [
    { order: 1, start: iso(S1), end: iso(E1), performers: [perf('Dy-Mattic'), perf('K3N')], dancers: [] }, // B2B
    { order: 2, start: iso(S2), end: iso(E2), performers: [perf('Solo')], vj: perf('VeeJay'), dancers: [] }, // VJ
  ],
  hosts: [],
  dancers: [],
  visibility: { publish: true, audience: 'public' },
  flags: {},
  music: { genres: ['Techno', 'Trance'] },
  links: {},
  extras: {},
};
const links: AnnounceContext['links'] = [
  { platform: 'vrctl', url: 'https://vrc.tl/event/1', label: 'vrc.tl' },
  { platform: 'vrcpop', url: 'https://vrcpop.com/event/2', label: 'vrcpop.com' },
];
const ctx: AnnounceContext = { core, links };
const LINKS_MD = '[vrc.tl](https://vrc.tl/event/1) · [vrcpop.com](https://vrcpop.com/event/2)';

describe('discordTs', () => {
  it('renders each style', () => {
    const styles: DiscordTsStyle[] = ['t', 'T', 'd', 'D', 'f', 'F', 'R'];
    for (const s of styles) expect(discordTs('2025-09-07T12:00:00Z', s)).toBe(`<t:1757246400:${s}>`);
  });
  it('undefined / invalid -> TBA', () => {
    expect(discordTs(undefined, 'F')).toBe('TBA');
    expect(discordTs('not-a-date', 'F')).toBe('TBA');
  });
});

describe('escapeMd', () => {
  it('escapes inline specials but keeps URLs intact', () => {
    expect(escapeMd('check http://x.com/a_b*c and _foo_ *bar* > q')).toBe(
      'check http://x.com/a_b*c and \\_foo\\_ \\*bar\\* \\> q',
    );
  });
  it('escapes leading #, - and > at line start', () => {
    expect(escapeMd('# head\n- item\n> quote')).toBe('\\# head\n\\- item\n\\> quote');
  });
});

describe('renderAnnouncement — built-in goldens', () => {
  it('classic (B2B + VJ, 2 platforms)', () => {
    const expected =
      `🎵 **Neon Rave**\n📅 <t:${U(S)}:F> → <t:${U(E)}:t>\n📍 Club A\n\n**LINEUP**\n` +
      `1. <t:${U(S1)}:t> → <t:${U(E1)}:t> · 1h 30m · Dy-Mattic & K3N\n` +
      `2. <t:${U(S2)}:t> → <t:${U(E2)}:t> · 1h 30m · Solo\n\n` +
      LINKS_MD;
    expect(renderAnnouncement(preset('builtin:classic'), ctx)).toBe(expected);
  });
  it('compact', () => {
    const expected =
      `**Neon Rave** · <t:${U(S)}:f> (<t:${U(S)}:R>)\n` +
      `• <t:${U(S1)}:t> Dy-Mattic & K3N\n• <t:${U(S2)}:t> Solo\n` +
      LINKS_MD;
    expect(renderAnnouncement(preset('builtin:compact'), ctx)).toBe(expected);
  });
  it('countdown', () => {
    const expected =
      `⏰ **Neon Rave** starts <t:${U(S)}:R> — <t:${U(S)}:F>\n` +
      `<t:${U(S1)}:t>–<t:${U(E1)}:t> Dy-Mattic & K3N\n` +
      `<t:${U(S2)}:t>–<t:${U(E2)}:t> Solo\n\n` +
      LINKS_MD;
    expect(renderAnnouncement(preset('builtin:countdown'), ctx)).toBe(expected);
  });
});

describe('renderAnnouncement — template semantics', () => {
  const mk = (o: Partial<AnnouncePreset>): AnnouncePreset => ({
    id: 'x', name: 'x', header: '', slotLine: '', footer: '', emptyLineup: '', createdAt: '', updatedAt: '', ...o,
  });

  it('markdown-escapes values by default; !raw skips escaping', () => {
    const c: AnnounceContext = { core: { ...core, title: '*Wild* _Night_' }, links };
    expect(renderAnnouncement(mk({ header: '{title}' }), c)).toBe('\\*Wild\\* \\_Night\\_');
    expect(renderAnnouncement(mk({ header: '{title!raw}' }), c)).toBe('*Wild* _Night_');
  });
  it('unknown tokens render empty', () => {
    expect(renderAnnouncement(mk({ header: 'a{nope}b{also:X}c' }), ctx)).toBe('abc');
  });
  it('slot time vars default to style t; {end} missing -> TBA', () => {
    const c: AnnounceContext = {
      core: { ...core, lineup: [{ order: 1, start: iso(S1), performers: [perf('Solo')], dancers: [] }] },
      links,
    };
    expect(renderAnnouncement(mk({ header: 'H', slotLine: '{start} {end}' }), c)).toBe(`H\n<t:${U(S1)}:t> TBA`);
  });
  it('empty lineup uses emptyLineup text', () => {
    const c: AnnounceContext = { core: { ...core, lineup: [] }, links };
    const out = renderAnnouncement(preset('builtin:classic'), c);
    expect(out).toContain('**LINEUP**\nNo performer slots set yet.\n');
    expect(out).not.toContain('1. ');
  });
  it('event vars: links, per-platform link, genres, count, duration', () => {
    expect(renderAnnouncement(mk({ header: '{links}' }), ctx)).toBe(LINKS_MD);
    expect(renderAnnouncement(mk({ header: '{link:vrctl}' }), ctx)).toBe('https://vrc.tl/event/1');
    expect(renderAnnouncement(mk({ header: '{link:ravepage}' }), ctx)).toBe(''); // absent
    expect(renderAnnouncement(mk({ header: '{genres} {count} {duration}' }), ctx)).toBe('Techno, Trance 2 3h 30m');
  });
  it('trims only trailing whitespace', () => {
    expect(renderAnnouncement(mk({ header: '  keep-lead', footer: '' }), { core: { ...core, lineup: [] }, links })).toBe('  keep-lead');
  });
});

describe('lineup placement', () => {
  const base = preset('builtin:compact');
  it('auto-inserts the lineup block between header and footer by default', () => {
    const out = renderAnnouncement(base, ctx);
    const lines = out.split('\n');
    expect(lines[0]).toContain('Neon Rave');
    expect(lines[1]).toContain('Dy-Mattic & K3N');
    expect(lines[lines.length - 1]).toBe(LINKS_MD);
  });
  it('renders the lineup only where the author placed {lineup}', () => {
    const p: AnnouncePreset = { ...base, id: 'u1', builtin: false, header: '{links}\n{lineup}\n**{title}**', footer: '' };
    const out = renderAnnouncement(p, ctx);
    expect(out.split('\n').filter((l) => l.includes('Dy-Mattic & K3N'))).toHaveLength(1);
    expect(out.startsWith(LINKS_MD)).toBe(true);
    expect(out.endsWith('**Neon Rave**')).toBe(true);
  });
});

describe('DEFAULT_PRESETS / PLACEHOLDER_HELP', () => {
  it('exposes 3 built-ins with fixed timestamps', () => {
    expect(DEFAULT_PRESETS.map((p) => p.id)).toEqual(['builtin:classic', 'builtin:compact', 'builtin:countdown']);
    for (const p of DEFAULT_PRESETS) {
      expect(p.builtin).toBe(true);
      expect(p.createdAt).toBe('2026-09-07T00:00:00Z');
      expect(p.updatedAt).toBe('2026-09-07T00:00:00Z');
    }
  });
  it('help entries are scoped', () => {
    expect(PLACEHOLDER_HELP.some((h) => h.token === '{title}' && h.scope === 'event')).toBe(true);
    expect(PLACEHOLDER_HELP.some((h) => h.token === '{n}' && h.scope === 'slot')).toBe(true);
  });
});
