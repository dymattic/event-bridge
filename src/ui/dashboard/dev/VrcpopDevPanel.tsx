// TODO(P6): rebuild on @rave-page/ui. Minimal dev panel for vrcpop manual +
// e2e verification (own clubs -> events -> read -> preview/run create draft ->
// set flyer -> delete). Plain Tailwind token classes; drives the adapter through
// the P2 `withAgent` transport. Exported, NOT wired into App.tsx — the lead wires
// it (see mountVrcpopDevPanel / docs). Used only against mocks in e2e, and later
// read-only by the lead against the real session.
import { useCallback, useRef, useState } from 'react';
import { withAgent } from '../lib/runtime-client';
import { errorDebug } from '../../lib/error-copy';
import { asIanaZone, asIsoUtc } from '../../../core/time';
import type { EventCore } from '../../../core/schema';
import { vrcpopAdapter } from '../../../adapters/vrcpop/adapter';
import type { OwnEventRef, VrcpopClub, VrcpopEventRef } from '../../../adapters/vrcpop/types';

const errMessage = (e: unknown): string => errorDebug(e);

// A safe draft to create against the mock (own club). Title carries the
// test prefix so a real object would be obvious; publish stays false (draft).
function draftTestCore(club: VrcpopClub): EventCore {
  const start = asIsoUtc(new Date(Date.now() + 86_400_000).toISOString().replace(/\.\d+Z$/, 'Z'));
  return {
    title: `[event-bridge test] ${new Date().toISOString()}`,
    description: '',
    start,
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: club.name, vrchatGroupId: club.groupId, platformIds: { vrcpop: club.groupId } },
    lineup: [{ order: 1, start, performers: [{ name: 'Example DJ', aliases: [{ platform: 'vrcpop', name: 'Example DJ' }] }], dancers: [] }],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'public' },
    flags: {},
    music: { genres: [], sceneType: 'rave' },
    links: {},
    extras: {},
  };
}

const btn = 'border border-border text-foreground rounded-md h-[var(--control-h)] px-3 text-sm disabled:opacity-50';

