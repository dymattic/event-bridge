// #/events — ONE ROW PER LOGICAL EVENT across platforms. Loads own clubs -> own
// events per connected platform, groups them into logical events by cross-platform
// EventLinks + club anchors, and renders a kit DataTable with a cell per platform
// (present -> detail link; missing+connected -> Transfer; missing -> "—"). Unlinked
// look-alikes surface as "probably the same event" suggestions above the table.
// Filters (incl. "missing on a platform") stay URL-synced for shareable views.
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardContent, EmptyState, LoadingSpinner } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { connect } from '../../../adapters/ravepage/auth';
import { ensureAgent } from '../../../runtime/tabs';
import { enabledPlatforms, getSettings, onSettingsChange, type Settings } from '../../../runtime/settings';
import { listLinks, makeLink, removeLink, saveLink, type EventLink, type EventRef } from '../../../runtime/link-store';
import { listClubLinks } from '../../../runtime/club-links';
import { dismissSuggestion, listDismissed } from '../../../runtime/dismissals';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { formatLocalDateTime } from '../../lib/format';
import { invalidate, useResource } from '../../lib/resource';
import {
  distinctStatuses,
  filtersToQuery,
  inTimeScope,
  queryToFilters,
  type EventFilterState,
  type EventRow,
} from '../../lib/event-filters';
import type { SyncAssessment } from '../../lib/sync-plan';
import { anchorLookup, buildClubAnchors, type AnchorClub } from '../../lib/club-anchors';
import { filterLogical, groupLogicalEvents, type LogicalEvent, type Suggestion } from '../../lib/event-match';
import { loadConnections, loadPlatformData } from '../lib/event-data';
import { runSyncPass, type AssessedLink } from '../lib/sync';
import { EventFilters } from '../components/EventFilters';
import { LogicalEventsTable } from '../components/LogicalEventsTable';
import { SyncSheet } from '../components/SyncSheet';
import type { ClubRef } from '../components/ClubPicker';

function goto(hash: string): void {
  if (typeof window !== 'undefined') window.location.hash = hash;
}

