// Agent lifecycle on the page side (dashboard/popup): locate/open a platform tab,
// inject the agent bundle, verify it answers with the current build.
import { ext } from '../shared/webext';
import { BUILD_ID } from '../shared/build-id';
import { BridgeError } from '../core/errors';
import { ORIGINS, type AgentPing, type AgentPong, type Platform } from '../shared/agent-protocol';

export interface PlatformMeta {
  platform: Platform;
  origin: string;
  entry: string;
  name: string;
}

export const PLATFORM_ORIGINS: Record<Platform, PlatformMeta> = {
  vrcpop: { platform: 'vrcpop', origin: ORIGINS.vrcpop, entry: `${ORIGINS.vrcpop}/dashboard`, name: 'vrcpop.com' },
  vrctl: { platform: 'vrctl', origin: ORIGINS.vrctl, entry: `${ORIGINS.vrctl}/admin/event`, name: 'vrc.tl' },
  ravepage: { platform: 'ravepage', origin: ORIGINS.ravepage, entry: `${ORIGINS.ravepage}/`, name: 'rave.page' },
};

export const PLATFORMS: Platform[] = ['vrcpop', 'vrctl', 'ravepage'];

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

export async function ensureAgent(platform: Platform, opts: { allowOpen: boolean }): Promise<EnsureResult> {
  const meta = PLATFORM_ORIGINS[platform];
  if (!(await hasPermission(meta.origin))) {
    throw new BridgeError('PERMISSION_MISSING', `host permission missing for ${meta.name}`);
  }

  const existing = pickTab(await ext.tabs.query({ url: `${meta.origin}/*` }));
  let tabId: number;
  let opened_ = false;
  if (existing?.id != null) {
    tabId = existing.id;
    await waitForComplete(tabId);
  } else {
    if (!opts.allowOpen) throw new BridgeError('AGENT_UNAVAILABLE', `no ${meta.name} tab open`);
    const created = await ext.tabs.create({ url: meta.entry, active: false });
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
  const tabs = await ext.tabs.query({ url: `${PLATFORM_ORIGINS[platform].origin}/*` });
  return tabs.map((t) => ({ tabId: t.id, url: t.url }));
}

export function openedTabIds(): number[] {
  return [...opened];
}

export async function closeOpenedTabs(): Promise<void> {
  const ids = [...opened];
  opened.clear();
  await Promise.all(ids.map((id) => ext.tabs.remove(id).catch(() => undefined)));
}
