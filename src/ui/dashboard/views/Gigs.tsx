// #/gigs — "My gigs": upcoming events where one of the user's DJ names is on the
// lineup, across every ENABLED + CONNECTED platform. The user enters their
// name(s); event-bridge reads each platform's own performer profile / own clubs'
// events / own bookings ONCE when the view opens and again only on an explicit
// Refresh — NEVER on a timer or in the background (user rule + repo rule). The
// infinite-TTL useResource is what enforces load-once-per-key; there is NO
// setInterval/setTimeout re-fetch anywhere in this module. Rich UI, resolved
// names (no raw ids as a primary label). Grouped one row per logical event
// (groupGigs) with a link chip per platform, plus an ICS export.
import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  Input,
  LoadingSpinner,
  SmartSelect,
  useNotification,
  type Column,
  type SmartSelectOption,
} from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import type { GigGroup } from '../../../core/gigs';
import { groupGigs } from '../../../core/gigs';
import { buildIcs, type IcsMode } from '../../../core/ics';
import { enabledPlatforms, getSettings, onSettingsChange, setSettings, type Settings } from '../../../runtime/settings';
import { normalizeGigNames } from '../../lib/gig-names';
import { PLATFORM_NAME } from '../../lib/platform-meta';
import { formatLocalDate, formatLocalTime, formatRelativeDay } from '../../lib/format';
import { ravepageStatusView, tabStatusView } from '../../lib/status';
import { useResource } from '../../lib/resource';
import { ensureAgent } from '../../../runtime/tabs';
import { loadConnections, loadGigs, type GigsLoad, type PlatformConn } from '../lib/event-data';
import { downloadText } from '../lib/download';

const EXPORT_OPTIONS: SmartSelectOption[] = [
  { value: 'set', label: 'My set times' },
  { value: 'event', label: 'Whole event' },
];

const allPending = (g: GigGroup): boolean => g.gigs.every((x) => x.status === 'pending');

// Why a platform was NOT checked, in the SAME wording as the Overview status
// (tabStatusView / ravepageStatusView). Only called for a not-queried platform.
function notCheckedReason(p: Platform, conn: PlatformConn): string {
  if (p === 'ravepage') return ravepageStatusView(conn.connected, conn.label, conn.expiresAt).text;
  return tabStatusView({ state: conn.state ?? 'no-tab' }).text;
}

// "10:00 PM" or "10:00 PM–11:00 PM" (set times when known, else event start).
function whenTime(g: GigGroup): string {
  if (g.setStart) {
    const s = formatLocalTime(g.setStart);
    return g.setEnd ? `${s}–${formatLocalTime(g.setEnd)}` : s;
  }
  return formatLocalTime(g.start);
}

function WhenCell({ g }: { g: GigGroup }): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="text-foreground">
        {formatLocalDate(g.start)} · {whenTime(g)}
      </span>
      <span className="text-2xs text-muted-foreground">{formatRelativeDay(g.start)}</span>
    </div>
  );
}

function EventCell({ g }: { g: GigGroup }): React.JSX.Element {
  const first = g.gigs[0]!;
  return (
    <span className="inline-flex items-center gap-2">
      <a
        href={first.eventUrl}
        target="_blank"
        rel="noreferrer"
        data-testid="gigs-row-title"
        className="text-foreground underline-offset-2 hover:underline"
      >
        {g.title}
      </a>
      {allPending(g) && <Badge variant="warning">pending</Badge>}
    </span>
  );
}

function PlatformsCell({ g }: { g: GigGroup }): React.JSX.Element {
  return (
    <span className="flex flex-wrap gap-1">
      {g.gigs.map((gig) => (
        <a
          key={gig.platform}
          href={gig.eventUrl}
          target="_blank"
          rel="noreferrer"
          data-testid={`gigs-link-${gig.platform}`}
          className="no-underline"
        >
          <Badge variant={gig.status === 'pending' ? 'warning' : 'outline'}>{PLATFORM_NAME[gig.platform]}</Badge>
        </a>
      ))}
    </span>
  );
}

const COLUMNS: Column<GigGroup>[] = [
  { header: 'When', accessor: (g) => <WhenCell g={g} /> },
  { header: 'Event', accessor: (g) => <EventCell g={g} /> },
  { header: 'Club', accessor: (g) => g.clubName ?? '—' },
  { header: 'Platforms', accessor: (g) => <PlatformsCell g={g} /> },
  { header: 'Matched', accessor: (g) => <span className="text-2xs text-muted-foreground">{g.gigs[0]!.matchedName}</span> },
];

