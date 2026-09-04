// Pure form model bridging EventCore <-> the editor's input fields. Node/happy-dom
// testable: imports only core (pure) + shared types — never runtime/adapters/webext.
//
// Editable fields are projections of core; non-edited remainder (organizer name,
// vrchat anchor, hosts/dancers, secondary scene, extras) rides through verbatim so
// `toCore(fromCore(x))` is lossless. Instants are stored as event-zone local wall
// strings for the DateTimePicker; `source` keeps the original instants so an
// untouched time round-trips to the EXACT ISO (no millis/DST re-snapping).
import type {
  Audience,
  EventCore,
  Flags,
  IanaZone,
  IsoUtc,
  Links,
  Performer,
  PosterRef,
  Slot,
} from '../../core/schema';
import type { PlatformId } from '../../core/schema';
import { addMinutes, asIanaZone, isValidZone, toDatetimeLocal, zonedLocalToUtc } from '../../core/time';
import { validateEvent, type ValidationIssue } from '../../core/validate';
import { DEFAULT_SLOT_MINUTES } from './lineup-bridge';

export interface FormOrganizer {
  organizerType: string;
  organizerId: string;
}

// Instants captured at fromCore time; toCore reuses them when the wall string is
// unchanged so an untouched instant round-trips byte-for-byte.
interface FormSource {
  start?: IsoUtc;
  end?: IsoUtc;
  doorsOpen?: IsoUtc;
}

export interface EventForm {
  title: string;
  description?: string;
  zone: string; // IANA; may be invalid mid-edit (formIssues reports it)
  startLocal: string; // 'YYYY-MM-DDTHH:mm' event-zone wall (or '')
  endLocal: string;
  doorsLocal: string;
  flags: Flags;
  genres: string[];
  energy?: string;
  sceneType?: string;
  sceneTypeSecondary?: string;
  links: Links;
  audience: Audience;
  publish: boolean;
  lineup: Slot[];
  poster: PosterRef | null;
  organizerByPlatform: Partial<Record<PlatformId, FormOrganizer>>;
  // ---- passthrough (not directly edited; carried for lossless round-trip) ----
  organizerName: string;
  vrchatGroupId?: string;
  hosts: Performer[];
  dancers: Performer[];
  extras: Partial<Record<PlatformId, unknown>>;
  source: FormSource;
}

// Blank instant at the type boundary: an unset required start reads as an invalid
// instant so validateEvent flags it (Run stays disabled) rather than throwing.
const BLANK_INSTANT = '' as unknown as IsoUtc;

export function emptyForm(zone: string): EventForm {
  return {
    title: '',
    description: '',
    zone,
    startLocal: '',
    endLocal: '',
    doorsLocal: '',
    flags: {},
    genres: [],
    links: {},
    audience: 'unlisted',
    publish: false,
    lineup: [],
    poster: null,
    organizerByPlatform: {},
    organizerName: '',
    hosts: [],
    dancers: [],
    extras: {},
    source: {},
  };
}

function localOf(iso: IsoUtc | undefined, zone: string): string {
  return iso && isValidZone(zone) ? toDatetimeLocal(iso, zone) : '';
}

export function fromCore(core: EventCore): EventForm {
  const organizerByPlatform: Partial<Record<PlatformId, FormOrganizer>> = {};
  for (const [platform, id] of Object.entries(core.organizer.platformIds) as [PlatformId, string][]) {
    if (id) organizerByPlatform[platform] = { organizerType: '', organizerId: id };
  }
  return {
    title: core.title,
    description: core.description,
    zone: core.zone,
    startLocal: localOf(core.start, core.zone),
    endLocal: localOf(core.end, core.zone),
    doorsLocal: localOf(core.doorsOpen, core.zone),
    flags: { ...core.flags },
    genres: [...core.music.genres],
    energy: core.music.energy,
    sceneType: core.music.sceneType,
    sceneTypeSecondary: core.music.sceneTypeSecondary,
    links: { ...core.links },
    audience: core.visibility.audience,
    publish: core.visibility.publish,
    lineup: core.lineup,
    poster: core.poster ?? null,
    organizerByPlatform,
    organizerName: core.organizer.name,
    vrchatGroupId: core.organizer.vrchatGroupId,
    hosts: core.hosts,
    dancers: core.dancers,
    extras: core.extras,
    source: { start: core.start, end: core.end, doorsOpen: core.doorsOpen },
  };
}

