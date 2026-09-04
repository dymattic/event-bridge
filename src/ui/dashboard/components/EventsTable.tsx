// The own-events table (kit DataTable + a mobile card renderer). Rich, resolved
// rows: platform badge, title, local start (zone tooltip when known), club name,
// status + visibility badges, and safe row actions (Open on platform, View,
// Delete). No raw id is ever a cell's text.
import { Button, DataTable, type Column } from '@rave-page/ui';
import type { EventRow } from '../../lib/event-filters';
import { formatLocalDateTime, formatRelativeDay } from '../../lib/format';
import { PlatformBadge } from './PlatformBadge';
import { StatusBadge } from './StatusBadge';

export interface EventsTableProps {
  rows: EventRow[];
  onOpen: (row: EventRow) => void;
  onView: (row: EventRow) => void;
  onDelete: (row: EventRow) => void;
  emptyMessage?: string;
}

function StartCell({ row }: { row: EventRow }): React.JSX.Element {
  const text = formatLocalDateTime(row.start, row.zone);
  return (
    <span title={row.zone ? `Event zone: ${row.zone}` : undefined} className="whitespace-nowrap">
      {text || '—'}
      {row.start && <span className="block text-2xs text-muted-foreground">{formatRelativeDay(row.start)}</span>}
    </span>
  );
}

function Actions({ row, onOpen, onView, onDelete }: { row: EventRow } & Pick<EventsTableProps, 'onOpen' | 'onView' | 'onDelete'>): React.JSX.Element {
  const stop = (fn: () => void) => (e: React.MouseEvent): void => {
    e.stopPropagation();
    fn();
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button type="button" size="sm" variant="explore" data-testid={`event-open-${row.platform}-${row.id}`} onClick={stop(() => onOpen(row))}>
        Open
      </Button>
      <Button type="button" size="sm" variant="outline" data-testid={`event-view-${row.platform}-${row.id}`} onClick={stop(() => onView(row))}>
        View
      </Button>
      <Button type="button" size="sm" variant="destructive" data-testid={`event-delete-${row.platform}-${row.id}`} onClick={stop(() => onDelete(row))}>
        Delete
      </Button>
    </div>
  );
}

export function EventsTable({ rows, onOpen, onView, onDelete, emptyMessage }: EventsTableProps): React.JSX.Element {
  const columns: Column<EventRow>[] = [
    { header: 'Platform', accessor: (r) => <PlatformBadge platform={r.platform} /> },
    { header: 'Event', accessor: (r) => <span className="font-medium text-foreground">{r.title}</span> },
    { header: 'Start', accessor: (r) => <StartCell row={r} /> },
    { header: 'Club', accessor: (r) => r.clubName },
    { header: 'Status', accessor: (r) => <StatusBadge value={r.status} /> },
    { header: 'Visibility', accessor: (r) => <StatusBadge value={r.visibility} />, mobileHidden: true },
    { header: '', accessor: (r) => <Actions row={r} onOpen={onOpen} onView={onView} onDelete={onDelete} />, className: 'text-right' },
  ];

  return (
    <div data-testid="events-table">
      <DataTable
        data={rows}
        columns={columns}
        keyExtractor={(r) => `${r.platform}:${r.id}`}
        onRowClick={onView}
        emptyMessage={emptyMessage ?? 'No events match these filters.'}
        renderMobileCard={(r) => (
          <div className="flex flex-col gap-2" data-testid={`event-card-${r.platform}-${r.id}`}>
            <div className="flex items-center justify-between gap-2">
              <PlatformBadge platform={r.platform} />
              <StatusBadge value={r.status} />
            </div>
            <div className="font-medium text-foreground">{r.title}</div>
            <div className="text-2xs text-muted-foreground">{r.clubName}</div>
            <StartCell row={r} />
            <Actions row={r} onOpen={onOpen} onView={onView} onDelete={onDelete} />
          </div>
        )}
      />
    </div>
  );
}
