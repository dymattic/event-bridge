// Dashboard shell: minimal hash router + muted footer nav. Routes:
//   default (#/)      -> Overview (three equal platform cards)
//   #/kit             -> @rave-page/ui showcase (KitShowcase)
//   #/dev/ravepage    -> rave.page dev panel (RavepageDevPanel, keeps rp-* testids)
//   #/dev/vrcpop      -> vrcpop dev panel
//   #/dev/vrctl       -> vrc.tl dev panel
// event-bridge is platform-neutral: the Overview is the product; the dev panels
// are per-platform developer tools reachable from the footer.
import { useCallback, useEffect, useState } from 'react';
import { BUILD_ID } from '../../shared/build-id';
import { isBridgeError } from '../../core/errors';
import { asIanaZone, asIsoUtc } from '../../core/time';
import type { EventCore } from '../../core/schema';
import { getSettings } from '../../runtime/settings';
import { ravepageAdapter, runPlan } from '../../adapters/ravepage/adapter';
import { connect, disconnect, whoAmI } from '../../adapters/ravepage/auth';
import type { ConnectionStatus, OwnClub } from '../../adapters/types';
import Overview from './views/Overview';
import KitShowcase from './views/KitShowcase';
import { VrcpopDevPanel } from './dev/VrcpopDevPanel';
import { VrctlDevPanel } from './dev/VrctlDevPanel';

function errMessage(e: unknown): string {
  if (isBridgeError(e)) return `${e.code}: ${e.message}`;
  return e instanceof Error ? e.message : String(e);
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

// Developer tool for manual + e2e checks against development.rave.page. Reachable
// at #/dev/ravepage (not the default route) — rave.page is one integration of
// three, not the product's home.
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
      .catch((e) => setError(errMessage(e)))
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
      <p className="text-2xs text-muted-foreground mb-3">build {BUILD_ID} · development.rave.page manual + e2e checks</p>

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

// Footer nav: "Overview · Developer: rave.page · vrcpop · vrc.tl · Kit".
const NAV: { hash: string; label: string }[] = [
  { hash: '#/', label: 'Overview' },
  { hash: '#/dev/ravepage', label: 'rave.page' },
  { hash: '#/dev/vrcpop', label: 'vrcpop' },
  { hash: '#/dev/vrctl', label: 'vrc.tl' },
  { hash: '#/kit', label: 'Kit' },
];

function FooterNav({ route }: { route: string }) {
  return (
    <nav data-testid="footer-nav" className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 border-t border-border bg-card text-2xs text-muted-foreground">
      {NAV.map((n, i) => {
        const active = `#${route}` === n.hash;
        return (
          <span key={n.hash} className="flex items-center gap-2">
            {i === 1 && <span>Developer:</span>}
            <a
              href={n.hash}
              data-testid={`nav-${n.label}`}
              className={`underline-offset-2 hover:underline ${active ? 'text-foreground' : 'hover:text-foreground'}`}
            >
              {n.label}
            </a>
            {i < NAV.length - 1 && <span aria-hidden="true">·</span>}
          </span>
        );
      })}
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

export function App() {
  const route = useHashRoute().replace(/^#/, '') || '/';
  const view =
    route === '/kit' ? (
      <KitShowcase />
    ) : route === '/dev/ravepage' ? (
      <RavepageDevPanel />
    ) : route === '/dev/vrcpop' ? (
      <VrcpopDevPanel />
    ) : route === '/dev/vrctl' ? (
      <VrctlDevPanel />
    ) : (
      <Overview />
    );
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">{view}</div>
      <FooterNav route={route} />
    </div>
  );
}
