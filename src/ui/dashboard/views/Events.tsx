// #/events — the own-events management surface across all connected platforms.
// Loads own clubs -> own events per connected platform (platforms in parallel;
// each platform's reads paced in event-data), renders a searchable/filterable kit
// DataTable of resolved rows, and hosts the read-only detail links + delete flow.
// Filters are URL-synced in the hash query so filtered views are shareable.
import { useCallback, useEffect, useState } from 'react';
import { Button, EmptyState, LoadingSpinner } from '@rave-page/ui';
import { ext } from '../../../shared/webext';
import type { Platform } from '../../../shared/agent-protocol';
import { connect } from '../../../adapters/ravepage/auth';
import { ensureAgent } from '../../../runtime/tabs';
import { enabledPlatforms, getSettings, onSettingsChange } from '../../../runtime/settings';
import { PLATFORM_NAME, eventUrl } from '../../lib/platform-meta';
import { useResource } from '../../lib/resource';
import {
  DEFAULT_FILTERS,
  distinctStatuses,
  filterAndSort,
  filtersToQuery,
  queryToFilters,
  type EventFilterState,
  type EventRow,
} from '../../lib/event-filters';
import { loadConnections, loadPlatformData } from '../lib/event-data';
import { EventFilters } from '../components/EventFilters';
import { EventsTable } from '../components/EventsTable';
import { DeleteEventDialog, type DeleteTarget } from '../components/DeleteEventDialog';
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

  // rave.page appears only when the experimental toggle is on.
  const [enabled, setEnabled] = useState<Platform[]>(['vrctl', 'vrcpop']);
  useEffect(() => {
    void getSettings().then((s) => setEnabled(enabledPlatforms(s)));
    return onSettingsChange((s) => setEnabled(enabledPlatforms(s)));
  }, []);

  const conns = useResource('connections', loadConnections);
  const c = conns.data;
  const vt = useResource(c?.vrctl.connected ? 'platform:vrctl' : null, () => loadPlatformData('vrctl'));
  const vp = useResource(c?.vrcpop.connected ? 'platform:vrcpop' : null, () => loadPlatformData('vrcpop'));
  // rave.page data only when the toggle is on AND connected.
  const rp = useResource(enabled.includes('ravepage') && c?.ravepage.connected ? 'platform:ravepage' : null, () => loadPlatformData('ravepage'));

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const refresh = useCallback(() => {
    conns.refresh();
    vt.refresh();
    vp.refresh();
    rp.refresh();
  }, [conns, vt, vp, rp]);

  const rows: EventRow[] = [vt.data, vp.data, rp.data].flatMap((d) => d?.events ?? []);
  const clubRefs: ClubRef[] = [
    ...(vt.data?.clubs ?? []).map((cl) => ({ id: cl.id, name: cl.name, platform: 'vrctl' as const })),
    ...(vp.data?.clubs ?? []).map((cl) => ({ id: cl.id, name: cl.name, platform: 'vrcpop' as const })),
    ...(rp.data?.clubs ?? []).map((cl) => ({ id: cl.id, name: cl.name, platform: 'ravepage' as const })),
  ];
  const connectedPlatforms: Platform[] = enabled.filter((p) => c?.[p].connected);
  const anyConnected = connectedPlatforms.length > 0;
  const anyLoading = vt.loading || vp.loading || rp.loading;
  const visible = filterAndSort(rows, filters);

  const onOpen = (row: EventRow): void => {
    void eventUrl(row.platform, row.id, row.clubId).then((url) => ext.tabs.create({ url }));
  };
  const onView = (row: EventRow): void => goto(`#/events/${row.platform}/${row.id}`);
  const onDelete = (row: EventRow): void =>
    setDeleteTarget({ platform: row.platform, id: row.id, title: row.title, status: row.status, visibility: row.visibility });

  const errors = [conns.error, vt.error, vp.error, rp.error].filter((e): e is Error => !!e);

  return (
    <main className="p-4 bg-background min-h-screen">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Your own events across every connected platform.</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            data-testid="events-new"
            disabled
            tooltip="Creating events comes in the next step (P6.2)."
          >
            New event
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
          <div className="mb-4">
            <EventFilters
              filters={filters}
              onChange={setFilters}
              platforms={connectedPlatforms}
              clubs={clubRefs}
              statuses={distinctStatuses(rows)}
            />
          </div>

          {rows.length === 0 && !anyLoading ? (
            <EmptyState
              data-testid="events-empty"
              headingLevel="h2"
              title="No events yet"
              description="Your connected clubs have no events. Creating one arrives in the next step."
              action={
                <Button type="button" variant="outline" disabled tooltip="Creating events comes in the next step (P6.2).">
                  New event
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
              <EventsTable rows={visible} onOpen={onOpen} onView={onView} onDelete={onDelete} />
            </>
          )}
        </>
      )}

      {errors.length > 0 && (
        <p data-testid="events-error" className="text-2xs text-brand-base mt-3">
          {errors.map((e) => e.message).join(' · ')}
        </p>
      )}

      <DeleteEventDialog target={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={() => setDeleteTarget(null)} />
    </main>
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
