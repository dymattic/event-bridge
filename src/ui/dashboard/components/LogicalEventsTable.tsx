// Unified events table: one row per LOGICAL event, a column per enabled platform.
// A present cell links to that platform's detail (+ status/visibility badges); a
// missing-but-connected cell offers Transfer (edit the source with an extra create
// target); a missing-not-connected cell is a muted "—". Row actions: Edit (first
// present cell) and Unlink (only for a linked row). No raw id is a cell's text.
import { Button, DataTable, type Column } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import type { EventRow } from '../../lib/event-filters';
import type { LogicalEvent } from '../../lib/event-match';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { formatLocalDateTime, formatRelativeDay } from '../../lib/format';
import { StatusBadge } from './StatusBadge';

export interface LogicalEventsTableProps {
  rows: LogicalEvent[];
  platforms: Platform[]; // enabled columns
  connected: Platform[]; // connected -> Transfer vs "Not connected"
  onView: (platform: Platform, id: string) => void;
  onEdit: (le: LogicalEvent) => void;
  onUnlink: (le: LogicalEvent) => void;
}

function firstCell(le: LogicalEvent): EventRow | undefined {
  for (const p of PLATFORM_ORDER) {
    const c = le.cells[p];
    if (c) return c;
  }
  return undefined;
}

function StartCell({ le }: { le: LogicalEvent }): React.JSX.Element {
  const zone = firstCell(le)?.zone;
  const text = formatLocalDateTime(le.start, zone);
  return (
    <span title={zone ? `Event zone: ${zone}` : undefined} className="whitespace-nowrap">
      {text || '—'}
      {le.start && <span className="block text-2xs text-muted-foreground">{formatRelativeDay(le.start)}</span>}
    </span>
  );
}

function PlatformCell({
  le,
  p,
  connected,
  onView,
}: {
  le: LogicalEvent;
  p: Platform;
  connected: boolean;
  onView: LogicalEventsTableProps['onView'];
}): React.JSX.Element {
  const cell = le.cells[p];
  if (cell) {
    return (
      <button
        type="button"
        data-testid={`cell-${p}-${le.key}`}
        className="flex flex-wrap items-center gap-1 underline-offset-2 hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          onView(p, cell.id);
        }}
      >
        <StatusBadge value={cell.status} />
        {cell.visibility && cell.visibility !== cell.status && <StatusBadge value={cell.visibility} />}
        {!cell.status && !cell.visibility && <span className="text-2xs text-brand-mint">on {PLATFORM_NAME[p]}</span>}
      </button>
    );
  }
  const src = firstCell(le);
  if (connected && src) {
    const href = `#/events/${src.platform}/${src.id}/edit?targets=${p}`;
    return (
      <Button asChild type="button" size="sm" variant="explore" data-testid={`cell-transfer-${p}`}>
        <a href={href} onClick={(e) => e.stopPropagation()}>
          Transfer
        </a>
      </Button>
    );
  }
  return (
    <span data-testid={`cell-none-${p}`} title="Not connected" className="text-muted-foreground">
      —
    </span>
  );
}

function RowActions({
  le,
  onEdit,
  onUnlink,
}: {
  le: LogicalEvent;
} & Pick<LogicalEventsTableProps, 'onEdit' | 'onUnlink'>): React.JSX.Element {
  const stop = (fn: () => void) => (e: React.MouseEvent): void => {
    e.stopPropagation();
    fn();
  };
  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <Button type="button" size="sm" variant="outline" data-testid="row-edit" onClick={stop(() => onEdit(le))}>
        Edit
      </Button>
      {le.linkId && (
        <Button type="button" size="sm" variant="outline" data-testid="row-unlink" onClick={stop(() => onUnlink(le))}>
          Unlink
        </Button>
      )}
    </div>
  );
}

export function LogicalEventsTable({ rows, platforms, connected, onView, onEdit, onUnlink }: LogicalEventsTableProps): React.JSX.Element {
  const cols = PLATFORM_ORDER.filter((p) => platforms.includes(p));
  const columns: Column<LogicalEvent>[] = [
    { header: 'Event', accessor: (le) => <span className="font-medium text-foreground">{le.title}</span> },
    { header: 'Start', accessor: (le) => <StartCell le={le} /> },
    { header: 'Club', accessor: (le) => le.clubName },
    ...cols.map(
      (p): Column<LogicalEvent> => ({
        header: PLATFORM_NAME[p],
        accessor: (le) => <PlatformCell le={le} p={p} connected={connected.includes(p)} onView={onView} />,
      }),
    ),
    { header: '', accessor: (le) => <RowActions le={le} onEdit={onEdit} onUnlink={onUnlink} />, className: 'text-right' },
  ];

  const rowClick = (le: LogicalEvent): void => {
    const src = firstCell(le);
    if (src) onView(src.platform, src.id);
  };

  return (
    <div data-testid="events-table">
      <DataTable
        data={rows}
        columns={columns}
        keyExtractor={(le) => le.key}
        onRowClick={rowClick}
        emptyMessage="No events match these filters."
        renderMobileCard={(le) => (
          <div className="flex flex-col gap-2" data-testid={`event-card-${le.key}`}>
            <div className="font-medium text-foreground">{le.title}</div>
            <div className="text-2xs text-muted-foreground">{le.clubName}</div>
            <StartCell le={le} />
            <div className="flex flex-col gap-1">
              {cols.map((p) => (
                <div key={p} className="flex items-center justify-between gap-2">
                  <span className="text-2xs text-muted-foreground">{PLATFORM_NAME[p]}</span>
                  <PlatformCell le={le} p={p} connected={connected.includes(p)} onView={onView} />
                </div>
              ))}
            </div>
            <RowActions le={le} onEdit={onEdit} onUnlink={onUnlink} />
          </div>
        )}
      />
    </div>
  );
}
