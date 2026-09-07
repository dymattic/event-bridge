// vrc.tl DOM parsers. Pure string -> data; the ONLY DOM dependency is DOMParser
// (available in the dashboard page and under happy-dom in tests). No transport,
// no webext. Option ids/labels are scraped here and never hardcoded upstream.
import type {
  VrctlDetailForm,
  VrctlFlagCategory,
  VrctlFlagKind,
  VrctlOption,
  VrctlSlotForm,
} from '../../core/mapping/vrctl-types';
import { BridgeError } from '../../core/errors';
import {
  asDeleteAction,
  asEventId,
  asOrganizerId,
  type VrctlDeleteAction,
  type VrctlEventId,
  type VrctlOrganizerId,
} from './ids';

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

function parse(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

function collapse(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

// Direct text-node children only (skips nested <span>/<img>/<a>).
function directText(el: Element): string {
  let s = '';
  for (const n of Array.from(el.childNodes)) if (n.nodeType === TEXT_NODE) s += n.textContent ?? '';
  return collapse(s);
}

// First non-empty leading text of a <label> (the text before any nested element,
// e.g. "Example Club" ahead of the club-shortcode <a>).
function firstText(el: Element): string {
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === TEXT_NODE) {
      const t = collapse(n.textContent ?? '');
      if (t) return t;
    } else if (n.nodeType === ELEMENT_NODE) {
      break;
    }
  }
  return collapse(el.textContent ?? '');
}

function labelText(scope: ParentNode, input: Element): string {
  const id = input.getAttribute('id');
  if (id) {
    const lbl = scope.querySelector(`label[for="${cssEscape(id)}"]`);
    if (lbl) return firstText(lbl);
  }
  const parentLabel = input.closest('label');
  if (parentLabel) return collapse(parentLabel.textContent ?? '');
  return '';
}

