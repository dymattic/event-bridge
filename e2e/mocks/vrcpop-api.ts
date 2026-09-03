// vrcpop mock site for e2e. Routes https://vrcpop.com/** to self-authored,
// sanitized responses and records write bodies on a shared recorder. Serves the
// dashboard (inline window.vrcpop.user + CSRF meta + club card), the manage
// events list (with a draft card + MANAGE_DATA), the edit page (data-event with
// the CURRENT version), lineup/vocab/performer JSON, and the write handlers
// (create/update/delete/upload-flyer), enforcing the X-CSRF-Token header and the
// optimistic-lock version. All ids/names/tokens are placeholders.
import type { BrowserContext, Route } from '@playwright/test';

export const GROUP_ID = 'grp_00000000-0000-4000-8000-000000000001';
export const CSRF = 'TEST_CSRF_TOKEN';

export interface VrcpopRecorder {
  version: number; // current server optimistic-lock version
  forceStale: boolean; // when true, the next update answers 500 "Concurrent edit"
  nextEventId: number;
  createBodies: Record<string, unknown>[];
  updateBodies: Record<string, unknown>[];
  deleteBodies: Record<string, unknown>[];
  flyerUploads: { hasFlyer: boolean; groupId?: string; eventId?: string }[];
  flyerRemoves: Record<string, unknown>[];
  csrfSeen: (string | undefined)[];
}

export function newRecorder(): VrcpopRecorder {
  return {
    version: 2,
    forceStale: false,
    nextEventId: 100010,
    createBodies: [],
    updateBodies: [],
    deleteBodies: [],
    flyerUploads: [],
    flyerRemoves: [],
    csrfSeen: [],
  };
}

