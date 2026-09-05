// Dashboard shell: minimal hash router + muted footer nav. Routes:
//   default (#/)      -> Overview (three equal platform cards)
//   #/kit             -> @rave-page/ui showcase (KitShowcase)
//   #/dev/ravepage    -> rave.page dev panel (RavepageDevPanel, keeps rp-* testids)
//   #/dev/vrcpop      -> vrcpop dev panel
//   #/dev/vrctl       -> vrc.tl dev panel
// event-bridge is platform-neutral: the Overview is the product; the dev panels
// are per-platform developer tools reachable from the footer.
import { useCallback, useEffect, useState } from 'react';
import { Button, EmptyState, LoadingSpinner } from '@rave-page/ui';
import { BUILD_ID } from '../../shared/build-id';
import { errorDebug } from '../lib/error-copy';
import { asIanaZone, asIsoUtc } from '../../core/time';
import type { EventCore } from '../../core/schema';
import type { Platform } from '../../shared/agent-protocol';
import { getSettings, onSettingsChange } from '../../runtime/settings';
import { ravepageAdapter, runPlan } from '../../adapters/ravepage/adapter';
import { connect, disconnect, whoAmI } from '../../adapters/ravepage/auth';
import type { ConnectionStatus, OwnClub } from '../../adapters/types';
import Overview from './views/Overview';
import Events from './views/Events';
import Clubs from './views/Clubs';
import EventDetail from './views/EventDetail';
import EventEditor from './views/EventEditor';
import Jobs from './views/Jobs';
import KitShowcase from './views/KitShowcase';
import Settings from './views/Settings';
import { markInterrupted } from '../../runtime/jobs';
import { invalidate } from '../lib/resource';
import { VrcpopDevPanel } from './dev/VrcpopDevPanel';
import { VrctlDevPanel } from './dev/VrctlDevPanel';
import { LineupDevPanel } from './dev/LineupDevPanel';

const PLATFORMS: readonly Platform[] = ['vrctl', 'vrcpop', 'ravepage'];
function isPlatform(v: string): v is Platform {
  return (PLATFORMS as readonly string[]).includes(v);
}

function testDraftCore(prefix: string, club: OwnClub): EventCore {
  const start = asIsoUtc(new Date(Date.now() + 86_400_000).toISOString());
  return {
    title: `${prefix}${new Date().toISOString()}`,
    start,
    zone: asIanaZone('UTC'),
    organizer: { name: club.name, vrchatGroupId: club.vrchatGroupId, platformIds: { ravepage: club.id } },
    lineup: [
      { order: 1, start, performers: [{ name: 'Example DJ', aliases: [{ platform: 'ravepage', name: 'Example DJ' }] }], dancers: [] },
    ],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'unlisted' },
    flags: {},
    music: { genres: [] },
    links: {},
    extras: {},
  };
}