// Minimal attribute-selector escaper (ids here are simple, but be safe).
function cssEscape(s: string): string {
  return s.replace(/["\\]/g, '\\$&');
}

function inputValue(el: Element | null): string {
  return el?.getAttribute('value') ?? '';
}

function selectedOptions(select: Element): VrctlOption[] {
  return Array.from(select.querySelectorAll('option'))
    .filter((o) => o.hasAttribute('selected'))
    .map((o) => ({ id: o.getAttribute('value') ?? '', label: collapse(o.textContent ?? '') }));
}

function allOptions(select: Element): VrctlOption[] {
  return Array.from(select.querySelectorAll('option')).map((o) => ({
    id: o.getAttribute('value') ?? '',
    label: collapse(o.textContent ?? ''),
  }));
}

// ---- detail form ----

const FLAG_RE = /^flags\[(\d+)\](\[\])?$/;
const SLOT_RE = /^slots\[(\d+)\]\[(\w+)\](\[\])?$/;

function parseFlagCategories(form: Element): {
  categories: Record<string, VrctlFlagCategory>;
  selected: Record<string, string[]>;
} {
  const controls = Array.from(form.querySelectorAll('input[name^="flags["], select[name^="flags["]'));
  const byKey = new Map<string, Element[]>();
  for (const el of controls) {
    const name = el.getAttribute('name') ?? '';
    const m = FLAG_RE.exec(name);
    if (!m || !m[1]) continue;
    const list = byKey.get(m[1]) ?? [];
    list.push(el);
    byKey.set(m[1], list);
  }

  const categories: Record<string, VrctlFlagCategory> = {};
  const selected: Record<string, string[]> = {};
  for (const [key, els] of byKey) {
    const select = els.find((e) => e.tagName === 'SELECT');
    let kind: VrctlFlagKind;
    let options: VrctlOption[];
    let sel: string[];
    if (select) {
      kind = 'multi';
      options = allOptions(select);
      sel = selectedOptions(select).map((o) => o.id);
    } else {
      const inputs = els.filter((e) => e.tagName === 'INPUT');
      const type = inputs[0]?.getAttribute('type');
      if (type === 'checkbox') {
        kind = 'checkbox';
        const box = inputs[0];
        options = box ? [{ id: box.getAttribute('value') || 'on', label: labelText(form, box) }] : [];
        sel = box?.hasAttribute('checked') ? [options[0]?.id ?? 'on'] : [];
      } else {
        kind = 'radio';
        options = inputs.map((i) => ({ id: i.getAttribute('value') ?? '', label: labelText(form, i) }));
        sel = inputs.filter((i) => i.hasAttribute('checked')).map((i) => i.getAttribute('value') ?? '');
      }
    }
    const name = accordionName(form, key) || options.find((o) => o.id)?.label || `flags[${key}]`;
    categories[key] = { key, name, kind, options };
    if (sel.length) selected[key] = sel;
  }
  return { categories, selected };
}

function accordionName(form: Element, key: string): string {
  const btn = form.querySelector(`[data-bs-target="#tagGroup_${key}"]`);
  return btn ? directText(btn) : '';
}

function parseSlots(form: Element): VrctlSlotForm[] {
  const order: string[] = [];
  const seen = new Set<string>();
  const controls = Array.from(form.querySelectorAll('[name^="slots["]'));
  for (const el of controls) {
    // Skip submit/button controls (addSlotBefore).
    const type = el.getAttribute('type');
    if (type === 'submit' || type === 'button') continue;
    const m = SLOT_RE.exec(el.getAttribute('name') ?? '');
    if (!m || !m[1]) continue;
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      order.push(m[1]);
    }
  }
  return order.map((id) => {
    const durEl = form.querySelector(`[name="slots[${id}][duration]"]`);
    const durStr = inputValue(durEl);
    const flagSel = form.querySelector(`select[name="slots[${id}][flag]"]`);
    const performersSel = form.querySelector(`select[name="slots[${id}][performers][]"]`);
    const publicNote = form.querySelector(`[name="slots[${id}][publicNote]"]`);
    const privateNote = form.querySelector(`[name="slots[${id}][privateNote]"]`);
    const slot: VrctlSlotForm = {
      id,
      performers: performersSel ? selectedOptions(performersSel) : [],
    };
    if (durStr && /^\d+$/.test(durStr)) slot.duration = Number(durStr);
    const flag = flagSel ? (selectedOptions(flagSel)[0]?.id ?? '') : '';
    if (flag) slot.flag = flag;
    if (publicNote) slot.publicNote = collapse(publicNote.textContent ?? '');
    if (privateNote) slot.privateNote = collapse(privateNote.textContent ?? '');
    return slot;
  });
}

export function parseDetailForm(html: string): VrctlDetailForm {
  const doc = parse(html);
  const form = doc.querySelector('form#frm-form-form') ?? doc.querySelector('form');
  if (!form) throw new BridgeError('PARSE', 'vrc.tl detail form not found');

  const organizersSel = form.querySelector('select[name="organizers[]"]');
  const organizerOptions = organizersSel ? allOptions(organizersSel) : [];
  const selectedOrganizerIds = organizersSel ? selectedOptions(organizersSel).map((o) => o.id) : [];

  const tzSel = form.querySelector('select[name="timezone"]');
  const timezoneOptions = tzSel
    ? allOptions(tzSel)
        .map((o) => o.id)
        .filter((v) => v !== '')
    : [];
  const tzSelected = tzSel ? (selectedOptions(tzSel)[0]?.id ?? undefined) : undefined;

  const howToJoinInputs = Array.from(form.querySelectorAll('input[name="howToJoin"]'));
  const howToJoinOptions: VrctlOption[] = howToJoinInputs.map((i) => ({
    id: i.getAttribute('value') ?? '',
    label: labelText(form, i),
  }));
  const selectedHowToJoin = howToJoinInputs.find((i) => i.hasAttribute('checked'))?.getAttribute('value') ?? undefined;

  const { categories, selected } = parseFlagCategories(form);
  const slots = parseSlots(form);

  const openStr = inputValue(form.querySelector('[name="instanceOpenMinutesBeforeStart"]'));
  const posterTypeInput = Array.from(form.querySelectorAll('input[name="posterType"]')).find((i) => i.hasAttribute('checked'));

  const current: VrctlDetailForm['current'] = {
    name: inputValue(form.querySelector('input[name="name"]')),
    description: collapse(form.querySelector('textarea[name="description"]')?.textContent ?? ''),
    start: inputValue(form.querySelector('input[name="start"]')),
    url: inputValue(form.querySelector('input[name="url"]')),
    showSlots: form.querySelector('input[name="showSlots"]')?.hasAttribute('checked') ?? false,
    published: form.querySelector('input[name="published"]')?.hasAttribute('checked') ?? false,
    posterUrl: inputValue(form.querySelector('input[name="posterUrl"]')),
  };
  if (tzSelected !== undefined) current.timezone = tzSelected;
  if (openStr && /^\d+$/.test(openStr)) current.instanceOpenMinutesBeforeStart = Number(openStr);
  if (posterTypeInput) current.posterType = posterTypeInput.getAttribute('value') ?? undefined;

  const out: VrctlDetailForm = {
    actionUrl: form.getAttribute('action') ?? '',
    doValue: inputValue(form.querySelector('input[name="_do"]')) || 'form-form-submit',
    organizerOptions,
    selectedOrganizerIds,
    timezoneOptions,
    howToJoinOptions,
    flagCategories: categories,
    selectedFlags: selected,
    slots,
    current,
  };
  if (selectedHowToJoin !== undefined) out.selectedHowToJoin = selectedHowToJoin;
  return out;
}

// ---- choose-organizer (own clubs) ----

export interface VrctlOrganizer {
  organizerId: VrctlOrganizerId;
  name: string;
  vrchatGroupId?: string; // grp_<uuid>, only if the markup exposes it (it usually doesn't here)
}

const GRP_RE = /grp_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export function parseChooseOrganizer(html: string): VrctlOrganizer[] {
  const doc = parse(html);
  const select = doc.querySelector('select[name="organizer"], select[name="organizers[]"]');
  const out: VrctlOrganizer[] = [];
  if (select) {
    for (const opt of Array.from(select.querySelectorAll('option'))) {
      const v = opt.getAttribute('value') ?? '';
      if (!/^\d+$/.test(v)) continue;
      const org: VrctlOrganizer = { organizerId: asOrganizerId(v), name: collapse(opt.textContent ?? '') };
      const grp = GRP_RE.exec(html);
      if (grp) org.vrchatGroupId = grp[0];
      out.push(org);
    }
  }
  return out;
}

// ---- choose-category (category x promoted/not; the create-URL pattern) ----

export interface VrctlCategory {
  categoryId: string;
  name: string;
  promoted: boolean;
  createPath: string; // same-origin path incl. query
}

export function parseChooseCategory(html: string): VrctlCategory[] {
  const doc = parse(html);
  const links = Array.from(doc.querySelectorAll('a[href*="/admin/event/create"]'));
  const out: VrctlCategory[] = [];
  const seen = new Set<string>();
  for (const a of links) {
    const href = a.getAttribute('href') ?? '';
    let url: URL;
    try {
      url = new URL(href, 'https://vrc.tl');
    } catch {
      continue;
    }
    const categoryId = url.searchParams.get('categoryId') ?? '';
    if (!/^\d+$/.test(categoryId)) continue;
    const promoted = url.searchParams.get('promoted') !== '0';
    const dedup = `${categoryId}:${promoted ? '1' : '0'}`;
    if (seen.has(dedup)) continue;
    seen.add(dedup);
    const card = a.closest('.card') ?? a.closest('.card-body') ?? a.parentElement;
    const name = card ? collapse(card.querySelector('.card-title, h3')?.textContent ?? '') : '';
    out.push({ categoryId, name, promoted, createPath: `${url.pathname}${url.search}` });
  }
  return out;
}

// ---- admin/event grid ----

export interface VrctlGridRow {
  eventId: VrctlEventId;
  name: string;
  start: string;
  end?: string;
  organizerName?: string;
  organizerId?: VrctlOrganizerId;
  promoted?: boolean;
  published?: boolean; // not exposed by the grid; always undefined today
  deleteAction?: VrctlDeleteAction; // present only when the user may delete (own event)
  detailPath?: string;
}

export function parseGrid(html: string): VrctlGridRow[] {
  const doc = parse(html);
  const rows = Array.from(doc.querySelectorAll('tr[data-id]'));
  const out: VrctlGridRow[] = [];
  for (const tr of rows) {
    const rawId = tr.getAttribute('data-id') ?? '';
    if (!/^\d+$/.test(rawId)) continue;
    const nameLink = tr.querySelector('.col-name a, .grid-main-link a');
    const name = nameLink?.getAttribute('title') ?? collapse(nameLink?.textContent ?? '');
    const startCell = tr.querySelector('.col-start');
    const endCell = tr.querySelector('.col-end');
    const orgLink = tr.querySelector('.col-eventOrganizers a');
    const promotedCell = tr.querySelector('.col-promoted');

    const row: VrctlGridRow = {
      eventId: asEventId(rawId),
      name,
      start: startCell ? directText(startCell) : '',
    };
    if (endCell) row.end = directText(endCell);
    if (orgLink) {
      row.organizerName = orgLink.getAttribute('title') ?? collapse(orgLink.textContent ?? '');
      const om = /\/admin\/organizer\/detail\/(\d+)/.exec(orgLink.getAttribute('href') ?? '');
      if (om?.[1]) row.organizerId = asOrganizerId(om[1]);
    }
    if (promotedCell) {
      const t = collapse(promotedCell.textContent ?? '').toLowerCase();
      if (t.includes('yes')) row.promoted = true;
      else if (t.includes('no')) row.promoted = false;
    }
    const del = tr.querySelector('.col-action a[href*="grid-grid-__key=delete"]');
    if (del) {
      try {
        row.deleteAction = asDeleteAction(del.getAttribute('href') ?? '');
      } catch {
        // malformed action -> leave undefined (never delete on a bad URL)
      }
    }
    const detail = tr.querySelector('a[href^="/admin/event/detail/"]');
    if (detail) row.detailPath = detail.getAttribute('href') ?? undefined;
    out.push(row);
  }
  return out;
}

// Grid start/end cells render "YYYY-MM-DD HH:MM" in the event's own timezone (no
// offset), so a browser-local parse is an APPROXIMATION — fine for listing +
// upcoming filtering; the exact instant comes from the detail form. Returns an
// ISO instant, or undefined when the label doesn't parse (never NaN).
export function parseGridDate(label: string): string | undefined {
  const t = label.trim();
  if (!t) return undefined;
  const ms = Date.parse(t.replace(' ', 'T'));
  return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
}

// ---- performer autocomplete (select2 JSON) ----

export interface VrctlPerformer {
  id: string;
  text: string;
}

export function parsePerformerSearch(jsonText: string): VrctlPerformer[] {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new BridgeError('PARSE', 'performer search: invalid JSON');
  }
  const results = (data as { results?: unknown }).results;
  if (!Array.isArray(results)) throw new BridgeError('PARSE', 'performer search: missing results');
  return results
    .filter((r): r is { id: unknown; text: unknown } => typeof r === 'object' && r !== null)
    .map((r) => ({ id: String((r as { id: unknown }).id), text: String((r as { text: unknown }).text) }));
}

