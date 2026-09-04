// Controlled filter bar for the events table. All kit primitives: SmartSelect
// (platform/club/status, searchable), Tabs (time), DatePicker (range), Input
// (debounced search over title + club).
import { useEffect, useState } from 'react';
import { DatePicker, Input, SmartSelect, Tabs, TabsList, TabsTrigger, type SmartSelectOption } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import type { EventFilterState, TimeFilter } from '../../lib/event-filters';
import { ClubPicker, type ClubRef } from './ClubPicker';

const TIMES: { id: TimeFilter; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'all', label: 'All' },
];

export function EventFilters({
  filters,
  onChange,
  platforms,
  clubs,
  statuses,
}: {
  filters: EventFilterState;
  onChange: (next: EventFilterState) => void;
  platforms: Platform[];
  clubs: ClubRef[];
  statuses: string[];
}): React.JSX.Element {
  const set = (patch: Partial<EventFilterState>): void => onChange({ ...filters, ...patch });

  // Debounced search: local text state pushed to the filter after a pause.
  const [q, setQ] = useState(filters.q);
  useEffect(() => setQ(filters.q), [filters.q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== filters.q) onChange({ ...filters, q });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const platformOptions: SmartSelectOption[] = PLATFORM_ORDER.filter((p) => platforms.includes(p)).map((p) => ({
    value: p,
    label: PLATFORM_NAME[p],
  }));
  const statusOptions: SmartSelectOption[] = statuses.map((s) => ({ value: s, label: s }));

  return (
    <section data-testid="events-filters" className="flex flex-col gap-3">
      <Input
        type="search"
        data-testid="events-search"
        aria-label="Search events"
        placeholder="Search title or club…"
        value={q}
        onChange={(e) => setQ(e.currentTarget.value)}
      />

      <Tabs value={filters.time} onValueChange={(v) => set({ time: v as TimeFilter })}>
        <TabsList variant="pill" data-testid="events-time">
          {TIMES.map((t) => (
            <TabsTrigger key={t.id} value={t.id} data-testid={`events-time-${t.id}`}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div data-testid="events-filter-platform">
          <SmartSelect
            label="Platform"
            isMulti
            allowSearch={false}
            options={platformOptions}
            value={filters.platforms}
            placeholder="All platforms"
            onChange={(v) => set({ platforms: (Array.isArray(v) ? v : v ? [v] : []) as Platform[] })}
          />
        </div>

        <ClubPicker clubs={clubs} value={filters.clubIds} onChange={(ids) => set({ clubIds: ids })} />

        <div data-testid="events-filter-status">
          <SmartSelect
            label="Status"
            isMulti
            allowSearch={false}
            options={statusOptions}
            value={filters.statuses}
            placeholder="Any status"
            onChange={(v) => set({ statuses: Array.isArray(v) ? v : v ? [v] : [] })}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 max-w-md">
        <div>
          <span className="block text-xs font-medium text-muted-foreground mb-1">From</span>
          <DatePicker value={filters.from ?? ''} onChange={(d) => set({ from: d || undefined })} placeholder="Any date" aria-label="From date" />
        </div>
        <div>
          <span className="block text-xs font-medium text-muted-foreground mb-1">To</span>
          <DatePicker value={filters.to ?? ''} onChange={(d) => set({ to: d || undefined })} placeholder="Any date" aria-label="To date" />
        </div>
      </div>
    </section>
  );
}
