// #/events/:platform/:id — read-only, resolved event detail. readEvent -> a human
// view: title, badges, local times (with zone), organizer/club, description,
// poster, the resolved lineup (performer names, B2B grouped, VJ/dancers/hosts),
// flags, genres, links. Raw ids/extras live only inside the collapsed Details
// disclosure. Actions: Open on platform, Delete (confirm + preview), Edit disabled.
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, LoadingSpinner } from '@rave-page/ui';
import { ext } from '../../../shared/webext';
import type { Platform } from '../../../shared/agent-protocol';
import type { EventCore, Flags, Performer, Slot } from '../../../core/schema';
import { PLATFORM_NAME, eventUrl } from '../../lib/platform-meta';
import { formatLocalDateTime, formatLocalTime } from '../../lib/format';
import { useResource } from '../../lib/resource';
import { readEventCore } from '../lib/event-data';
import { PlatformBadge } from '../components/PlatformBadge';
import { StatusBadge } from '../components/StatusBadge';
import { DeleteEventDialog, type DeleteTarget } from '../components/DeleteEventDialog';
import { useState } from 'react';

function goto(hash: string): void {
  if (typeof window !== 'undefined') window.location.hash = hash;
}

function performerNames(list: Performer[]): string {
  return list.map((p) => p.name).filter(Boolean).join(' b2b ');
}

const FLAG_LABEL: Partial<Record<keyof Flags, string>> = {
  nsfw: 'NSFW',
  ageGated: 'Age gated',
  openDecks: 'Open decks',
  questCompatible: 'Quest compatible',
  avatarRestrictions: 'Avatar restrictions',
};

function flagBadges(flags: Flags): React.JSX.Element[] {
  const out: React.JSX.Element[] = [];
  for (const [k, label] of Object.entries(FLAG_LABEL) as [keyof Flags, string][]) {
    if (flags[k] === true) out.push(<Badge key={k} variant="info">{label}</Badge>);
  }
  if (flags.platforms?.length) out.push(<Badge key="platforms" variant="outline">{flags.platforms.join(', ')}</Badge>);
  if (flags.photosensitivity && flags.photosensitivity !== 'none') {
    out.push(<Badge key="photo" variant="warning">{`Photosensitivity: ${flags.photosensitivity}`}</Badge>);
  }
  return out;
}

function SlotRow({ slot, zone }: { slot: Slot; zone: string }): React.JSX.Element {
  const range = `${formatLocalTime(slot.start, zone)}${slot.end ? `–${formatLocalTime(slot.end, zone)}` : ''}`;
  const names = performerNames(slot.performers);
  return (
    <li data-testid="event-detail-slot" className="flex flex-col gap-0.5 rounded-md border border-border px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-2xs text-muted-foreground tabular-nums w-24 shrink-0">{range || '—'}</span>
        <span className="font-medium text-foreground">{names || slot.title || '—'}</span>
        {slot.performers.length > 1 && <Badge variant="info">B2B</Badge>}
      </div>
      {slot.vj && <span className="text-2xs text-muted-foreground pl-24">VJ: {slot.vj.name}</span>}
      {slot.dancers.length > 0 && <span className="text-2xs text-muted-foreground pl-24">Dancers: {slot.dancers.map((d) => d.name).join(', ')}</span>}
      {slot.genre && <span className="text-2xs text-muted-foreground pl-24">Genre: {slot.genre}</span>}
    </li>
  );
}