// ---- public timeline (GET /api/v1/events) ----

// One public event from the timeline, reduced to what "My gigs" needs. Times are
// ISO-Z strings (the adapter brands them). `slots` is empty when the event hides
// its lineup publicly (showSlots:false) — the own-club scan covers those.
export interface VrctlTimelineEvent {
  id: string;
  name: string;
  start: string; // ISO Z
  end?: string; // ISO Z
  organizerName?: string;
  promoted: boolean;
  slots: { start: string; end: string; performerNames: string[] }[];
}

export interface VrctlTimelinePage {
  days: string[]; // lastUpdates[].day, 'YYYY-MM-DD'
  events: VrctlTimelineEvent[];
}

// unix seconds -> ISO-Z with the '.000' millis dropped.
function isoZ(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function numberMap(rows: unknown, valueKey: string): Map<number, string> {
  const m = new Map<number, string>();
  if (!Array.isArray(rows)) return m;
  for (const r of rows) {
    if (r && typeof r === 'object') {
      const id = (r as Record<string, unknown>).id;
      const v = (r as Record<string, unknown>)[valueKey];
      if (typeof id === 'number' && typeof v === 'string') m.set(id, v);
    }
  }
  return m;
}

// Parse the vrc.tl timeline JSON (same payload the web app pages through).
// Resolves performerId/organizer ids to names via the response's own tables;
// unknown performer ids are skipped, hidden performers are kept (the user may be
// one). Malformed payload/event -> PARSE.
export function parseTimeline(jsonText: string): VrctlTimelinePage {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new BridgeError('PARSE', 'timeline: invalid JSON');
  }
  if (typeof data !== 'object' || data === null) throw new BridgeError('PARSE', 'timeline: not an object');
  const root = data as Record<string, unknown>;
  const eventData = root.eventData;
  if (!Array.isArray(root.lastUpdates) || typeof eventData !== 'object' || eventData === null) {
    throw new BridgeError('PARSE', 'timeline: missing lastUpdates/eventData');
  }
  const days: string[] = [];
  for (const u of root.lastUpdates) {
    if (u && typeof u === 'object' && typeof (u as Record<string, unknown>).day === 'string') {
      days.push((u as { day: string }).day);
    }
  }
  const ed = eventData as Record<string, unknown>;
  const performerName = numberMap(ed.performers, 'name');
  const organizerName = numberMap(ed.organizers, 'name');

  const events: VrctlTimelineEvent[] = [];
  for (const e of Array.isArray(ed.events) ? ed.events : []) {
    if (!e || typeof e !== 'object') continue;
    const ev = e as Record<string, unknown>;
    if (typeof ev.id !== 'number' || typeof ev.start !== 'number') {
      throw new BridgeError('PARSE', 'timeline: malformed event');
    }
    const out: VrctlTimelineEvent = { id: String(ev.id), name: typeof ev.name === 'string' ? ev.name : '', start: isoZ(ev.start), promoted: ev.promoted === true, slots: [] };
    if (typeof ev.end === 'number' && ev.end > 0) out.end = isoZ(ev.end);

    let org: string | undefined;
    if (typeof ev.hostOrganizer === 'number') org = organizerName.get(ev.hostOrganizer);
    if (org === undefined && Array.isArray(ev.organizers)) {
      for (const oid of ev.organizers) {
        if (typeof oid === 'number') {
          const n = organizerName.get(oid);
          if (n !== undefined) {
            org = n;
            break;
          }
        }
      }
    }
    if (org !== undefined) out.organizerName = org;

    // showSlots:false hides the lineup from the public listing; skip its slots.
    if (ev.showSlots !== false && Array.isArray(ev.eventSlots)) {
      for (const s of ev.eventSlots) {
        if (!s || typeof s !== 'object') continue;
        const sl = s as Record<string, unknown>;
        if (typeof sl.start !== 'number') continue;
        const names: string[] = [];
        for (const p of Array.isArray(sl.performers) ? sl.performers : []) {
          if (p && typeof p === 'object') {
            const pid = (p as Record<string, unknown>).performerId;
            if (typeof pid === 'number') {
              const n = performerName.get(pid);
              if (n !== undefined) names.push(n);
            }
          }
        }
        const end = typeof sl.duration === 'number' ? sl.start + sl.duration : sl.start;
        out.slots.push({ start: isoZ(sl.start), end: isoZ(end), performerNames: names });
      }
    }
    events.push(out);
  }
  return { days, events };
}

// ---- error / auth detection ----

// Nette + Bootstrap validation markers relied on. `.text-danger` is deliberately
// NOT matched (used decoratively in the success form). See docs/platforms/vrctl.md;
// the exact server-side markers are an open item for a read-only manual check.
export function detectNetteError(html: string): string | null {
  const doc = parse(html);
  const nodes = Array.from(
    doc.querySelectorAll('.alert-danger, .invalid-feedback, ul.error li, .error[data-nette-error], [data-nette-error]'),
  );
  const parts: string[] = [];
  for (const n of nodes) {
    const t = collapse(n.textContent ?? '');
    if (t && !parts.includes(t)) parts.push(t);
  }
  return parts.length ? parts.join(' | ') : null;
}

// Logged out = a followed request bounced outside /admin/ (real site 302 ->
// /sign/in) OR the returned page is itself the sign-in page (body marker, robust
// when the transport can't surface the redirect).
export function isSignInRedirect(result: { finalUrl: string; status: number; body?: string | null }): boolean {
  if (result.finalUrl) {
    try {
      const path = new URL(result.finalUrl).pathname;
      if (!path.startsWith('/admin')) return true;
    } catch {
      // fall through to body check
    }
  }
  return !!result.body && /\/sign\/in/.test(result.body);
}
