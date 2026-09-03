// Full vrc.tl mock for the adapter e2e: serves the sanitized fixtures and
// records every intercepted request so a test can assert exact bodies. NEVER
// touches the real site. Register before opening the platform tab.
import type { BrowserContext, Route } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const fixDir = resolve(here, '..', '..', 'test', 'fixtures', 'vrctl');
const mocksDir = here;

function fix(name: string): string {
  return readFileSync(resolve(fixDir, name), 'utf8');
}
function mock(name: string): string {
  return readFileSync(resolve(mocksDir, name), 'utf8');
}

export interface RecordedRequest {
  method: string;
  path: string;
  search: string;
  postData: string | null;
  contentType: string | null;
}

export interface MockVrctlOptions {
  loggedIn?: boolean; // default true
  createDetailId?: string; // id the create redirect points at (default 100002)
}

export async function mockVrctlSite(context: BrowserContext, recorder: RecordedRequest[], opts: MockVrctlOptions = {}): Promise<void> {
  const loggedIn = opts.loggedIn ?? true;
  const detailId = opts.createDetailId ?? '100002';

  await context.route('https://vrc.tl/**', (route: Route) => {
    const req = route.request();
    const u = new URL(req.url());
    const p = u.pathname;
    recorder.push({
      method: req.method(),
      path: p,
      search: u.search,
      postData: req.postData() ?? req.postDataBuffer()?.toString('utf8') ?? null,
      contentType: req.headers()['content-type'] ?? null,
    });

    const html = (body: string): ReturnType<Route['fulfill']> => route.fulfill({ contentType: 'text/html', body });

    // Logged out: serve the sign-in page directly (NO browser redirect — a
    // fulfilled 3xx is followed by Chromium to the real network, bypassing this
    // route; the adapter detects sign-in from the body marker).
    if (!loggedIn && p.startsWith('/admin/')) return html(mock('vrctl-signin.html'));
    if (p.startsWith('/sign/')) return html(mock('vrctl-signin.html'));

    // Performer autocomplete (select2 JSON).
    if (p === '/admin/ajax/performer') {
      const raw = JSON.parse(fix('performer-search.json')) as { exact: { status: number; body: string } };
      return route.fulfill({ status: raw.exact.status, contentType: 'application/json', body: raw.exact.body });
    }
    if (p === '/admin/ajax/organizer') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [{ id: 9001, text: 'Example Club' }] }) });
    }

    // Grid delete action -> 200 grid (no browser redirect; see note above). The
    // real site 302s back to the grid; the adapter accepts status < 400 + not-sign-in.
    if (p === '/admin/event' && u.searchParams.get('grid-grid-__key') === 'delete') {
      return html(fix('admin-grid.html'));
    }

    if (p === '/admin/event/choose-organizer') return html(fix('choose-organizer.html'));
    if (p === '/admin/event/choose-category') return html(fix('choose-category.html'));

    if (p === '/admin/event/create' && req.method() === 'POST') {
      // Real site: 303 -> detail (the agent follows -> finalUrl carries the id).
      // Mock: a fulfilled 3xx escapes routing to the live network, so instead
      // return 200 with a Location header the agent reads (same code path via
      // HttpResult.headers.location). No browser redirect, no leak.
      return route.fulfill({ status: 200, contentType: 'text/html', headers: { location: `https://vrc.tl/admin/event/detail/${detailId}` }, body: '' });
    }
    if (p.startsWith('/admin/event/detail/')) return html(fix('detail-form.html'));

    // Grid (default admin landing).
    if (p === '/admin/event') return html(fix('admin-grid.html'));

    return route.fulfill({ status: 404, contentType: 'text/html', body: 'not found' });
  });
}
