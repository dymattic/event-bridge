// Data layer for the dashboard's real listings: connections, per-platform
// clubs+events, event reads, and the delete plan/execute. Wraps the adapter
// registry and enforces the loading discipline — reads to a third-party host are
// paced >=300 ms apart; platforms are loaded in parallel with each other by the
// callers (each useResource key runs its own loader). Registry imports the
// webext runtime, so this module is NOT node-importable — render tests mock it.
import type { EventCore } from '../../../core/schema';
import type { JsonValue } from '../../../core/hash';
import { renderPreview, resolveRefs } from '../../../core/planner';
import type { Platform } from '../../../shared/agent-protocol';
import { getAdapter } from '../../../adapters/registry';
import type { OwnClub } from '../../../adapters/types';
import { getSessionStatus } from '../../../runtime/sessions';
import { status as ravepageStatus } from '../../../adapters/ravepage/auth';
import { READ_GAP_MS, THIRD_PARTY } from '../../lib/platform-meta';
import type { EventRow } from '../../lib/event-filters';

export interface PlatformConn {
  connected: boolean;
  label?: string;
  expiresAt?: string;
}

export interface PlatformData {
  clubs: OwnClub[];
  events: EventRow[];
}

// Per-host min-gap between reads (user-agency, human scale). rave.page is our own
// API -> not paced.
const lastRead = new Map<Platform, number>();
export async function paceHost(platform: Platform): Promise<void> {
  if (!THIRD_PARTY[platform]) return;
  const wait = READ_GAP_MS - (Date.now() - (lastRead.get(platform) ?? 0));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRead.set(platform, Date.now());
}

export async function loadConnections(): Promise<Record<Platform, PlatformConn>> {
  const [vt, vp, rp] = await Promise.all([getSessionStatus('vrctl'), getSessionStatus('vrcpop'), ravepageStatus()]);
  return {
    vrctl: { connected: vt.state === 'logged-in', label: vt.info?.label },
    vrcpop: { connected: vp.state === 'logged-in', label: vp.info?.label },
    ravepage: { connected: rp.connected, label: rp.label, expiresAt: rp.expiresAt },
  };
}

// Own clubs -> own events per club (sequential + paced for third-party hosts).
export async function loadPlatformData(platform: Platform): Promise<PlatformData> {
  const adapter = getAdapter(platform);
  await paceHost(platform);
  const clubs = await adapter.listOwnClubs();
  const events: EventRow[] = [];
  for (const club of clubs) {
    await paceHost(platform);
    const own = await adapter.listOwnEvents({ organizerType: club.organizerType, organizerId: club.id });
    for (const e of own) {
      events.push({
        platform,
        id: e.id,
        title: e.title,
        start: e.start,
        status: e.status,
        visibility: e.visibility,
        clubId: club.id,
        clubName: club.name,
      });
    }
  }
  return { clubs, events };
}

export async function readEventCore(platform: Platform, id: string): Promise<EventCore> {
  await paceHost(platform);
  return getAdapter(platform).readEvent(id);
}

// Human-readable, exact preview of the delete request(s) — shown before confirm.
export function deletePreview(platform: Platform, id: string): string[] {
  return getAdapter(platform).planDelete(id).steps.map(renderPreview);
}

export async function executeDelete(platform: Platform, id: string): Promise<void> {
  const adapter = getAdapter(platform);
  const { steps } = adapter.planDelete(id);
  const results: Record<string, JsonValue> = {};
  for (const step of steps) {
    await paceHost(platform);
    results[step.id] = await adapter.execute(resolveRefs(step, results));
  }
}
