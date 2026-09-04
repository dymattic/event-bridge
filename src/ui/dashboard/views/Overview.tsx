// Default dashboard view: three equal platform cards (vrc.tl, vrcpop.com,
// rave.page — the order the user lists them). No platform is primary. Tab
// platforms derive status from the page session (getSessionStatus); rave.page
// from its token store (a connect gesture). All actions are user-triggered.
import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, DashboardListRow, StatCard } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { getSessionStatus } from '../../../runtime/sessions';
import { status as ravepageStatus, connect, disconnect } from '../../../adapters/ravepage/auth';
import { ensureAgent, PLATFORM_ORIGINS } from '../../../runtime/tabs';
import { ext } from '../../../shared/webext';
import { RAVEPAGE_CAPS, VRCTL_CAPS, type DraftSupport } from '../../../core/capabilities';
import { vrcpopCaps } from '../../../adapters/vrcpop/capabilities';
import { ravepageStatusView, tabStatusView, type StatusView } from '../../lib/status';
import { useResource } from '../../lib/resource';
import { loadPlatformData } from '../lib/event-data';
import { PlatformCard } from '../components/PlatformCard';

// Connected-state card body: own clubs (name + type + per-club event count) and a
// StatCard of upcoming own events, with a link into the full events view.
function PlatformDetail({ platform, connected }: { platform: Platform; connected: boolean }): React.JSX.Element | null {
  const { data, loading } = useResource(connected ? `platform:${platform}` : null, () => loadPlatformData(platform));
  if (!connected) return null;
  const clubs = data?.clubs ?? [];
  const events = data?.events ?? [];
  const upcoming = events.filter((e) => e.start && Date.parse(e.start) >= Date.now()).length;
  const countByClub = new Map<string, number>();
  for (const e of events) countByClub.set(e.clubId, (countByClub.get(e.clubId) ?? 0) + 1);
  const busy = loading && !data;

  return (
    <div className="flex flex-col gap-3" data-testid={`platform-detail-${platform}`}>
      <StatCard label="Upcoming events" value={busy ? '…' : upcoming} data-testid={`platform-upcoming-${platform}`} />
      <div className="flex flex-col gap-1.5" data-testid={`platform-clubs-${platform}`}>
        {busy && <span className="text-2xs text-muted-foreground">Loading clubs…</span>}
        {clubs.map((c) => (
          <DashboardListRow asButton={false} key={c.id} data-testid="platform-club">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-foreground">{c.name}</span>
              <span className="flex items-center gap-2">
                <Badge variant="outline">{c.organizerType}</Badge>
                {data && <span className="text-2xs text-muted-foreground">{countByClub.get(c.id) ?? 0} events</span>}
              </span>
            </div>
          </DashboardListRow>
        ))}
      </div>
      <Button asChild variant="outline" data-testid={`platform-view-events-${platform}`}>
        <a href={`#/events?platform=${platform}`}>View events</a>
      </Button>
    </div>
  );
}

// Fixed display order — vrc.tl, vrcpop.com, rave.page.
const ORDER: Platform[] = ['vrctl', 'vrcpop', 'ravepage'];

const hostOf = (p: Platform): string => new URL(PLATFORM_ORIGINS[p].origin).host;

// Minimal caps shape the Supports line needs (works for both the core tables and
// vrcpop's tri-state-draft variant).
interface SupportCaps {
  draft: boolean | DraftSupport;
  b2b: boolean;
  posterUpload: boolean;
  posterUrl: boolean;
}
const CAPS: Record<Platform, SupportCaps> = {
  vrctl: VRCTL_CAPS,
  vrcpop: vrcpopCaps,
  ravepage: RAVEPAGE_CAPS,
};

function draftWord(d: boolean | DraftSupport): string {
  if (d === true || d === 'supported') return 'yes';
  if (d === 'expected-unverified') return 'unverified';
  return 'no';
}

function supportsLine(c: SupportCaps): string {
  const yn = (b: boolean): string => (b ? 'yes' : 'no');
  const publishToggle = c.draft === false || c.draft === 'unsupported' ? 'no' : 'yes';
  return `Supports: drafts ${draftWord(c.draft)} · lineup ${yn(c.b2b)} · poster ${yn(c.posterUpload || c.posterUrl)} · publish toggle ${publishToggle}`;
}