function Field({ label, value, testId }: { label: string; value?: React.ReactNode; testId?: string }): React.JSX.Element | null {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div data-testid={testId}>
      <dt className="text-2xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Detail({ platform, id, core }: { platform: Platform; id: string; core: EventCore }): React.JSX.Element {
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const zone = core.zone;
  const published = core.visibility.publish;
  const flags = flagBadges(core.flags);
  const links = Object.entries(core.links).filter(([, v]) => !!v) as [string, string][];
  const poster = core.poster?.kind === 'url' ? core.poster.url : undefined;

  const target: DeleteTarget = {
    platform,
    id,
    title: core.title,
    status: published ? 'published' : 'draft',
    visibility: core.visibility.audience,
  };

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="event-detail">
      <a href="#/events" data-testid="event-detail-back" className="text-2xs text-muted-foreground underline-offset-2 hover:underline">
        ← Back to events
      </a>

      <header className="mt-2 mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <PlatformBadge platform={platform} />
            <StatusBadge value={published ? 'published' : 'draft'} testId="event-detail-status" />
            <StatusBadge value={core.visibility.audience} testId="event-detail-visibility" />
          </div>
          <h1 data-testid="event-detail-title" className="font-orbitron text-2xl text-foreground">{core.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="explore" data-testid="event-detail-open" onClick={() => void eventUrl(platform, id, core.organizer.platformIds[platform] ?? core.organizer.vrchatGroupId).then((url) => ext.tabs.create({ url }))}>
            Open on {PLATFORM_NAME[platform]}
          </Button>
          <Button type="button" variant="outline" data-testid="event-detail-edit" disabled tooltip="Editing comes in the next step (P6.2).">
            Edit
          </Button>
          <Button type="button" variant="destructive" data-testid="event-detail-delete" onClick={() => setDeleting(target)}>
            Delete
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label="Organizer" value={core.organizer.name || undefined} testId="event-detail-organizer" />
              <Field label="Start" value={formatLocalDateTime(core.start, zone)} testId="event-detail-start" />
              <Field label="End" value={core.end ? formatLocalDateTime(core.end, zone) : undefined} />
              <Field label="Doors open" value={core.doorsOpen ? formatLocalDateTime(core.doorsOpen, zone) : undefined} />
              <Field label="Time zone" value={zone} />
              <Field label="Scene" value={core.music.sceneType} />
              <Field label="Energy" value={core.music.energy} />
            </dl>
            {core.description && (
              <div className="mt-4" data-testid="event-detail-description">
                <dt className="text-2xs uppercase tracking-wide text-muted-foreground">Description</dt>
                <p className="text-sm text-foreground whitespace-pre-wrap">{core.description}</p>
              </div>
            )}
            {flags.length > 0 && <div className="mt-4 flex flex-wrap gap-2" data-testid="event-detail-flags">{flags}</div>}
            {core.music.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2" data-testid="event-detail-genres">
                {core.music.genres.map((g) => (
                  <Badge key={g} variant="outline">{g}</Badge>
                ))}
              </div>
            )}
            {links.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1" data-testid="event-detail-links">
                {links.map(([k, v]) => (
                  <li key={k} className="text-2xs">
                    <span className="text-muted-foreground">{k}: </span>
                    <a href={v} target="_blank" rel="noreferrer" className="text-brand-violet-soft underline-offset-2 hover:underline break-all">{v}</a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {poster && (
            <Card>
              <CardHeader>
                <CardTitle>Poster</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={poster} alt="" data-testid="event-detail-poster" className="rounded-md w-full object-cover" />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Lineup</CardTitle>
            </CardHeader>
            <CardContent>
              {core.lineup.length === 0 ? (
                <p className="text-2xs text-muted-foreground">No lineup.</p>
              ) : (
                <ul className="flex flex-col gap-2" data-testid="event-detail-lineup">
                  {core.lineup.map((s) => (
                    <SlotRow key={s.order} slot={s} zone={zone} />
                  ))}
                </ul>
              )}
              {core.hosts.length > 0 && (
                <p className="mt-3 text-2xs text-muted-foreground" data-testid="event-detail-hosts">
                  Hosts: {core.hosts.map((h) => h.name).join(', ')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <details className="mt-4" data-testid="event-detail-raw">
        <summary className="cursor-pointer text-2xs text-muted-foreground">Details (raw ids / extras)</summary>
        <pre className="mt-2 max-h-80 overflow-auto rounded-md border border-border bg-card p-2 text-2xs whitespace-pre-wrap">
          {JSON.stringify({ id, platformIds: core.organizer.platformIds, extras: core.extras }, null, 2)}
        </pre>
      </details>

      <DeleteEventDialog
        target={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => goto('#/events')}
      />
    </main>
  );
}

export default function EventDetail({ platform, id }: { platform: Platform; id: string }): React.JSX.Element {
  const { data, error, loading } = useResource(`event:${platform}:${id}`, () => readEventCore(platform, id));

  if (data) return <Detail platform={platform} id={id} core={data} />;
  if (loading) {
    return (
      <main className="p-4 bg-background min-h-screen">
        <div data-testid="event-detail-loading" className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner /> Loading event…
        </div>
      </main>
    );
  }
  return (
    <main className="p-4 bg-background min-h-screen">
      <EmptyState
        data-testid="event-detail-error"
        headingLevel="h2"
        title="Couldn't load this event"
        description={error?.message ?? 'Unknown error.'}
        action={
          <a href="#/events" className="text-sm text-brand-violet-soft underline">
            Back to events
          </a>
        }
      />
    </main>
  );
}
