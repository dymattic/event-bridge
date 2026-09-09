// Agent lifecycle on the page side (dashboard/popup): locate/open a platform tab,
// inject the agent bundle, verify it answers with the current build.
import { ext } from '../shared/webext';
import { BUILD_ID } from '../shared/build-id';
import { BridgeError } from '../core/errors';
import { ORIGINS, type AgentPing, type AgentPong, type Platform } from '../shared/agent-protocol';
import { getRavepageInstance } from './settings';

export interface PlatformMeta {
  platform: Platform;
  origin: string;
  entry: string;
  name: string;
}

// Resolve a platform's origin/entry/name AT CALL TIME. vrcpop/vrctl are static;
// rave.page derives its origin/entry from the configured instance (settings).
export async function getPlatformMeta(platform: Platform): Promise<PlatformMeta> {
  if (platform === 'ravepage') {
    const { appOrigin } = await getRavepageInstance();
    return { platform, origin: appOrigin, entry: `${appOrigin}/`, name: 'rave.page' };
  }
  const origin = ORIGINS[platform];
  return platform === 'vrcpop'
    ? { platform, origin, entry: `${origin}/dashboard`, name: 'vrcpop.com' }
    : { platform, origin, entry: `${origin}/admin/event`, name: 'vrc.tl' };
}

// Fixed display order across UI surfaces: vrc.tl, vrcpop.com, rave.page.
export const PLATFORMS: Platform[] = ['vrctl', 'vrcpop', 'ravepage'];

// Boundary: Firefox exposes container identity; Chromium omits cookieStoreId.
type SessionTab = chrome.tabs.Tab & { cookieStoreId?: string };

function usableTab(tab: SessionTab): boolean {
  return !tab.incognito && (tab.cookieStoreId == null || tab.cookieStoreId === 'firefox-default');
}

const TAB_READY_TIMEOUT_MS = 15_000;
const opened = new Set<number>();

async function hasPermission(origin: string): Promise<boolean> {
  return ext.permissions.contains({ origins: [`${origin}/*`] });
}

function pickTab(tabs: chrome.tabs.Tab[]): chrome.tabs.Tab | undefined {
  return (
    tabs.find((t) => t.status === 'complete' && t.active) ??
    tabs.find((t) => t.status === 'complete') ??
    tabs[0]
  );
}

async function waitForComplete(tabId: number, timeoutMs = TAB_READY_TIMEOUT_MS): Promise<void> {
  const tab = await ext.tabs.get(tabId);
  if (tab.status === 'complete') return;
  await new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      clearTimeout(timer);
      ext.tabs.onUpdated.removeListener(onUpdated);
      ext.tabs.onRemoved.removeListener(onRemoved);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new BridgeError('TIMEOUT', `tab ${tabId} did not finish loading`));
    }, timeoutMs);
    const onUpdated = (id: number, info: chrome.tabs.OnUpdatedInfo): void => {
      if (id === tabId && info.status === 'complete') {
        cleanup();
        resolve();
      }
    };
    const onRemoved = (id: number): void => {
      if (id === tabId) {
        cleanup();
        reject(new BridgeError('AGENT_UNAVAILABLE', `tab ${tabId} was closed`));
      }
    };
    ext.tabs.onUpdated.addListener(onUpdated);
    ext.tabs.onRemoved.addListener(onRemoved);
  });
}

async function injectAndPing(tabId: number): Promise<string> {
  if (!usableTab(await ext.tabs.get(tabId))) {
    throw new BridgeError('NOT_AUTHORIZED', 'Use a normal, non-container platform tab');
  }
  await ext.scripting.executeScript({ target: { tabId }, files: ['agent.js'] });
  const ping: AgentPing = { type: 'agentPing' };
  let pong: unknown;
  try {
    pong = await ext.tabs.sendMessage(tabId, ping);
  } catch {
    throw new BridgeError('AGENT_UNAVAILABLE', `agent unreachable on tab ${tabId}`);
  }
  // Boundary: sendMessage returns unknown; validate the pong shape.
  if (typeof pong === 'object' && pong !== null && (pong as AgentPong).ok === true) {
    return (pong as AgentPong).buildId;
  }
  throw new BridgeError('AGENT_UNAVAILABLE', `agent did not answer ping on tab ${tabId}`);
}

export interface EnsureResult {
  tabId: number;
  opened: boolean;
}

// opts.url/active (P3): a caller may target a specific page on the platform
// (e.g. rave.page's /desktop/bridge) and open it ACTIVE. When url is set an
// existing tab is reused only if its URL is on that path; otherwise the tab is
// opened at url. Callers passing only {allowOpen} keep the P2 behaviour.
export async function ensureAgent(
  platform: Platform,
  opts: { allowOpen: boolean; url?: string; active?: boolean },
): Promise<EnsureResult> {
  const meta = await getPlatformMeta(platform);
  if (!(await hasPermission(meta.origin))) {
    throw new BridgeError('PERMISSION_MISSING', `host permission missing for ${meta.name}`);
  }

  let matches = (await ext.tabs.query({ url: `${meta.origin}/*` })).filter(usableTab);
  if (opts.url) {
    const target = new URL(opts.url);
    const pathPrefix = `${target.origin}${target.pathname}`;
    matches = matches.filter((t) => (t.url ?? '').startsWith(pathPrefix));
  }
  const existing = pickTab(matches);
  let tabId: number;
  let opened_ = false;
  if (existing?.id != null) {
    tabId = existing.id;
    await waitForComplete(tabId);
  } else {
    if (!opts.allowOpen) throw new BridgeError('AGENT_UNAVAILABLE', `no ${meta.name} tab open`);
    const created = await ext.tabs.create({ url: opts.url ?? meta.entry, active: opts.active ?? false });
    if (created.id == null) throw new BridgeError('AGENT_UNAVAILABLE', `failed to open ${meta.name} tab`);
    tabId = created.id;
    opened_ = true;
    opened.add(tabId);
    await waitForComplete(tabId);
  }

  const buildId = await injectAndPing(tabId);
  if (buildId !== BUILD_ID) {
    // Stale agent from a prior extension build: reload to clear it, inject once more.
    await ext.tabs.reload(tabId);
    await waitForComplete(tabId);
    const again = await injectAndPing(tabId);
    if (again !== BUILD_ID) {
      throw new BridgeError('AGENT_UNAVAILABLE', `stale agent persisted on tab ${tabId} after reload`);
    }
  }
  return { tabId, opened: opened_ };
}

// Diagnostic: does tabs.query surface matching-origin tab URLs without the
// "tabs" permission (host permission only)? Used by the e2e probe.
export async function queryPlatformTabs(platform: Platform): Promise<{ tabId?: number; url?: string }[]> {
  const meta = await getPlatformMeta(platform);
  const tabs = await ext.tabs.query({ url: `${meta.origin}/*` });
  return tabs.filter(usableTab).map((t) => ({ tabId: t.id, url: t.url }));
}

export function openedTabIds(): number[] {
  return [...opened];
}

export async function closeOpenedTabs(): Promise<void> {
  const ids = [...opened];
  opened.clear();
  await Promise.all(ids.map((id) => ext.tabs.remove(id).catch(() => undefined)));
}
