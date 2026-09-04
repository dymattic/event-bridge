// Per-origin session detection, run inside the injected agent (content script).
// Content scripts share the page's DOM + origin storage but NOT the page's JS
// globals — vrcpop's `window.vrcpop.user` is read by parsing inline script TEXT,
// never by touching the page window.
import { ORIGINS, type SessionInfo } from '../shared/agent-protocol';
import { base64ToBytes } from '../shared/base64';
import { BridgeError } from '../core/errors';

// ---- vrcpop ----

export interface VrcpopUser {
  loggedIn: boolean;
  userId?: number;
}

// Tolerant to whitespace. Anchors on the `window.vrcpop.user = {` assignment so
// later `window.vrcpop.user.likes = …` statements can't be mistaken for it.
export function parseVrcpopUser(scriptText: string): VrcpopUser | null {
  const anchor = /window\.vrcpop\.user\s*=\s*\{/.exec(scriptText);
  if (!anchor) return null;
  const rest = scriptText.slice(anchor.index);
  const logged = /loggedIn\s*:\s*(true|false)/.exec(rest);
  if (!logged) return null;
  const uid = /userId\s*:\s*(\d+)/.exec(rest);
  return {
    loggedIn: logged[1] === 'true',
    userId: uid ? Number(uid[1]) : undefined,
  };
}

function collectScriptText(): string {
  return Array.from(document.scripts, (s) => s.textContent ?? '').join('\n');
}

// Signed-in Discord display name from the account menu (`.sidebar-user-name`,
// present on every manage page's sidebar). Returns undefined when absent (logged
// out, or a page without the sidebar) — NEVER a raw id.
export function parseVrcpopLabel(html: string): string | undefined {
  const m = /<span[^>]*class="[^"]*\bsidebar-user-name\b[^"]*"[^>]*>([^<]*)<\/span>/i.exec(html);
  const name = m?.[1]?.trim();
  return name ? name : undefined;
}

async function detectVrcpop(): Promise<SessionInfo> {
  const parsed = parseVrcpopUser(collectScriptText());
  if (parsed) {
    const label = parseVrcpopLabel(document.documentElement.outerHTML);
    return {
      loggedIn: parsed.loggedIn,
      label: parsed.loggedIn ? label : undefined,
      userId: parsed.userId != null ? String(parsed.userId) : undefined,
    };
  }
  // Fallback when the inline script is absent: probe an auth-gated endpoint.
  const res = await fetch('/api/user/?action=likes', { credentials: 'same-origin' });
  return { loggedIn: res.ok };
}

// ---- vrc.tl ----

// Stable marker of the /admin/event Nette DataGrid ("grid" component/control).
export function hasVrctlGrid(html: string): boolean {
  return html.includes('snippet-grid-grid') || html.includes('datagrid-grid-grid');
}

// Account name from the admin navbar account dropdown (the toggle span sitting
// just before the menu linking to /admin/my-account). Returns undefined when
// absent — NEVER a raw id.
export function parseVrctlLabel(html: string): string | undefined {
  const anchor = html.indexOf('/admin/my-account');
  if (anchor === -1) return undefined;
  const before = html.slice(0, anchor);
  const re = /<button[^>]*dropdown-toggle[^>]*>\s*<span>([^<]*)<\/span>/gi;
  let last: string | undefined;
  let m: RegExpExecArray | null;
  while ((m = re.exec(before)) !== null) last = m[1];
  const name = last?.trim();
  return name ? name : undefined;
}

async function detectVrctl(): Promise<SessionInfo> {
  const res = await fetch('/admin/event', { credentials: 'same-origin', redirect: 'follow' });
  // Logged out -> Nette bounces to a sign-in page outside /admin/.
  if (!new URL(res.url).pathname.startsWith('/admin/')) return { loggedIn: false };
  const html = await res.text();
  if (!hasVrctlGrid(html)) return { loggedIn: false };
  return { loggedIn: true, label: parseVrctlLabel(html) };
}

// ---- rave.page ----

function base64UrlToJson(seg: string): unknown {
  let b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return JSON.parse(new TextDecoder().decode(base64ToBytes(b64)));
}

// Unverified decode of the JWT `exp` (seconds). No signature check by design.
export function jwtExp(token: string): number | null {
  const parts = token.split('.');
  if (parts.length < 2 || !parts[1]) return null;
  try {
    const payload = base64UrlToJson(parts[1]);
    if (typeof payload === 'object' && payload !== null) {
      const exp = (payload as { exp?: unknown }).exp;
      return typeof exp === 'number' ? exp : null;
    }
    return null;
  } catch {
    return null;
  }
}

// Content scripts CAN read origin localStorage. Never read auth_refresh_token.
export function detectRavepage(now: number = Date.now()): SessionInfo {
  const token = localStorage.getItem('auth_token');
  if (!token) return { loggedIn: false };
  const exp = jwtExp(token);
  if (exp == null || exp * 1000 <= now) return { loggedIn: false };
  return { loggedIn: true, expiresAt: new Date(exp * 1000).toISOString() };
}

// ---- dispatch ----

const DETECTORS: Record<string, () => Promise<SessionInfo> | SessionInfo> = {
  [ORIGINS.vrcpop]: detectVrcpop,
  [ORIGINS.vrctl]: detectVrctl,
  [ORIGINS.ravepage]: () => detectRavepage(),
};

export async function detectSession(): Promise<SessionInfo> {
  const detector = DETECTORS[location.origin];
  if (!detector) throw new BridgeError('UNSUPPORTED', `no session detector for ${location.origin}`);
  return detector();
}