// Local wall string -> instant, preferring the source instant when the wall time
// (in the current zone) is unchanged so an untouched value keeps its exact ISO.
function toInstant(local: string, zone: IanaZone, source?: IsoUtc): IsoUtc | undefined {
  if (!local) return undefined;
  if (source && toDatetimeLocal(source, zone) === local) return source;
  const [date, time] = local.split('T');
  return zonedLocalToUtc(date ?? '', time ?? '', zone);
}

// Requires `form.zone` to pass isValidZone (asIanaZone throws otherwise); callers
// gate on formIssues first.
export function toCore(form: EventForm): EventCore {
  const zone = asIanaZone(form.zone);
  const platformIds: Partial<Record<PlatformId, string>> = {};
  for (const [platform, org] of Object.entries(form.organizerByPlatform) as [PlatformId, FormOrganizer][]) {
    if (org.organizerId) platformIds[platform] = org.organizerId;
  }
  const start = toInstant(form.startLocal, zone, form.source.start) ?? BLANK_INSTANT;
  return {
    title: form.title,
    description: form.description,
    start,
    end: toInstant(form.endLocal, zone, form.source.end),
    doorsOpen: toInstant(form.doorsLocal, zone, form.source.doorsOpen),
    zone,
    organizer: { name: form.organizerName, vrchatGroupId: form.vrchatGroupId, platformIds },
    lineup: form.lineup,
    hosts: form.hosts,
    dancers: form.dancers,
    poster: form.poster ?? undefined,
    visibility: { publish: form.publish, audience: form.audience },
    flags: form.flags,
    music: {
      genres: form.genres,
      energy: form.energy,
      sceneType: form.sceneType,
      sceneTypeSecondary: form.sceneTypeSecondary,
    },
    links: form.links,
    extras: form.extras,
  };
}

// Same-zone local wall strings compare chronologically as plain strings.
function localAfter(a: string, b: string): boolean {
  return !!a && !!b && a > b;
}

// Instant comparison via epoch ms — precision-agnostic (mixed '…:00Z' / '…:00.000Z'
// never mis-order the way a lexical compare would).
function isoAfter(a: IsoUtc, b: IsoUtc): boolean {
  return Date.parse(a) > Date.parse(b);
}

export interface DeriveEndOpts {
  defaultDurationMin: number;
  // Edit mode: the source event's end. Kept unless the derived end is LATER, so a
  // grown lineup extends the event but a shrunk one never truncates it silently.
  sourceEnd?: IsoUtc;
}

// The event end the user no longer types. With a lineup: the latest slot end (a
// timed slot lacking an end is assumed DEFAULT_SLOT_MINUTES long). Without one:
// start + defaultDurationMin. Instant math (addMinutes) is DST-safe. Returns
// undefined when there is no start to anchor to (a blank required start).
export function deriveEnd(core: EventCore, opts: DeriveEndOpts): IsoUtc | undefined {
  let derived: IsoUtc | undefined;
  if (core.start) {
    if (core.lineup.length > 0) {
      for (const slot of core.lineup) {
        const slotEnd = slot.end ?? addMinutes(slot.start, DEFAULT_SLOT_MINUTES);
        if (derived === undefined || isoAfter(slotEnd, derived)) derived = slotEnd;
      }
    } else {
      derived = addMinutes(core.start, opts.defaultDurationMin);
    }
  }
  if (opts.sourceEnd !== undefined) {
    return derived !== undefined && isoAfter(derived, opts.sourceEnd) ? derived : opts.sourceEnd;
  }
  return derived;
}

// validateEvent(core) plus form-level checks that don't need a valid core:
// invalid zone, doors after start. The end is no longer a user field, so there is
// no form-field end check — validateEvent covers end-after-start on the derived
// core. With `opts`, validation runs against the derived end (deriveEnd) so an
// edit that moves the start never trips on a stale form end. Never throws.
export function formIssues(form: EventForm, opts?: DeriveEndOpts): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  if (!isValidZone(form.zone)) out.push({ path: 'zone', message: `invalid zone: ${form.zone}` });
  if (localAfter(form.doorsLocal, form.startLocal)) out.push({ path: 'doorsOpen', message: 'doors must be at or before start' });
  if (isValidZone(form.zone)) {
    const core = toCore(form);
    const validated = opts ? { ...core, end: deriveEnd(core, opts) } : core;
    for (const issue of validateEvent(validated)) {
      if (out.some((o) => o.path === issue.path && o.message === issue.message)) continue;
      out.push(issue);
    }
  }
  return out;
}
