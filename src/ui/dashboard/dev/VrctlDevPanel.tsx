// TODO(P6): rebuild on @rave-page/ui. Dev-only vrc.tl panel for the lead's
// read-only manual checks (own organizers, grid, detail parse, performer search,
// create preview). WRITES (run create / delete) are preview-first + gated behind
// an explicit "mock/dev only" confirm — the repo rule is NO test events on
// vrc.tl. Plain Tailwind token classes; self-contained. Wired into the dashboard
// hash router at #/dev/vrctl (App.tsx). Exposes nothing on window.
import { useCallback, useState } from 'react';
import { errorDebug } from '../../lib/error-copy';
import { asIanaZone, asIsoUtc } from '../../../core/time';
import type { EventCore } from '../../../core/schema';
import type { OwnClub, OwnEvent } from '../../../adapters/types';
import type { VrctlDetailForm } from '../../../core/mapping/vrctl-types';
import { asEventId } from '../../../adapters/vrctl/ids';
import { readEventForm } from '../../../adapters/vrctl/adapter';
import { vrctlAdapter, runPlan } from '../../../adapters/vrctl/platform';
import { withAgent } from '../lib/runtime-client';

const errMessage = (e: unknown): string => errorDebug(e);

// Minimal NSFW-tagged demo core so planCreate has the required flag.
function demoCore(club: OwnClub | undefined): EventCore {
  const start = asIsoUtc(new Date(Date.now() + 86_400_000).toISOString());
  return {
    title: '[event-bridge test] preview',
    start,
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: club?.name ?? '', platformIds: club ? { vrctl: club.id } : {} },
    lineup: [{ order: 1, start, performers: [{ name: 'Example DJ', aliases: [{ platform: 'vrctl', name: 'Example DJ' }] }], dancers: [] }],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'followers' },
    flags: { nsfw: false },
    music: { genres: [] },
    links: {},
    extras: {},
  };
}

function formSummary(f: VrctlDetailForm): string {
  const flags = Object.entries(f.selectedFlags).map(([k, v]) => `${k}=${v.join(',')}`).join(' ');
  const slots = f.slots.map((s) => `#${s.id}(${s.duration ?? '?'}m, ${s.performers.map((p) => p.label).join('+') || '—'})`).join(' ');
  return `${f.current.name ?? ''} · ${f.current.start ?? ''} ${f.current.timezone ?? ''} · published=${String(f.current.published)} · flags[${flags}] · slots ${slots || '—'}`;
}

const btn = 'min-h-11 px-4 rounded-md border border-border text-foreground bg-card disabled:opacity-50';

export function VrctlDevPanel() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clubs, setClubs] = useState<OwnClub[] | null>(null);
  const [events, setEvents] = useState<OwnEvent[] | null>(null);
  const [eventId, setEventId] = useState('');
  const [detail, setDetail] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);
  const [confirmWrite, setConfirmWrite] = useState(false);

  const run = useCallback(
    (fn: () => Promise<void>) => (): void => {
      setBusy(true);
      setError(null);
      void fn().catch((e) => setError(errMessage(e))).finally(() => setBusy(false));
    },
    [],
  );

  const onOrganizers = run(async () => setClubs(await vrctlAdapter.listOwnClubs()));
  const onGrid = run(async () => setEvents(await vrctlAdapter.listOwnEvents({ organizerType: 'group', organizerId: '' })));
  const onReadDetail = run(async () => {
    const form = await withAgent('vrctl', (a) => readEventForm((req) => a.call({ op: 'http', request: req }), asEventId(eventId)), { allowOpen: true });
    setDetail(formSummary(form));
  });
  const onPreviewCreate = run(async () => {
    const list = clubs ?? (await vrctlAdapter.listOwnClubs());
    if (!clubs) setClubs(list);
    const club = list[0];
    if (!club) throw new Error('no organizer');
    const plan = vrctlAdapter.planCreate(demoCore(club), { organizer: { organizerType: 'group', organizerId: club.id }, publish: false });
    const create = plan.steps[0]?.request as { fields?: [string, string][] } | undefined;
    setPreview((create?.fields ?? []).map(([k, v]) => `${k}=${v}`).concat(plan.steps.slice(1).map((s) => `· ${s.previewLabel}`)));
  });
  const onRunCreate = run(async () => {
    const list = clubs ?? (await vrctlAdapter.listOwnClubs());
    const club = list[0];
    if (!club) throw new Error('no organizer');
    const plan = vrctlAdapter.planCreate(demoCore(club), { organizer: { organizerType: 'group', organizerId: club.id }, publish: false });
    await runPlan(plan.steps);
  });
  const onDelete = run(async () => {
    await runPlan(vrctlAdapter.planDelete(eventId).steps);
  });

  return (
    <section data-testid="vrctl-dev-panel" className="p-4 bg-background min-h-screen text-foreground">
      <h2 className="font-orbitron text-xl">vrc.tl dev panel</h2>
      <p className="text-2xs text-muted-foreground mb-3">read-only by default · writes are preview-first + gated</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" data-testid="vt-organizers" className={btn} disabled={busy} onClick={onOrganizers}>My organizers</button>
        <button type="button" data-testid="vt-grid" className={btn} disabled={busy} onClick={onGrid}>Grid</button>
        <button type="button" data-testid="vt-preview" className={btn} disabled={busy} onClick={onPreviewCreate}>Preview create</button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          value={eventId}
          data-testid="vt-eventid"
          onChange={(e) => setEventId(e.target.value)}
          placeholder="event id"
          className="min-h-11 px-3 rounded-md border border-input bg-background text-foreground"
        />
        <button type="button" data-testid="vt-read" className={btn} disabled={busy || !eventId} onClick={onReadDetail}>Read detail</button>
      </div>

      <div className="mb-3 border border-brand-amber rounded-md p-2">
        <label className="flex items-center gap-2 text-2xs text-brand-amber">
          <input type="checkbox" data-testid="vt-confirm" checked={confirmWrite} onChange={(e) => setConfirmWrite(e.target.checked)} />
          I confirm this targets a MOCK / dev instance (never a real vrc.tl event)
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          <button type="button" data-testid="vt-run-create" className={btn} disabled={busy || !confirmWrite} onClick={onRunCreate}>Run create (mock only)</button>
          <button type="button" data-testid="vt-delete" className={btn} disabled={busy || !confirmWrite || !eventId} onClick={onDelete}>Delete (mock only)</button>
        </div>
      </div>

      {clubs && (
        <ul className="mb-3 list-disc pl-5">
          {clubs.map((c) => (
            <li key={c.id} data-testid="vt-club" className="text-foreground">{c.name} · {c.id}{c.vrchatGroupId ? ` · ${c.vrchatGroupId}` : ''}</li>
          ))}
        </ul>
      )}
      {events && (
        <ul className="mb-3 list-disc pl-5">
          {events.map((e) => (
            <li key={e.id} data-testid="vt-event" className="text-foreground">{e.title} · {e.id} · {e.start ?? ''}{e.status ? ` · ${e.status}` : ''}</li>
          ))}
        </ul>
      )}
      {detail && <pre data-testid="vt-detail" className="mb-3 text-2xs text-brand-mint whitespace-pre-wrap">{detail}</pre>}
      {preview && <pre data-testid="vt-preview-out" className="mb-3 text-2xs text-foreground whitespace-pre-wrap">{preview.join('\n')}</pre>}
      {error && <p data-testid="vt-error" className="text-2xs text-brand-base">{error}</p>}
    </section>
  );
}