// Developer tool for manual + e2e checks against the configured rave.page instance.
// Reachable at #/dev/ravepage (not the default route) — rave.page is one integration
// of three, not the product's home.
function RavepageDevPanel() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [clubs, setClubs] = useState<OwnClub[] | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus(await ravepageAdapter.session());
  }, []);

  useEffect(() => {
    void refresh().catch(() => undefined);
  }, [refresh]);

  const run = (fn: () => Promise<void>) => (): void => {
    setBusy(true);
    setError(null);
    void fn()
      .catch((e) => setError(errorDebug(e)))
      .finally(() => setBusy(false));
  };

  const onConnect = run(async () => {
    setStatus(await connect());
  });
  const onDisconnect = run(async () => {
    await disconnect();
    setUser(null);
    setClubs(null);
    setCreatedId(null);
    await refresh();
  });
  const onWhoAmI = run(async () => {
    const me = await whoAmI();
    setUser(`${me.label} (${me.userId})`);
    await refresh();
  });
  const onGroups = run(async () => {
    setClubs(await ravepageAdapter.listOwnClubs());
  });
  const onCreate = run(async () => {
    const list = clubs ?? (await ravepageAdapter.listOwnClubs());
    if (!clubs) setClubs(list);
    const club = list.find((c) => c.canOrganize);
    if (!club) throw new Error('no organizer with can_organize_events');
    const { testPrefix } = await getSettings();
    const core = testDraftCore(testPrefix, club);
    const plan = ravepageAdapter.planCreate(core, {
      organizer: { organizerType: club.organizerType, organizerId: club.id },
      publish: false,
    });
    const results = await runPlan(plan.steps);
    const created = results['create'] as { id?: string } | undefined;
    setCreatedId(created?.id ?? '(no id returned)');
  });
  const onDelete = run(async () => {
    if (!createdId) throw new Error('nothing to delete');
    await runPlan(ravepageAdapter.planDelete(createdId).steps);
    setCreatedId(null);
  });

  const connected = status?.connected === true;

  return (
    <main className="p-4 bg-background min-h-screen">
      <h2 className="font-orbitron text-xl text-foreground">rave.page dev panel</h2>
      <p className="text-2xs text-muted-foreground mb-3">build {BUILD_ID} · configured rave.page instance · manual + e2e checks</p>

      <p data-testid="rp-status" className="text-sm text-foreground mb-3">
        {connected
          ? `Connected${status?.label ? ` as ${status.label}` : ''}${status?.expiresAt ? ` · expires ${status.expiresAt}` : ''}${status?.reconnectSoon ? ' · reconnect soon' : ''}`
          : 'Not connected'}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {!connected && (
          <button type="button" data-testid="rp-connect" disabled={busy} onClick={onConnect} className="bg-brand-base text-white rounded-md h-[var(--control-h)] px-4">
            Connect rave.page
          </button>
        )}
        {connected && (
          <>
            <button type="button" data-testid="rp-disconnect" disabled={busy} onClick={onDisconnect} className="border border-border text-foreground rounded-md h-[var(--control-h)] px-4">
              Disconnect
            </button>
            <button type="button" data-testid="rp-whoami" disabled={busy} onClick={onWhoAmI} className="border border-border text-foreground rounded-md h-[var(--control-h)] px-4">
              Who am I
            </button>
            <button type="button" data-testid="rp-load-groups" disabled={busy} onClick={onGroups} className="border border-border text-foreground rounded-md h-[var(--control-h)] px-4">
              My groups
            </button>
            <button type="button" data-testid="rp-create" disabled={busy} onClick={onCreate} className="border border-border text-foreground rounded-md h-[var(--control-h)] px-4">
              Create test draft
            </button>
            {createdId && (
              <button type="button" data-testid="rp-delete" disabled={busy} onClick={onDelete} className="border border-brand-base text-brand-base rounded-md h-[var(--control-h)] px-4">
                Delete it
              </button>
            )}
          </>
        )}
      </div>

      {user && (
        <p data-testid="rp-user" className="text-2xs text-muted-foreground mb-2">
          {user}
        </p>
      )}

      {createdId && (
        <p data-testid="rp-created-id" className="text-2xs text-brand-mint mb-2">
          created {createdId}
        </p>
      )}

      {clubs && (
        <ul className="mb-3 list-disc pl-5">
          {clubs.map((c) => (
            <li key={`${c.organizerType}:${c.id}`} data-testid="rp-group" className="text-foreground">
              {c.name} · {c.organizerType} · {c.id}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p data-testid="rp-error" className="text-2xs text-brand-base">
          {error}
        </p>
      )}
    </main>
  );
}

// Developer panels, shown in the footer only when `developer.panels` is on. The
// routes stay reachable by URL regardless — this gates the nav, not the router.
const DEV_NAV: { hash: string; label: string }[] = [
  { hash: '#/dev/ravepage', label: 'rave.page' },
  { hash: '#/dev/vrcpop', label: 'vrcpop' },
  { hash: '#/dev/vrctl', label: 'vrc.tl' },
  { hash: '#/dev/lineup', label: 'Lineup' },
  { hash: '#/kit', label: 'Kit' },
];

const REPO_URL = 'https://github.com/dymattic/event-bridge';

// Footer: always the repo link + build id; the developer panel links appear only
// when the Settings "Developer panels" toggle is on.
function FooterNav({ route, showDev }: { route: string; showDev: boolean }) {
  return (
    <nav data-testid="footer-nav" className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 border-t border-border bg-card text-2xs text-muted-foreground">
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        data-testid="footer-repo"
        className="underline-offset-2 hover:underline hover:text-foreground"
      >
        event-bridge on GitHub
      </a>
      <span aria-hidden="true">·</span>
      <span data-testid="footer-version">build {BUILD_ID}</span>
      {showDev && (
        <span data-testid="footer-dev" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span aria-hidden="true">·</span>
          <span>Developer:</span>
          {DEV_NAV.map((n, i) => {
            const active = `#${route}` === n.hash;
            return (
              <span key={n.hash} className="flex items-center gap-2">
                <a
                  href={n.hash}
                  data-testid={`nav-${n.label}`}
                  className={`underline-offset-2 hover:underline ${active ? 'text-foreground' : 'hover:text-foreground'}`}
                >
                  {n.label}
                </a>
                {i < DEV_NAV.length - 1 && <span aria-hidden="true">·</span>}
              </span>
            );
          })}
        </span>
      )}
    </nav>
  );
}

function useHashRoute(): string {
  const [hash, setHash] = useState<string>(() => (typeof window !== 'undefined' ? window.location.hash : ''));
  useEffect(() => {
    const on = (): void => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

// Primary nav: Overview · Events (the product surfaces). Dev panels stay in the
// muted footer. event-bridge is platform-neutral — no platform-specific top item.
const TOP_NAV: { hash: string; label: string; match: (path: string) => boolean }[] = [
  { hash: '#/', label: 'Overview', match: (p) => p === '/' },
  { hash: '#/events', label: 'Events', match: (p) => p.startsWith('/events') },
  { hash: '#/clubs', label: 'Clubs', match: (p) => p.startsWith('/clubs') },
  { hash: '#/jobs', label: 'Jobs', match: (p) => p === '/jobs' },
  { hash: '#/settings', label: 'Settings', match: (p) => p === '/settings' },
];

// Shown when a rave.page-only route is reached while the integration is off.
function RavepageOff(): React.JSX.Element {
  return (
    <main className="p-4 bg-background min-h-screen">
      <EmptyState
        data-testid="ravepage-off"
        headingLevel="h2"
        title="rave.page integration is off"
        description="Optional integration, off by default. Enable it in Settings to use rave.page here."
        action={
          <Button asChild>
            <a href="#/settings">Open Settings</a>
          </Button>
        }
      />
    </main>
  );
}

function TopNav({ path }: { path: string }): React.JSX.Element {
  return (
    <nav data-testid="top-nav" className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border bg-card">
      <span className="font-orbitron text-sm text-foreground mr-2">event-bridge</span>
      {TOP_NAV.map((n) => (
        <Button
          key={n.hash}
          asChild
          size="sm"
          variant={n.match(path) ? 'secondary' : 'ghost'}
          data-testid={`topnav-${n.label.toLowerCase()}`}
        >
          <a href={n.hash}>{n.label}</a>
        </Button>
      ))}
    </nav>
  );
}

export function App() {
  const raw = useHashRoute().replace(/^#/, '') || '/';
  const qIdx = raw.indexOf('?');
  const path = qIdx === -1 ? raw : raw.slice(0, qIdx);
  const query = qIdx === -1 ? '' : raw.slice(qIdx + 1);
  const newRoute = path === '/events/new';
  const editMatch = /^\/events\/([^/]+)\/(.+)\/edit$/.exec(path);
  const detail = editMatch ? null : /^\/events\/([^/]+)\/(.+)$/.exec(path);

  // null = still loading; gate rave.page-only routes when the toggle is off.
  const [rpEnabled, setRpEnabled] = useState<boolean | null>(null);
  const [devPanels, setDevPanels] = useState(false);
  useEffect(() => {
    const apply = (s: { experimental: { ravepage: boolean }; developer: { panels: boolean } }): void => {
      setRpEnabled(s.experimental.ravepage);
      setDevPanels(s.developer.panels);
    };
    void getSettings().then(apply);
    return onSettingsChange(apply);
  }, []);

  // Dashboard boot: a job left 'running' from a prior session can't resume -> mark
  // it interrupted (once).
  useEffect(() => {
    void markInterrupted().then(() => invalidate('jobs'));
  }, []);

  const ravepageRoute =
    path === '/dev/ravepage' ||
    (detail !== null && detail[1] === 'ravepage') ||
    (editMatch !== null && editMatch[1] === 'ravepage');
  // ?targets= applies to both create and edit (transfer = edit + extra targets).
  const editTargets = new URLSearchParams(query).get('targets')?.split(',').filter(isPlatform) ?? [];

  let view: React.JSX.Element;
  if (ravepageRoute && rpEnabled !== true) {
    view = rpEnabled === false ? <RavepageOff /> : <main className="p-4"><LoadingSpinner /></main>;
  } else {
    view =
      path === '/kit' ? (
        <KitShowcase />
      ) : path === '/settings' ? (
        <Settings />
      ) : path === '/dev/ravepage' ? (
        <RavepageDevPanel />
      ) : path === '/dev/vrcpop' ? (
        <VrcpopDevPanel />
      ) : path === '/dev/vrctl' ? (
        <VrctlDevPanel />
      ) : path === '/dev/lineup' ? (
        <LineupDevPanel />
      ) : newRoute ? (
        <EventEditor mode="create" initialTargets={editTargets} />
      ) : editMatch && isPlatform(editMatch[1] ?? '') ? (
        <EventEditor mode="edit" platform={editMatch[1] as Platform} id={editMatch[2] ?? ''} initialTargets={editTargets} />
      ) : detail && isPlatform(detail[1] ?? '') ? (
        <EventDetail platform={detail[1] as Platform} id={detail[2] ?? ''} />
      ) : path === '/jobs' ? (
        <Jobs />
      ) : path === '/clubs' ? (
        <Clubs />
      ) : path === '/events' ? (
        <Events query={query} />
      ) : (
        <Overview />
      );
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav path={path} />
      <div className="flex-1">{view}</div>
      <FooterNav route={path} showDev={devPanels} />
    </div>
  );
}
