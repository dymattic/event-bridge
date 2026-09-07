// Discord announcement renderer: template-driven `<t:unix:STYLE>` posts with
// lineup + platform links. PURE (schema + gigs helper only). Views own preset
// storage; this module renders a preset against an EventCore.
import type { EventCore, Slot, PlatformId } from './schema';
import { fmtDurationMin } from './gigs';

export type DiscordTsStyle = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';

const TS_STYLES = new Set<string>(['t', 'T', 'd', 'D', 'f', 'F', 'R']);

// '<t:1757246400:F>'; undefined/invalid -> 'TBA'.
export function discordTs(iso: string | undefined, style: DiscordTsStyle): string {
  if (!iso) return 'TBA';
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return 'TBA';
  return `<t:${Math.floor(ms / 1000)}:${style}>`;
}

const URL_RE = /https?:\/\/[^\s]+/g;

function escapeChunk(s: string): string {
  return s
    .replace(/([\\*_~`|>])/g, '\\$1') // inline specials (incl. line-start '>')
    .replace(/(^|\n)([#-])/g, '$1\\$2'); // '#'/'-' only at line start
}

// Markdown-escape, keeping http(s) URL tokens intact.
export function escapeMd(s: string): string {
  let out = '';
  let last = 0;
  for (const m of s.matchAll(URL_RE)) {
    const i = m.index;
    out += escapeChunk(s.slice(last, i)) + m[0];
    last = i + m[0].length;
  }
  return out + escapeChunk(s.slice(last));
}

export interface AnnouncePreset {
  id: string; // 'builtin:classic' | 'builtin:compact' | 'builtin:countdown' | user uuid
  name: string;
  builtin?: boolean;
  header: string; // template
  slotLine: string; // template rendered once per slot; joined by '\n'
  footer: string; // template
  emptyLineup: string; // used instead of slot lines when the lineup is empty
  createdAt: string;
  updatedAt: string; // ISO
}

export interface AnnounceLink {
  platform: PlatformId;
  url: string;
  label: string; // platform display name
}

export interface AnnounceContext {
  core: EventCore;
  links: AnnounceLink[]; // public URLs, PLATFORM_ORDER
  now?: Date; // for tests
}

type Resolved = { value: string; time?: boolean; raw?: boolean } | null;
type Resolver = (name: string, style: string | undefined) => Resolved;

const TOKEN_RE = /\{([^}]*)\}/g;

interface Token {
  name: string;
  style: string | undefined;
  raw: boolean;
}

function parseToken(inner: string): Token {
  let raw = false;
  let body = inner;
  if (body.endsWith('!raw')) {
    raw = true;
    body = body.slice(0, -4);
  }
  let name = body;
  let style: string | undefined;
  if (!body.startsWith('link:')) {
    const ci = body.indexOf(':');
    if (ci >= 0) {
      name = body.slice(0, ci);
      style = body.slice(ci + 1);
    }
  }
  return { name, style, raw };
}

function tsStyle(style: string | undefined, def: DiscordTsStyle): DiscordTsStyle {
  return style && TS_STYLES.has(style) ? (style as DiscordTsStyle) : def;
}

function renderTemplate(tpl: string, resolve: Resolver): string {
  return tpl.replace(TOKEN_RE, (_full, inner: string) => {
    const t = parseToken(inner);
    const r = resolve(t.name, t.style);
    if (r === null) return ''; // unknown token
    if (r.time) return r.value; // timestamps are safe, never escaped
    if (t.raw || r.raw) return r.value;
    return escapeMd(r.value);
  });
}

function durationBetween(start: string, end: string | undefined): string {
  if (!end) return '';
  const a = Date.parse(start);
  const b = Date.parse(end);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
  return fmtDurationMin((b - a) / 60_000);
}

function slotResolver(slot: Slot, n: number): Resolver {
  return (name, style) => {
    switch (name) {
      case 'n':
        return { value: String(n) };
      case 'performers':
        return { value: slot.performers.map((p) => p.name).join(' & ') };
      case 'vj':
        return { value: slot.vj?.name ?? '' };
      case 'start':
        return { value: discordTs(slot.start, tsStyle(style, 't')), time: true };
      case 'end':
        return { value: discordTs(slot.end, tsStyle(style, 't')), time: true };
      case 'duration':
        return { value: durationBetween(slot.start, slot.end) };
      case 'genre':
        return { value: slot.genre ?? '' };
      case 'energy':
        return { value: slot.energy ?? '' };
      case 'title':
        return { value: slot.title ?? '' };
      case 'note':
        return { value: slot.publicNote ?? '' };
      default:
        return null;
    }
  };
}

function renderLineup(preset: AnnouncePreset, core: EventCore): string {
  if (core.lineup.length === 0) return preset.emptyLineup;
  return core.lineup.map((s, i) => renderTemplate(preset.slotLine, slotResolver(s, i + 1))).join('\n');
}

function eventResolver(ctx: AnnounceContext, lineupBlock: string): Resolver {
  const { core, links } = ctx;
  const linkFor = (p: string): string => links.find((l) => l.platform === p)?.url ?? '';
  return (name, style) => {
    switch (name) {
      case 'title':
        return { value: core.title };
      case 'description':
        return { value: core.description ?? '' };
      case 'club':
        return { value: core.organizer.name };
      case 'start':
        return { value: discordTs(core.start, tsStyle(style, 'F')), time: true };
      case 'end':
        return { value: discordTs(core.end, tsStyle(style, 'F')), time: true };
      case 'doors':
        return { value: discordTs(core.doorsOpen, tsStyle(style, 'F')), time: true };
      case 'duration':
        return { value: durationBetween(core.start, core.end) };
      case 'genres':
        return { value: core.music.genres.join(', ') };
      case 'links':
        return { value: links.map((l) => `[${l.label}](${l.url})`).join(' · ') };
      case 'lineup':
        return { value: lineupBlock, raw: true }; // already per-slot escaped
      case 'count':
        return { value: String(core.lineup.length) };
      default:
        if (name.startsWith('link:')) return { value: linkFor(name.slice(5)) };
        return null;
    }
  };
}

export function renderAnnouncement(preset: AnnouncePreset, ctx: AnnounceContext): string {
  const lineupBlock = renderLineup(preset, ctx.core);
  const resolve = eventResolver(ctx, lineupBlock);
  // Lineup block sits between header and footer unless the author placed
  // `{lineup}` themselves - then it renders only where they put it.
  const placed = preset.header.includes('{lineup}') || preset.footer.includes('{lineup}');
  const parts = [renderTemplate(preset.header, resolve)];
  if (!placed) parts.push(lineupBlock);
  parts.push(renderTemplate(preset.footer, resolve));
  return parts.join('\n').replace(/\s+$/, ''); // trim trailing whitespace only
}

const FIXED = '2026-09-07T00:00:00Z';

export const DEFAULT_PRESETS: readonly AnnouncePreset[] = [
  {
    id: 'builtin:classic',
    name: 'Classic',
    builtin: true,
    header: '🎵 **{title}**\n📅 {start:F} → {end:t}\n📍 {club}\n\n**LINEUP**',
    slotLine: '{n}. {start:t} → {end:t} · {duration} · {performers}',
    footer: '\n{links}',
    emptyLineup: 'No performer slots set yet.',
    createdAt: FIXED,
    updatedAt: FIXED,
  },
  {
    id: 'builtin:compact',
    name: 'Compact',
    builtin: true,
    header: '**{title}** · {start:f} ({start:R})',
    slotLine: '• {start:t} {performers}',
    footer: '{links}',
    emptyLineup: 'Lineup TBA',
    createdAt: FIXED,
    updatedAt: FIXED,
  },
  {
    id: 'builtin:countdown',
    name: 'Countdown',
    builtin: true,
    header: '⏰ **{title}** starts {start:R} — {start:F}',
    slotLine: '{start:t}–{end:t} {performers}',
    footer: '\n{links}',
    emptyLineup: '',
    createdAt: FIXED,
    updatedAt: FIXED,
  },
];

export const PLACEHOLDER_HELP: readonly { token: string; description: string; scope: 'event' | 'slot' }[] = [
  { token: '{title}', description: 'Event title', scope: 'event' },
  { token: '{description}', description: 'Event description', scope: 'event' },
  { token: '{club}', description: 'Organizer/club name', scope: 'event' },
  { token: '{start:STYLE}', description: 'Event start timestamp (default F)', scope: 'event' },
  { token: '{end:STYLE}', description: 'Event end timestamp (default F)', scope: 'event' },
  { token: '{doors:STYLE}', description: 'Doors-open timestamp (default F)', scope: 'event' },
  { token: '{duration}', description: 'Event duration, e.g. 3h 30m', scope: 'event' },
  { token: '{genres}', description: 'Genres, comma-joined', scope: 'event' },
  { token: '{links}', description: 'All platform links as [label](url)', scope: 'event' },
  { token: '{link:vrctl}', description: 'vrc.tl public URL (or empty)', scope: 'event' },
  { token: '{link:vrcpop}', description: 'vrcpop.com public URL (or empty)', scope: 'event' },
  { token: '{link:ravepage}', description: 'rave.page public URL (or empty)', scope: 'event' },
  { token: '{lineup}', description: 'Rendered slot lines or the empty-lineup text', scope: 'event' },
  { token: '{count}', description: 'Slot count', scope: 'event' },
  { token: '{n}', description: 'Slot number (1-based)', scope: 'slot' },
  { token: '{performers}', description: 'Slot performers, & -joined', scope: 'slot' },
  { token: '{vj}', description: 'Slot VJ name', scope: 'slot' },
  { token: '{start:STYLE}', description: 'Slot start timestamp (default t)', scope: 'slot' },
  { token: '{end:STYLE}', description: 'Slot end timestamp (default t)', scope: 'slot' },
  { token: '{duration}', description: 'Slot duration', scope: 'slot' },
  { token: '{genre}', description: 'Slot genre', scope: 'slot' },
  { token: '{energy}', description: 'Slot energy', scope: 'slot' },
  { token: '{title}', description: 'Slot title', scope: 'slot' },
  { token: '{note}', description: 'Slot public note', scope: 'slot' },
];