export default function Events({ query }: { query: string }): React.JSX.Element {
  const filters = queryToFilters(query);
  const setFilters = (next: EventFilterState): void => {
    const q = filtersToQuery(next);
    goto(q ? `#/events?${q}` : '#/events');
  };

  const [enabled, setEnabled] = useState<Platform[]>(['vrctl', 'vrcpop']);
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    void getSettings().then((s) => {
      setEnabled(enabledPlatforms(s));
      setSettings(s);
    });
    return onSettingsChange((s) => {
      setEnabled(enabledPlatforms(s));
      setSettings(s);
    });
  }, []);
  const [syncLe, setSyncLe] = useState<LogicalEvent | null>(null);

  const conns = useResource('connections', loadConnections);
  const c = conns.data;
  const vt = useResource(c?.vrctl.connected ? 'platform:vrctl' : null, () => loadPlatformData('vrctl'));
  const vp = useResource(c?.vrcpop.connected ? 'platform:vrcpop' : null, () => loadPlatformData('vrcpop'));
  const rp = useResource(enabled.includes('ravepage') && c?.ravepage.connected ? 'platform:ravepage' : null, () => loadPlatformData('ravepage'));
  const links = useResource('links', listLinks);
  const clubLinks = useResource('clubLinks', listClubLinks);
  const dismissed = useResource('dismissed', listDismissed);

  const refresh = useCallback(() => {
    conns.refresh();
    vt.refresh();
    vp.refresh();
    rp.refresh();
    links.refresh();
    clubLinks.refresh();
    dismissed.refresh();
    invalidate('sync:pass'); // re-assess (+ apply-mode writes) on an explicit Refresh
  }, [conns, vt, vp, rp, links, clubLinks, dismissed]);

  const dataOf = (p: Platform) => (p === 'vrctl' ? vt : p === 'vrcpop' ? vp : rp);
  const rows: EventRow[] = [vt.data, vp.data, rp.data].flatMap((d) => d?.events ?? []);
  const clubRefs: ClubRef[] = PLATFORM_ORDER.flatMap((p) =>
    (dataOf(p).data?.clubs ?? []).map((cl) => ({ id: cl.id, name: cl.name, platform: p })),
  );

  const connectedPlatforms: Platform[] = enabled.filter((p) => c?.[p].connected);
  const anyConnected = connectedPlatforms.length > 0;
  const anyLoading = vt.loading || vp.loading || rp.loading;

  const clubsByPlatform: Partial<Record<Platform, AnchorClub[]>> = {};
  for (const p of enabled) clubsByPlatform[p] = dataOf(p).data?.clubs ?? [];
  const anchors = buildClubAnchors(clubsByPlatform, clubLinks.data ?? []);
  const anchorOf = anchorLookup(anchors);
  // Past events are out of scope by default: only rows in the current time filter
  // feed the matcher (suggestions) and the sync pass. time=all/past opts back in.
  const now = Date.now();
  const scopedRows = rows.filter((r) => inTimeScope(r, filters.time, now));
  const { logical, suggestions } = groupLogicalEvents({
    rows: scopedRows,
    links: links.data ?? [],
    anchorOf,
    dismissed: dismissed.data ?? [],
    now,
  });
  const visible = filterLogical(logical, filters, connectedPlatforms);

  // Sync pass: assess (and, for apply-mode links, apply) the in-scope linked
  // events. Runs only on Events load / Refresh (a resource) — never on a timer.
  const passAnchorIds = logical.map((le) => le.linkId).filter((v): v is string => !!v);
  const passReady = !!conns.data && !!links.data && !!settings && !anyLoading;
  const pass = useResource<Record<string, AssessedLink>>(
    passReady ? `sync:pass:${filters.time}` : null,
    () => runSyncPass(passAnchorIds, connectedPlatforms),
  );
  const assessments: Record<string, SyncAssessment> = {};
  for (const [anchorId, a] of Object.entries(pass.data ?? {})) assessments[anchorId] = a.assessment;

  const onSyncChanged = useCallback(() => {
    links.refresh();
    invalidate('sync:pass');
    invalidate('event:');
  }, [links]);
  const syncLink: EventLink | undefined = syncLe?.linkId ? (links.data ?? []).find((l) => l.anchorId === syncLe.linkId) : undefined;

  // Hint to link clubs when >=2 connected platforms each own a still-single-platform club.
  const unlinkedPlatforms = connectedPlatforms.filter((p) =>
    anchors.some((a) => a.members[p] && Object.keys(a.members).length === 1),
  );
  const showClubsHint = unlinkedPlatforms.length >= 2;

  const onView = (platform: Platform, id: string): void => goto(`#/events/${platform}/${id}`);
  const onEdit = (le: LogicalEvent): void => {
    for (const p of PLATFORM_ORDER) {
      const cell = le.cells[p];
      if (cell) {
        goto(`#/events/${cell.platform}/${cell.id}/edit`);
        return;
      }
    }
  };
  const onUnlink = (le: LogicalEvent): void => {
    if (!le.linkId) return;
    void removeLink(le.linkId).then(() => links.refresh());
  };
  const onLinkSuggestion = (s: Suggestion): void => {
    const refs: EventRef[] = s.rows.map((r) => ({ platform: r.platform, id: r.id }));
    // A new link inherits the settings sync defaults.
    void saveLink({ ...makeLink(refs), sync: settings?.sync }).then(() => {
      links.refresh();
      invalidate('sync:pass');
    });
  };
  const onDismissSuggestion = (s: Suggestion): void => {
    void dismissSuggestion(s.key).then(() => dismissed.refresh());
  };

  const errors = [conns.error, vt.error, vp.error, rp.error, links.error, clubLinks.error].filter((e): e is Error => !!e);

  return (
    <main className="p-4 bg-background min-h-screen">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Your events across every connected platform, one row each.</p>
        </div>
        <div className="flex gap-2">
          <Button
            asChild={anyConnected}
            type="button"
            variant="outline"
            data-testid="events-new"
            disabled={!anyConnected}
            tooltip={anyConnected ? undefined : 'Connect a platform to create events.'}
          >
            {anyConnected ? <a href="#/events/new">New event</a> : <span>New event</span>}
          </Button>
          <Button type="button" variant="outline" data-testid="events-refresh" disabled={anyLoading} onClick={refresh}>
            {anyLoading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </header>

      {!conns.data ? (
        <div data-testid="events-loading" className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner /> Checking your sessions…
        </div>
      ) : !anyConnected ? (
        <EmptyState
          data-testid="events-none-connected"
          headingLevel="h2"
          title="Connect a platform to see your events"
          description="event-bridge lists your own clubs and events once you sign in — no platform is required to use the others."
          action={
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {enabled.map((p) => (
                <ConnectRow key={p} platform={p} connected={c?.[p].connected ?? false} onChanged={refresh} />
              ))}
            </div>
          }
        />
      ) : (
        <>
          {showClubsHint && (
            <p data-testid="clubs-hint" className="text-2xs text-muted-foreground mb-3">
              Some clubs aren’t linked across platforms.{' '}
              <a href="#/clubs" className="text-brand-mint underline-offset-2 hover:underline">
                Link them in Clubs
              </a>{' '}
              so their events share a row.
            </p>
          )}

          {suggestions.length > 0 && (
            <SuggestionList suggestions={suggestions} onLink={onLinkSuggestion} onDismiss={onDismissSuggestion} />
          )}

          <div className="mb-4">
            <EventFilters
              filters={filters}
              onChange={setFilters}
              platforms={connectedPlatforms}
              clubs={clubRefs}
              statuses={distinctStatuses(rows)}
            />
          </div>

          {logical.length === 0 && !anyLoading ? (
            <EmptyState
              data-testid="events-empty"
              headingLevel="h2"
              title="No events yet"
              description="Your connected clubs have no events yet. Create your first one."
              action={
                <Button asChild type="button" variant="outline" data-testid="events-empty-new">
                  <a href="#/events/new">New event</a>
                </Button>
              }
            />
          ) : (
            <>
              {anyLoading && (
                <p data-testid="events-partial" className="text-2xs text-muted-foreground mb-2">
                  Loading more…
                </p>
              )}
              <p data-testid="events-count" className="text-2xs text-muted-foreground mb-2">
                {visible.length} event{visible.length === 1 ? '' : 's'}
              </p>
              <LogicalEventsTable
                rows={visible}
                platforms={enabled}
                connected={connectedPlatforms}
                onView={onView}
                onEdit={onEdit}
                onUnlink={onUnlink}
                assessments={assessments}
                onOpenSync={setSyncLe}
              />
            </>
          )}
        </>
      )}

      {errors.length > 0 && (
        <p data-testid="events-error" className="text-2xs text-brand-base mt-3">
          {errors.map((e) => e.message).join(' · ')}
        </p>
      )}

      {syncLe && syncLink && settings && (
        <SyncSheet
          link={syncLink}
          settings={settings}
          connected={connectedPlatforms}
          initialAssessed={pass.data?.[syncLink.anchorId]}
          onClose={() => setSyncLe(null)}
          onChanged={onSyncChanged}
        />
      )}
    </main>
  );
}

