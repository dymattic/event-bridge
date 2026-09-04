// #/clubs — link the same real club across platforms. One row per club anchor;
// a cell per enabled platform shows the member (name + "same VRChat group" hint,
// or an Unlink for a stored link) or a "Link a club…" picker of that platform's
// clubs. Links live in extension storage (`clubLinks`) and re-group #/events via
// the shared `clubLinks`/`platform:` resource keys.
import { useEffect, useState } from 'react';
import { Button, DataTable, EmptyState, LoadingSpinner, SmartSelect, type Column, type SmartSelectOption } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { enabledPlatforms, getSettings, onSettingsChange } from '../../../runtime/settings';
import { listClubLinks, removeClubMember, saveClubLink } from '../../../runtime/club-links';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { invalidate, useResource } from '../../lib/resource';
import { buildClubAnchors, type AnchorClub, type ClubAnchor } from '../../lib/club-anchors';
import { loadConnections, loadPlatformData } from '../lib/event-data';

export default function Clubs(): React.JSX.Element {
  const [enabled, setEnabled] = useState<Platform[]>(['vrctl', 'vrcpop']);
  useEffect(() => {
    void getSettings().then((s) => setEnabled(enabledPlatforms(s)));
    return onSettingsChange((s) => setEnabled(enabledPlatforms(s)));
  }, []);

  const conns = useResource('connections', loadConnections);
  const c = conns.data;
  const vt = useResource(c?.vrctl.connected ? 'platform:vrctl' : null, () => loadPlatformData('vrctl'));
  const vp = useResource(c?.vrcpop.connected ? 'platform:vrcpop' : null, () => loadPlatformData('vrcpop'));
  const rp = useResource(enabled.includes('ravepage') && c?.ravepage.connected ? 'platform:ravepage' : null, () => loadPlatformData('ravepage'));
  const links = useResource('clubLinks', listClubLinks);

  const dataOf = (p: Platform) => (p === 'vrctl' ? vt : p === 'vrcpop' ? vp : rp);
  const clubsOf = (p: Platform): AnchorClub[] => dataOf(p).data?.clubs ?? [];
  const connectedPlatforms = enabled.filter((p) => c?.[p].connected);

  const clubsByPlatform: Partial<Record<Platform, AnchorClub[]>> = {};
  for (const p of enabled) clubsByPlatform[p] = clubsOf(p);
  const anchors = buildClubAnchors(clubsByPlatform, links.data ?? []);

  const anyLoading = vt.loading || vp.loading || rp.loading || links.loading;

  const refresh = (): void => {
    invalidate('clubLinks');
    invalidate('platform:');
    links.refresh();
    vt.refresh();
    vp.refresh();
    rp.refresh();
    conns.refresh();
  };

  const onLink = (anchor: ClubAnchor, p: Platform, clubId: string): void => {
    const club = clubsOf(p).find((cl) => cl.id === clubId);
    if (!club) return;
    const existing = (links.data ?? []).find((l) => l.anchorId === anchor.anchorId);
    const members = { ...(existing?.members ?? {}), [p]: { organizerId: clubId, name: club.name } };
    void saveClubLink({ anchorId: anchor.anchorId, members }).then(refresh);
  };
  const onUnlink = (anchor: ClubAnchor, p: Platform): void => {
    void removeClubMember(anchor.anchorId, p).then(refresh);
  };

  const cell = (anchor: ClubAnchor, p: Platform): React.JSX.Element => {
    const m = anchor.members[p];
    if (m) {
      return (
        <div className="flex flex-col gap-1" data-testid={`club-cell-${p}`}>
          <span className="text-foreground">{m.name}</span>
          {m.source === 'vrchatGroup' && <span className="text-2xs text-muted-foreground">same VRChat group</span>}
          {m.source === 'link' && (
            <Button type="button" size="sm" variant="outline" data-testid={`club-unlink-${p}`} onClick={() => onUnlink(anchor, p)}>
              Unlink
            </Button>
          )}
        </div>
      );
    }
    if (!connectedPlatforms.includes(p)) return <span className="text-muted-foreground">—</span>;
    const options: SmartSelectOption[] = clubsOf(p).map((cl) => ({ value: cl.id, label: cl.name }));
    if (options.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <div data-testid={`club-link-${p}`}>
        <SmartSelect
          label={`Link ${PLATFORM_NAME[p]}`}
          allowSearch
          options={options}
          value={null}
          placeholder="Link a club…"
          onChange={(v) => {
            if (typeof v === 'string' && v) onLink(anchor, p, v);
          }}
        />
      </div>
    );
  };

  const columns: Column<ClubAnchor>[] = [
    { header: 'Club', accessor: (a) => <span className="font-medium text-foreground">{a.name}</span> },
    ...PLATFORM_ORDER.filter((p) => enabled.includes(p)).map(
      (p): Column<ClubAnchor> => ({ header: PLATFORM_NAME[p], accessor: (a) => cell(a, p) }),
    ),
  ];

  return (
    <main className="p-4 bg-background min-h-screen">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-foreground">Clubs</h1>
          <p className="text-sm text-muted-foreground mt-1">Link the same club across platforms so its events line up in one row.</p>
        </div>
        <Button type="button" variant="outline" data-testid="clubs-refresh" disabled={anyLoading} onClick={refresh}>
          {anyLoading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </header>

      {!conns.data ? (
        <div data-testid="clubs-loading" className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner /> Checking your sessions…
        </div>
      ) : connectedPlatforms.length === 0 ? (
        <EmptyState
          data-testid="clubs-none-connected"
          headingLevel="h2"
          title="Connect a platform to see your clubs"
          description="event-bridge lists your own clubs once you sign in — link them here to group events across platforms."
          action={
            <Button asChild>
              <a href="#/events">Back to events</a>
            </Button>
          }
        />
      ) : (
        <div data-testid="clubs-table">
          <DataTable
            data={anchors}
            columns={columns}
            keyExtractor={(a) => a.anchorId}
            emptyMessage="No clubs yet on your connected platforms."
            renderMobileCard={(a) => (
              <div className="flex flex-col gap-2" data-testid={`club-card-${a.anchorId}`}>
                <div className="font-medium text-foreground">{a.name}</div>
                {PLATFORM_ORDER.filter((p) => enabled.includes(p)).map((p) => (
                  <div key={p} className="flex items-center justify-between gap-2">
                    <span className="text-2xs text-muted-foreground">{PLATFORM_NAME[p]}</span>
                    {cell(a, p)}
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      )}
    </main>
  );
}