const CHECKING: StatusView = { text: 'Checking…', variant: 'secondary', noAccess: false };

export default function Overview(): React.JSX.Element {
  const [statuses, setStatuses] = useState<Record<Platform, StatusView>>({
    vrctl: CHECKING,
    vrcpop: CHECKING,
    ravepage: CHECKING,
  });
  const [rpConnected, setRpConnected] = useState(false);
  const [connected, setConnected] = useState<Record<Platform, boolean>>({ vrctl: false, vrcpop: false, ravepage: false });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const [vt, vp, rp] = await Promise.all([
        getSessionStatus('vrctl'),
        getSessionStatus('vrcpop'),
        ravepageStatus(),
      ]);
      setStatuses({
        vrctl: tabStatusView(vt),
        vrcpop: tabStatusView(vp),
        ravepage: ravepageStatusView(rp.connected, rp.label, rp.expiresAt),
      });
      setRpConnected(rp.connected);
      setConnected({ vrctl: vt.state === 'logged-in', vrcpop: vp.state === 'logged-in', ravepage: rp.connected });
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = (fn: () => Promise<void>) => (): void => {
    setError(null);
    setBusy(true);
    void fn()
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        void load();
      });
  };

  const refresh = (): void => {
    void load();
  };

  // Firefox host-permission request — MUST run in the click gesture (no await
  // before ext.permissions.request).
  const grant = (p: Platform) => (): void => {
    void ext.permissions.request({ origins: [`${PLATFORM_ORIGINS[p].origin}/*`] }).then((ok) => {
      if (ok) void load();
    });
  };

  const openSite = (p: Platform) => runAction(async () => {
    await ensureAgent(p, { allowOpen: true, active: true });
  });
  const onConnect = runAction(async () => {
    await connect();
  });
  const onDisconnect = runAction(async () => {
    await disconnect();
  });

  return (
    <main className="p-4 bg-background min-h-screen">
      <header className="mb-4">
        <h1 className="font-orbitron text-2xl text-foreground">event-bridge</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Move your events and lineups between vrc.tl, vrcpop.com and rave.page — in your own browser sessions.
        </p>
      </header>

      <div data-testid="overview-cards" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ORDER.map((p) => {
          const name = PLATFORM_ORIGINS[p].name;
          const actions =
            p === 'ravepage' ? (
              <>
                {rpConnected ? (
                  <Button type="button" variant="outline" data-testid="platform-disconnect-ravepage" disabled={busy} onClick={onDisconnect}>
                    Disconnect
                  </Button>
                ) : (
                  <Button type="button" data-testid="platform-connect-ravepage" disabled={busy} onClick={onConnect}>
                    Connect
                  </Button>
                )}
                <Button type="button" variant="outline" data-testid="platform-refresh-ravepage" disabled={busy} onClick={refresh}>
                  Refresh
                </Button>
              </>
            ) : (
              <>
                <Button type="button" data-testid={`platform-open-${p}`} disabled={busy} onClick={openSite(p)}>
                  Open {name}
                </Button>
                <Button type="button" variant="outline" data-testid={`platform-refresh-${p}`} disabled={busy} onClick={refresh}>
                  Refresh
                </Button>
              </>
            );
          return (
            <PlatformCard
              key={p}
              platform={p}
              name={name}
              host={hostOf(p)}
              status={statuses[p]}
              supports={supportsLine(CAPS[p])}
              actions={actions}
              onGrant={grant(p)}
            >
              <PlatformDetail platform={p} connected={connected[p]} />
            </PlatformCard>
          );
        })}
      </div>

      <p className="text-2xs text-muted-foreground mt-4 max-w-2xl">
        event-bridge only acts inside your own signed-in sessions. Sign in on each site in a normal tab; nothing is scraped.
      </p>

      {error && (
        <p data-testid="overview-error" className="text-2xs text-brand-base mt-2">
          {error}
        </p>
      )}
    </main>
  );
}