function MobileCard({ g }: { g: GigGroup }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <EventCell g={g} />
      <WhenCell g={g} />
      {g.clubName && <span className="text-sm text-muted-foreground">{g.clubName}</span>}
      <PlatformsCell g={g} />
      <span className="text-2xs text-muted-foreground">Matched {g.gigs[0]!.matchedName}</span>
    </div>
  );
}

export default function Gigs(): React.JSX.Element {
  const { addNotification } = useNotification();
  const [settings, setSettingsState] = useState<Settings | null>(null);
  const [enabled, setEnabled] = useState<Platform[]>(['vrctl', 'vrcpop']);
  const [nameInput, setNameInput] = useState('');
  const [exportMode, setExportMode] = useState<IcsMode>('set');
  const [opening, setOpening] = useState<Platform | null>(null);

  useEffect(() => {
    const apply = (s: Settings): void => {
      setSettingsState(s);
      setEnabled(enabledPlatforms(s));
    };
    void getSettings().then(apply);
    return onSettingsChange(apply);
  }, []);

  const names = settings?.gigs.names ?? [];

  const conns = useResource('connections', loadConnections);
  const c = conns.data;
  const queried: Platform[] = enabled.filter((p) => c?.[p]?.connected);
  const unchecked: Platform[] = c ? enabled.filter((p) => !queried.includes(p)) : [];
  const uncheckedNote =
    c && unchecked.length
      ? ` Not checked: ${unchecked.map((p) => `${PLATFORM_NAME[p]} (${notCheckedReason(p, c[p])})`).join(', ')}.`
      : '';

  // Infinite TTL = load once per (platforms × names) key; refresh() is the only
  // re-fetch. Empty names or nothing connected -> null key -> no load.
  const key = names.length && queried.length ? `gigs:${queried.join(',')}:${names.join('|')}` : null;
  const gigsRes = useResource<GigsLoad>(key, () => loadGigs(queried, names), { ttlMs: Number.POSITIVE_INFINITY });
  const load = gigsRes.data;
  const groups = load ? groupGigs(load.gigs) : [];
  const errorEntries = Object.entries(load?.errors ?? {}) as [Platform, string][];

  const persistNames = (next: string[]): void => {
    const normalized = normalizeGigNames(next);
    setSettingsState((s) => (s ? { ...s, gigs: { names: normalized } } : s)); // optimistic; storage.onChanged confirms
    void setSettings({ gigs: { names: normalized } });
  };
  const addName = (): void => {
    if (!nameInput.trim()) return;
    persistNames([...names, nameInput]);
    setNameInput('');
  };
  const removeName = (idx: number): void => persistNames(names.filter((_, i) => i !== idx));

  // Open a tab platform WITHOUT stealing focus (active:false), then reload the
  // connections resource. Once it reports connected, `queried` grows -> the gigs
  // key changes -> loadGigs re-runs automatically for that platform (no Refresh).
  const onOpen = (p: Platform): void => {
    setOpening(p);
    void ensureAgent(p, { allowOpen: true, active: false })
      .then(() => conns.refresh())
      .catch((e: unknown) => addNotification(e instanceof Error ? e.message : String(e), 'error'))
      .finally(() => setOpening(null));
  };

  const onExport = (): void => {
    if (groups.length === 0) return;
    const ics = buildIcs(groups, { mode: exportMode, now: new Date(), calName: 'My gigs (event-bridge)', platformNames: PLATFORM_NAME });
    downloadText('event-bridge-gigs.ics', 'text/calendar;charset=utf-8', ics);
    addNotification('Calendar exported', 'success');
  };

  const loadingFirst = gigsRes.loading && !load;

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="gigs">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-foreground">My gigs</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Upcoming events where your name is on the lineup, across your connected platforms. Loads when you open this page or press Refresh.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div data-testid="gigs-export-mode" className="min-w-40">
            <SmartSelect
              options={EXPORT_OPTIONS}
              value={exportMode}
              onChange={(v) => {
                if (typeof v === 'string') setExportMode(v as IcsMode);
              }}
              allowSearch={false}
            />
          </div>
          <Button type="button" variant="outline" data-testid="gigs-export" disabled={groups.length === 0} onClick={onExport}>
            Export .ics
          </Button>
          <Button type="button" variant="outline" data-testid="gigs-refresh" disabled={gigsRes.loading} onClick={gigsRes.refresh}>
            {gigsRes.loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </header>

      <Card data-testid="gigs-names" className="mb-4">
        <CardHeader>
          <CardTitle>Your DJ names</CardTitle>
          <CardDescription>Exact names as they appear on lineups (aliases welcome). Stored locally.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {names.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {names.map((n, i) => (
                <Badge key={n} variant="secondary" className="gap-1">
                  {n}
                  <button
                    type="button"
                    data-testid={`gigs-name-remove-${i}`}
                    aria-label={`Remove ${n}`}
                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                    onClick={() => removeName(i)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              data-testid="gigs-name-input"
              placeholder="e.g. DJ Example"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addName();
                }
              }}
              className="max-w-xs"
            />
            <Button type="button" data-testid="gigs-name-add" onClick={addName}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Per-platform "checked / not checked (why)" so a silently-skipped platform
          is visible and fixable from here (Open a tab / connect rave.page). */}
      {names.length > 0 && c && (
        <div data-testid="gigs-sources" className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-2xs uppercase tracking-wide text-muted-foreground">Sources</span>
          {enabled.map((p) => {
            const conn = c[p];
            const checked = queried.includes(p);
            return (
              <span key={p} data-testid={`gigs-source-${p}`} className="inline-flex items-center gap-1.5 text-sm">
                <span className="text-foreground">{PLATFORM_NAME[p]}</span>
                {checked ? (
                  <Badge variant="success">checked</Badge>
                ) : (
                  <>
                    <Badge variant="secondary">{notCheckedReason(p, conn)}</Badge>
                    {p !== 'ravepage' && conn.state === 'no-tab' && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        data-testid={`gigs-open-${p}`}
                        disabled={opening === p}
                        onClick={() => onOpen(p)}
                      >
                        {opening === p ? 'Opening…' : `Open ${PLATFORM_NAME[p]}`}
                      </Button>
                    )}
                    {p === 'ravepage' && !conn.connected && (
                      <Button asChild size="sm" variant="outline" data-testid="gigs-connect-ravepage">
                        <a href="#/settings">Connect in Settings</a>
                      </Button>
                    )}
                  </>
                )}
              </span>
            );
          })}
        </div>
      )}

      {names.length === 0 ? (
        <EmptyState
          data-testid="gigs-empty-names"
          headingLevel="h2"
          title="Add your DJ name to find your gigs"
          description="Enter the name(s) you perform under above. event-bridge checks each connected platform for upcoming events with that name on the lineup."
        />
      ) : queried.length === 0 ? (
        <EmptyState
          data-testid="gigs-none-connected"
          headingLevel="h2"
          title="Connect a platform to find your gigs"
          description="Sign in to a platform on the Overview — event-bridge looks up your gigs on the platforms you're connected to."
          action={
            <Button asChild variant="outline">
              <a href="#/">Go to Overview</a>
            </Button>
          }
        />
      ) : loadingFirst ? (
        <div data-testid="gigs-loading" className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner /> Looking for your gigs…
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          data-testid="gigs-empty"
          headingLevel="h2"
          title={`No upcoming gigs found for ${names.join(', ')}`}
          description={`Checked by name on ${queried.map((p) => PLATFORM_NAME[p]).join(', ')}. Nothing upcoming with your name on the lineup yet.${uncheckedNote}`}
        />
      ) : (
        <>
          {gigsRes.stale && (
            <p data-testid="gigs-stale" className="text-2xs text-muted-foreground mb-2">
              Refreshing…
            </p>
          )}
          <p data-testid="gigs-count" className="text-2xs text-muted-foreground mb-2">
            {groups.length} upcoming gig{groups.length === 1 ? '' : 's'}
          </p>
          <div data-testid="gigs-table">
            <DataTable
              data={groups}
              columns={COLUMNS}
              keyExtractor={(g) => g.key}
              renderMobileCard={(g) => <MobileCard g={g} />}
            />
          </div>
        </>
      )}

      {/* Per-platform error hints — shown under the table AND the empty state so a
          partial failure never hides the platforms that did load. */}
      {errorEntries.map(([p, msg]) => (
        <p key={p} data-testid={`gigs-error-${p}`} className="text-2xs text-brand-base mt-2">
          {PLATFORM_NAME[p]}: {msg}
        </p>
      ))}

      <p className="text-2xs text-muted-foreground mt-6 max-w-2xl">
        event-bridge reads your own performer profile (vrcpop.com), the public timeline and the events of clubs you manage (vrc.tl), your clubs&apos; events (vrcpop.com) and your bookings (rave.page) — once per refresh, nothing runs in the background.
      </p>
    </main>
  );
}