function page(title: string, body: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><meta name="csrf-token" content="${CSRF}"></head><body>${body}</body></html>`;
}

function dashboardHtml(loggedIn: boolean): string {
  return page(
    'Clubs I Manage',
    `<div class="manage-container dashboard-page"><h1>Clubs I Manage</h1>
<section class="manage-section"><div class="club-grid">
  <div class="club-card"><div class="club-card-main"><div class="club-card-info"><div class="club-card-header">
    <h3 class="club-name">Example Club</h3><span class="club-role role-owner">OWNER</span>
  </div></div></div>
  <div class="club-card-footer">
    <a href="/manage/club/${GROUP_ID}/events/new" class="btn btn-action-new-event">New Event</a>
    <a href="/manage/club/${GROUP_ID}/events" class="btn btn-action-events">Manage Events</a>
  </div></div>
</div></section></div>
<script>window.vrcpop = window.vrcpop || {}; window.vrcpop.user = { loggedIn: ${loggedIn ? 'true' : 'false'}, userId: 9001 };</script>`,
  );
}

function eventsListHtml(): string {
  return page(
    'Manage Events',
    `<div class="manage-container">
<section class="manage-section" data-section="events"><div class="event-list">
  <div class="event-card"><div class="event-card-info"><h4>what's poppin</h4>
    <div class="event-card-meta"><span><span class="icon95 icon95-calendar"></span> Thu, Sep 3, 2026 at 10:00 PM</span><span>1 sets</span></div>
  </div><div class="event-card-actions">
    <a href="/manage/club/${GROUP_ID}/events/100001" class="btn btn-secondary">Edit</a>
    <button class="btn btn-danger" onclick="deleteEvent(100001)">Delete</button>
  </div></div>
</div></section>
<section class="manage-section drafts-section" data-section="drafts"><div class="event-list">
  <div class="event-card event-card--draft" data-draft-id="100002"><input type="checkbox" class="draft-pick__box" value="100002">
    <div class="event-card-info"><h4>draft night</h4>
    <div class="event-card-meta"><span><span class="icon95 icon95-calendar"></span> Fri, Sep 11, 2026 at 9:00 PM</span><span>2 sets</span></div></div>
    <div class="event-card-actions"><a href="/manage/club/${GROUP_ID}/events/100002" class="btn btn-secondary">Edit</a></div>
  </div>
</div></section>
</div>
<script>window.MANAGE_DATA = { groupId: "${GROUP_ID}", groupName: "Example Club", bookedDates: {}, previewMode: false };</script>`,
  );
}

function dataEvent(version: number, eventId: number): Record<string, unknown> {
  return {
    id: eventId,
    group_id: GROUP_ID,
    event_name: "what's poppin",
    event_description: '',
    flyer_url: '',
    owner_timezone: 'Europe/Berlin',
    start_timestamp_utc: '2026-09-03 20:00:00',
    end_timestamp_utc: '2026-09-03 21:00:00',
    doors_open_timestamp_utc: null,
    is_quest_compatible: 0,
    has_open_deck: 0,
    scene_type: 'rave',
    scene_type_secondary: null,
    status: 'published',
    version,
    sets: [
      {
        id: 200001,
        set_order: 1,
        start_timestamp_utc: '2026-09-03 20:00:00',
        end_timestamp_utc: '2026-09-03 21:00:00',
        dj_name: 'Example DJ',
        performers: [{ performer_name: 'Example DJ', performer_profile_id: null }],
      },
    ],
  };
}

function editPageHtml(version: number, eventId: number): string {
  const enc = JSON.stringify(dataEvent(version, eventId))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return page(
    'Edit Event',
    `<div id="event-wizard-container" data-group-id="${GROUP_ID}" data-club-scene-type="rave" data-club-scene-type-secondary="" data-default-hosts="[]" data-event-id="${eventId}" data-event="${enc}"></div>`,
  );
}

const genresBody = {
  genres: [
    { id: 6, name: 'Trance', color: '#06B6D4', sort_order: 6 },
    { id: 14, name: 'Open Genre', color: '#FACC15', sort_order: 99 },
  ],
};
const energyBody = {
  energy_levels: [
    { id: 1, name: '⚡ Chill', color: '#4ADE80', sort_order: 1 },
    { id: 3, name: '⚡ High Energy', color: '#F97316', sort_order: 3 },
  ],
};
const lineupBody = {
  success: true,
  event: { group_name: 'Example Club', start_timestamp_utc: '2026-09-03T20:00:00Z', end_timestamp_utc: '2026-09-03T21:00:00Z' },
  lineup: [
    {
      set_id: 200001,
      set_order: 1,
      start_timestamp_utc: '2026-09-03T20:00:00Z',
      end_timestamp_utc: '2026-09-03T21:00:00Z',
      dj_name: 'Example DJ',
      performers: [{ name: 'Example DJ', profile_id: null, slug: 'example-dj' }],
      genre: { id: null, name: 'Open Genre', color: '#FACC15', is_custom: false },
      energy: null,
      notes: null,
    },
  ],
};
const searchAllBody = { success: true, profiles: [], historical: [{ name: 'Example DJ', use_count: 4, source: 'historical' }] };

function json(route: Route, body: unknown, status = 200): Promise<void> {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}
function htmlRes(route: Route, body: string, status = 200): Promise<void> {
  return route.fulfill({ status, contentType: 'text/html', body });
}

function parseMultipart(raw: string): { hasFlyer: boolean; groupId?: string; eventId?: string } {
  const hasFlyer = /name="flyer"/.test(raw);
  const gid = /name="group_id"\r?\n\r?\n([^\r\n]+)/.exec(raw);
  const eid = /name="event_id"\r?\n\r?\n([^\r\n]+)/.exec(raw);
  return { hasFlyer, groupId: gid?.[1]?.trim(), eventId: eid?.[1]?.trim() };
}

export async function mockVrcpopSite(context: BrowserContext, recorder: VrcpopRecorder, opts: { loggedIn?: boolean } = {}): Promise<void> {
  const loggedIn = opts.loggedIn !== false;
  await context.route('https://vrcpop.com/**', async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    const p = u.pathname;
    const q = u.search;
    const method = req.method();

    // reads
    if (method === 'GET' && p === '/dashboard') return htmlRes(route, dashboardHtml(loggedIn));
    if (method === 'GET' && /\/events$/.test(p)) return htmlRes(route, eventsListHtml());
    if (method === 'GET' && /\/edit$/.test(p)) return htmlRes(route, editPageHtml(recorder.version, 100001));
    if (method === 'GET' && p === '/api/event-lineup.php') return json(route, lineupBody);
    if (method === 'GET' && p === '/api/dj/' && q.includes('action=genres')) return json(route, genresBody);
    if (method === 'GET' && p === '/api/dj/' && q.includes('action=energy')) return json(route, energyBody);
    if (method === 'GET' && p === '/api/dj/' && q.includes('action=search-all')) return json(route, searchAllBody);
    if (method === 'GET' && p === '/api/user/' && q.includes('action=likes')) return json(route, { success: loggedIn, likes: { djs: [], clubs: [], events: [] }, rsvps: [] });

    // writes
    if (method === 'POST' && p === '/api/events/') {
      recorder.csrfSeen.push(req.headers()['x-csrf-token']);
      const bodyText = req.postData() ?? '{}';
      let body: Record<string, unknown> = {};
      try {
        body = JSON.parse(bodyText) as Record<string, unknown>;
      } catch {
        body = {};
      }
      if (q.includes('action=create')) {
        if (!req.headers()['x-csrf-token']) return json(route, { success: false, error: 'missing csrf' }, 403);
        recorder.createBodies.push(body);
        return json(route, { success: true, event_id: recorder.nextEventId++, message: 'created' }, 201);
      }
      if (q.includes('action=update')) {
        const stale = recorder.forceStale || body.version !== recorder.version;
        if (stale) return route.fulfill({ status: 500, contentType: 'text/plain', body: 'Concurrent edit detected' });
        recorder.updateBodies.push(body);
        recorder.version += 1;
        return json(route, { success: true, event_id: body.event_id });
      }
      if (q.includes('action=delete')) {
        recorder.deleteBodies.push(body);
        return json(route, { success: true });
      }
      return json(route, { success: false, error: `unhandled action ${q}` }, 404);
    }

    if (p === '/api/events/upload-flyer.php') {
      if (method === 'POST') {
        recorder.flyerUploads.push(parseMultipart(req.postData() ?? ''));
        return json(route, { success: true, flyer_url: '/flyers/example.png' });
      }
      if (method === 'DELETE') {
        let body: Record<string, unknown> = {};
        try {
          body = JSON.parse(req.postData() ?? '{}') as Record<string, unknown>;
        } catch {
          body = {};
        }
        recorder.flyerRemoves.push(body);
        return json(route, { success: true });
      }
    }

    // default: a bare HTML page so any stray navigation still loads
    return htmlRes(route, dashboardHtml(loggedIn), 200);
  });
}