function SuggestionList({
  suggestions,
  onLink,
  onDismiss,
}: {
  suggestions: Suggestion[];
  onLink: (s: Suggestion) => void;
  onDismiss: (s: Suggestion) => void;
}): React.JSX.Element {
  return (
    <section data-testid="suggestions" className="mb-4 flex flex-col gap-2">
      <h2 className="text-sm font-medium text-foreground">Probably the same event</h2>
      {suggestions.map((s) => (
        <Card key={s.key} data-testid={`suggestion-${s.key}`} className="border-dashed">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex flex-col gap-1">
              {s.rows.map((r) => (
                <div key={`${r.platform}:${r.id}`} className="text-2xs text-muted-foreground">
                  <span className="text-foreground">{r.title}</span> · {PLATFORM_NAME[r.platform]}
                  {r.start ? ` · ${formatLocalDateTime(r.start, r.zone)}` : ''}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" data-testid="suggest-link" onClick={() => onLink(s)}>
                Link
              </Button>
              <Button type="button" size="sm" variant="outline" data-testid="suggest-dismiss" onClick={() => onDismiss(s)}>
                Not the same
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function ConnectRow({ platform, connected, onChanged }: { platform: Platform; connected: boolean; onChanged: () => void }): React.JSX.Element {
  const [busy, setBusy] = useState(false);
  const act = (fn: () => Promise<unknown>) => (): void => {
    setBusy(true);
    void fn()
      .catch(() => undefined)
      .finally(() => {
        setBusy(false);
        onChanged();
      });
  };
  const onConnect =
    platform === 'ravepage'
      ? act(() => connect())
      : act(() => ensureAgent(platform, { allowOpen: true, active: true }));
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
      <span className="text-sm text-foreground">{PLATFORM_NAME[platform]}</span>
      {connected ? (
        <span className="text-2xs text-brand-mint">Connected</span>
      ) : (
        <Button type="button" size="sm" data-testid={`events-connect-${platform}`} disabled={busy} onClick={onConnect}>
          {platform === 'ravepage' ? 'Connect' : `Open ${PLATFORM_NAME[platform]}`}
        </Button>
      )}
    </div>
  );
}