export function VrcpopDevPanel(): React.JSX.Element {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string>('');
  const [clubs, setClubs] = useState<VrcpopClub[] | null>(null);
  const [club, setClub] = useState<VrcpopClub | null>(null);
  const [events, setEvents] = useState<VrcpopEventRef[] | null>(null);
  const [event, setEvent] = useState<VrcpopEventRef | null>(null);
  const [core, setCore] = useState<EventCore | null>(null);
  const [version, setVersion] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const run = useCallback((fn: () => Promise<void>): (() => void) => {
    return () => {
      setBusy(true);
      setError(null);
      void fn()
        .catch((e) => setError(errMessage(e)))
        .finally(() => setBusy(false));
    };
  }, []);

  const onClubs = run(async () => {
    const list = await withAgent('vrcpop', (a) => vrcpopAdapter.listOwnClubs(a), { allowOpen: true });
    setClubs(list);
    setLog(`${list.length} club(s)`);
  });

  const onEvents = run(async () => {
    if (!club) throw new Error('pick a club first');
    const list = await withAgent('vrcpop', (a) => vrcpopAdapter.listOwnEvents(a, club.ref), { allowOpen: true });
    setEvents(list);
    setLog(`${list.length} event(s) for ${club.name}`);
  });

  const onRead = run(async () => {
    if (!club || !event) throw new Error('pick a club + event first');
    const out = await withAgent('vrcpop', (a) => vrcpopAdapter.readEvent(a, club.ref, event.ref), { allowOpen: true });
    setCore(out.core);
    setVersion(out.version);
    setLog(`read "${out.core.title}" (version ${out.version})`);
  });

  const onPreview = run(async () => {
    if (!club) throw new Error('pick a club first');
    const src = core ?? draftTestCore(club);
    const steps = vrcpopAdapter.planCreate(src, { group: club.ref, publish: false });
    const body = (steps[0]?.request as { body: unknown }).body;
    setPreview(JSON.stringify(body, null, 2));
    setLog('previewed create draft (no request sent)');
  });

  const onRunCreate = run(async () => {
    if (!club) throw new Error('pick a club first');
    const src = core ?? draftTestCore(club);
    const steps = vrcpopAdapter.planCreate(src, { group: club.ref, publish: false });
    const results = await withAgent('vrcpop', (a) => vrcpopAdapter.runPlan(steps, { agent: a }), { allowOpen: true });
    const id = (results.create as { event_id?: number } | undefined)?.event_id ?? null;
    setCreatedId(id);
    setLog(`created draft event ${id ?? '(no id)'}`);
  });

  const onPickFlyer = (): void => fileRef.current?.click();

  const onFlyer = run(async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) throw new Error('no file chosen');
    if (!club || !event) throw new Error('pick a club + event first');
    const src = core ?? draftTestCore(club);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const steps = vrcpopAdapter.planPoster(src, { group: club.ref, event: event.ref, publish: false, poster: { filename: file.name, mime: file.type || 'application/octet-stream' } });
    await withAgent('vrcpop', (a) => vrcpopAdapter.runPlan(steps, { agent: a, posterBytes: bytes }), { allowOpen: true });
    setLog(`flyer set for event ${event.id}`);
  });

  const onDelete = run(async () => {
    const ref: OwnEventRef | undefined = event?.ref;
    if (!ref) throw new Error('pick an event first');
    await withAgent('vrcpop', (a) => vrcpopAdapter.runPlan(vrcpopAdapter.planDelete(ref), { agent: a }), { allowOpen: true });
    setLog(`deleted event ${ref.id}`);
  });

  return (
    <section data-testid="vrcpop-dev-panel" className="p-4 bg-background min-h-screen text-foreground">
      <h2 className="font-orbitron text-xl mb-1">vrcpop dev panel</h2>
      <p className="text-2xs text-muted-foreground mb-3">
        draft-first · publish is a separate explicit toggle · draft support is expected-unverified (never probed)
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" data-testid="vp-clubs" className={btn} disabled={busy} onClick={onClubs}>My clubs</button>
        <button type="button" data-testid="vp-events" className={btn} disabled={busy || !club} onClick={onEvents}>Events of {club?.name ?? '…'}</button>
        <button type="button" data-testid="vp-read" className={btn} disabled={busy || !event} onClick={onRead}>Read event</button>
        <button type="button" data-testid="vp-preview" className={btn} disabled={busy || !club} onClick={onPreview}>Preview create draft</button>
        <button type="button" data-testid="vp-run-create" className={btn} disabled={busy || !club} onClick={onRunCreate}>Run create draft</button>
        <button type="button" data-testid="vp-flyer" className={btn} disabled={busy || !event} onClick={onPickFlyer}>Set flyer (file picker)</button>
        <button type="button" data-testid="vp-delete" className="border border-brand-base text-brand-base rounded-md h-[var(--control-h)] px-3 text-sm disabled:opacity-50" disabled={busy || !event} onClick={onDelete}>
          Delete {event ? `#${event.id}` : ''}
        </button>
        <input ref={fileRef} type="file" data-testid="vp-file" className="hidden" onChange={onFlyer} />
      </div>

      {clubs && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {clubs.map((c) => (
            <li key={c.groupId}>
              <button
                type="button"
                data-testid="vp-club"
                className={`${btn} ${club?.groupId === c.groupId ? 'border-brand-mint text-brand-mint' : ''}`}
                onClick={() => setClub(c)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {events && (
        <ul className="mb-3 flex flex-col gap-1">
          {events.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                data-testid="vp-event"
                data-event-id={e.id}
                className={`${btn} ${event?.id === e.id ? 'border-brand-mint text-brand-mint' : ''}`}
                onClick={() => setEvent(e)}
              >
                #{e.id} · {e.status} · {e.title} · {e.date}
              </button>
            </li>
          ))}
        </ul>
      )}

      {version != null && (
        <p data-testid="vp-version" className="text-2xs text-muted-foreground mb-2">version {version}</p>
      )}
      {createdId != null && (
        <p data-testid="vp-created-id" className="text-2xs text-brand-mint mb-2">created {createdId}</p>
      )}
      {preview && (
        <pre data-testid="vp-preview-json" className="text-2xs bg-card border border-border rounded-md p-2 overflow-x-auto mb-2">{preview}</pre>
      )}
      {log && <p data-testid="vp-log" className="text-2xs text-muted-foreground mb-1">{log}</p>}
      {error && <p data-testid="vp-error" className="text-2xs text-brand-base">{error}</p>}
    </section>
  );
}
