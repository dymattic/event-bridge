// #/events/new (optional ?targets=) and #/events/:platform/:id/edit — the create +
// edit surface across every connected platform. One shared EventForm drives a live
// per-target loss report, validation, and payload preview; Run executes each target
// sequentially through the shared plan runner, then saves a cross-platform link.
//
// Platform-neutral: identical target rows in fixed order, no platform is a
// prerequisite. Resolved names everywhere; raw ids only inside the payload preview.
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  Input,
  Label,
  LoadingSpinner,
  SmartSelect,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useNotification,
  type SmartSelectOption,
} from '@rave-page/ui';
import type { Audience, EventCore, Flags, IanaZone, Photosensitivity, PosterFile, PosterRef, Slot, VrPlatform } from '../../../core/schema';
import type { JsonValue } from '../../../core/hash';
import { CAPS, computeLoss, type FlagKey, type LossReport } from '../../../core/capabilities';
import { diffEvents, type ChangedPath } from '../../../core/diff';
import { renderPreview, type PlannedStep } from '../../../core/planner';
import type { ValidationIssue } from '../../../core/validate';
import { isBridgeError } from '../../../core/errors';
import type { Platform } from '../../../shared/agent-protocol';
import { getAdapter } from '../../../adapters/registry';
import type { OwnClub, PlanResult } from '../../../adapters/types';
import { enabledPlatforms, getSettings, onSettingsChange } from '../../../runtime/settings';
import { upsertLinkForRefs, type EventRef } from '../../../runtime/link-store';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { invalidate, useResource } from '../../lib/resource';
import { emptyForm, fromCore, formIssues, toCore, type EventForm } from '../../lib/event-form';
import { loadConnections, loadGenreVocab, loadPlatformData, readEventCore } from '../lib/event-data';
import { runPlan, type StepEvent } from '../lib/run-plan';
import { LineupEditor } from '../components/LineupEditor';
import { PosterPanel } from '../components/PosterPanel';

type Tab = 'basics' | 'details' | 'lineup' | 'poster' | 'review';

const AUDIENCES: Audience[] = ['public', 'followers', 'unlisted', 'private'];
const VR_PLATFORMS: VrPlatform[] = ['windows', 'android', 'ios'];
const PHOTOSENS: Photosensitivity[] = ['none', 'noFlashing', 'mild', 'severe', 'withToggle'];
const BOOL_FLAGS: { key: FlagKey; label: string }[] = [
  { key: 'openDecks', label: 'Open decks' },
  { key: 'ageGated', label: 'Age gated' },
  { key: 'questCompatible', label: 'Quest compatible' },
  { key: 'avatarRestrictions', label: 'Avatar restrictions' },
];
const ENERGY_HINTS = ['Chill', 'Groovy', 'High energy', 'Peak time'];
const SCENE_HINTS = ['rave', 'club', 'lounge', 'festival', 'concert'];

function browserZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function timeZoneOptions(): string[] {
  const sv = (Intl as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
  const zones = sv ? sv('timeZone') : [];
  return zones.length ? zones : ['UTC', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo'];
}

function goto(hash: string): void {
  if (typeof window !== 'undefined') window.location.hash = hash;
}

function errMessage(e: unknown): string {
  if (isBridgeError(e)) return `${e.code}: ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}

// Human dot path (title, flags.nsfw, lineup.0.start -> readable) for changes/required.
function humanizePath(path: string): string {
  return path.replace(/\./g, ' › ').replace(/›\s(\d+)/g, (_, n: string) => `› #${Number(n) + 1}`);
}

// The tab a required/invalid path lives on, so a Review chip can jump to it.
function tabForPath(path: string): Tab {
  if (path.startsWith('flags')) return 'details';
  if (path.startsWith('lineup')) return 'lineup';
  if (path.startsWith('poster')) return 'poster';
  if (path.startsWith('links') || path.startsWith('music')) return 'details';
  return 'basics';
}

function obj(v: JsonValue | undefined): Record<string, JsonValue> | undefined {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, JsonValue>) : undefined;
}

// Created event id from a run's results (per-platform result shape), else fallback.
function extractEventId(platform: Platform, results: Record<string, JsonValue>, fallback?: string): string | undefined {
  if (platform === 'ravepage') {
    const id = obj(results.create)?.id ?? obj(results.update)?.id;
    return id != null ? String(id) : fallback;
  }
  if (platform === 'vrcpop') {
    const id = obj(results.create)?.event_id;
    return id != null ? String(id) : fallback;
  }
  const id = obj(results.finalize)?.id ?? obj(results.create)?.id;
  return id != null ? String(id) : fallback;
}

interface EditorProps {
  mode: 'create' | 'edit';
  platform?: Platform;
  id?: string;
  initialTargets?: Platform[];
}

interface FailedRun {
  platform: Platform;
  steps: PlannedStep[];
  results: Record<string, JsonValue>;
  createdId?: string;
}

export default function EventEditor({ mode, platform, id, initialTargets = [] }: EditorProps): React.JSX.Element {
  const { addNotification } = useNotification();

  const [enabled, setEnabled] = useState<Platform[]>(['vrctl', 'vrcpop']);
  const [testPrefix, setTestPrefix] = useState('[event-bridge test] ');
  useEffect(() => {
    void getSettings().then((s) => {
      setEnabled(enabledPlatforms(s));
      setTestPrefix(s.testPrefix);
    });
    return onSettingsChange((s) => setEnabled(enabledPlatforms(s)));
  }, []);

  const conns = useResource('connections', loadConnections);
  const connected = (p: Platform): boolean => conns.data?.[p]?.connected ?? false;

  // Per-platform clubs (shared cache with #/events). Only when connected.
  const vtClubs = useResource(connected('vrctl') ? 'platform:vrctl' : null, () => loadPlatformData('vrctl'));
  const vpClubs = useResource(connected('vrcpop') ? 'platform:vrcpop' : null, () => loadPlatformData('vrcpop'));
  const rpClubs = useResource(enabled.includes('ravepage') && connected('ravepage') ? 'platform:ravepage' : null, () => loadPlatformData('ravepage'));
  const clubsOf = (p: Platform): OwnClub[] => (p === 'vrctl' ? vtClubs.data : p === 'vrcpop' ? vpClubs.data : rpClubs.data)?.clubs ?? [];

  // Edit: source event (carries extras for planUpdate).
  const src = useResource(mode === 'edit' && platform && id ? `event:${platform}:${id}` : null, () => readEventCore(platform as Platform, id as string));
  const sourceCore = src.data;

  const [form, setForm] = useState<EventForm>(() => emptyForm(browserZone()));
  const [checked, setChecked] = useState<Set<Platform>>(() => new Set(initialTargets));
  const [clubByTarget, setClubByTarget] = useState<Partial<Record<Platform, string>>>({});
  const [publishByTarget, setPublishByTarget] = useState<Partial<Record<Platform, boolean>>>({});
  const [testEvent, setTestEvent] = useState(false);
  const [tab, setTab] = useState<Tab>('basics');
  const [pendingPublish, setPendingPublish] = useState<Platform | null>(null);
  const initedRef = useRef(false);

  // Edit: seed the form + source target from the loaded event once. A transfer
  // opens edit with extra create targets (?targets=), unioned with the source.
  useEffect(() => {
    if (mode !== 'edit' || !sourceCore || !platform || initedRef.current) return;
    initedRef.current = true;
    setForm(fromCore(sourceCore));
    setChecked(new Set([platform, ...initialTargets]));
    setPublishByTarget({ [platform]: sourceCore.visibility.publish });
    const orgId = sourceCore.organizer.platformIds[platform];
    if (orgId) setClubByTarget({ [platform]: orgId });
  }, [mode, sourceCore, platform]);

  const patch = (p: Partial<EventForm>): void => setForm((f) => ({ ...f, ...p }));
  const targets = useMemo(() => PLATFORM_ORDER.filter((p) => checked.has(p)), [checked]);

  // Genre vocab per checked target (names + meta of platforms that know each).
  const vtVocab = useResource(checked.has('vrctl') && connected('vrctl') ? 'vocab:vrctl' : null, () => loadGenreVocab('vrctl'));
  const vpVocab = useResource(checked.has('vrcpop') && connected('vrcpop') ? 'vocab:vrcpop' : null, () => loadGenreVocab('vrcpop'));
  const rpVocab = useResource(checked.has('ravepage') && connected('ravepage') ? 'vocab:ravepage' : null, () => loadGenreVocab('ravepage'));
  const vocabOf = (p: Platform): { name: string; slug?: string }[] => (p === 'vrctl' ? vtVocab.data : p === 'vrcpop' ? vpVocab.data : rpVocab.data) ?? [];

  const genreOptions: SmartSelectOption[] = useMemo(() => {
    const byName = new Map<string, Set<Platform>>();
    for (const p of targets) for (const g of vocabOf(p)) {
      const key = g.name;
      const set = byName.get(key) ?? new Set<Platform>();
      set.add(p);
      byName.set(key, set);
    }
    for (const g of form.genres) if (!byName.has(g)) byName.set(g, new Set());
    return [...byName.entries()].map(([name, set]) => ({
      value: name,
      label: name,
      meta: PLATFORM_ORDER.filter((p) => set.has(p)).map((p) => PLATFORM_NAME[p]).join(' · ') || undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, vtVocab.data, vpVocab.data, rpVocab.data, form.genres]);

  const genreVocabFor = (p: Platform): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const g of vocabOf(p)) if (g.slug) out[g.name.toLowerCase()] = g.slug;
    return out;
  };

  // Effective core (test prefix applied); null when the zone is invalid.
  const core = useMemo<EventCore | null>(() => {
    if (!formIsZoneValid(form)) return null;
    try {
      const c = toCore(form);
      return testEvent ? { ...c, title: `${testPrefix}${c.title}` } : c;
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, testEvent, testPrefix]);

  const issues = useMemo(() => formIssues(form), [form]);

  const clubFor = (p: Platform): OwnClub | undefined => clubsOf(p).find((c) => c.id === clubByTarget[p]);

  // Build a target's plan (create, or update for the edit source). Throws are
  // caught by the caller (vrc.tl throws VALIDATION when NSFW is unset).
  const planFor = (p: Platform, c: EventCore): PlanResult => {
    const adapter = getAdapter(p);
    const club = clubFor(p);
    const organizer = club ? { organizerType: club.organizerType, organizerId: club.id } : { organizerType: '', organizerId: clubByTarget[p] ?? '' };
    const publish = publishByTarget[p] ?? false;
    const genreVocab = genreVocabFor(p);
    if (mode === 'edit' && p === platform && sourceCore && id) {
      return adapter.planUpdate(c, { id, current: sourceCore, organizer, publish, genreVocab });
    }
    return adapter.planCreate(c, { organizer, publish, genreVocab });
  };

  interface Review {
    platform: Platform;
    loss: LossReport;
    issues: ValidationIssue[];
    preview: string;
    planError?: string;
    needsClub: boolean;
    changes: ChangedPath[];
  }

  const reviews: Review[] = useMemo(() => {
    if (!core) return [];
    return targets.map((p) => {
      const perTargetCore: EventCore = { ...core, visibility: { ...core.visibility, publish: publishByTarget[p] ?? false } };
      const loss = computeLoss(perTargetCore, CAPS[p]);
      const isCreate = !(mode === 'edit' && p === platform);
      const needsClub = isCreate && !clubByTarget[p];
      let preview = '';
      let planError: string | undefined;
      try {
        preview = planFor(p, perTargetCore).steps.map(renderPreview).join('\n\n');
      } catch (e) {
        planError = errMessage(e);
      }
      const changes = mode === 'edit' && p === platform && sourceCore ? diffEvents(sourceCore, perTargetCore) : [];
      return { platform: p, loss, issues, preview, planError, needsClub, changes };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [core, targets, publishByTarget, clubByTarget, issues, sourceCore, mode, platform]);

  const blocked = (r: Review): boolean => r.issues.length > 0 || r.loss.required.length > 0 || r.needsClub;
  const runnable = targets.length > 0 && reviews.length > 0 && !reviews.some(blocked);

  // ---- run orchestration ----
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<StepEvent[]>([]);
  const [runError, setRunError] = useState<string | null>(null);
  const [failed, setFailed] = useState<FailedRun | null>(null);
  // Refs of targets that already succeeded — kept across doRun/doRetry so a link
  // survives a later target's failure + retry (P6.2 follow-up).
  const createdRefs = useRef<EventRef[]>([]);
  const onStep = (evt: StepEvent): void => setLog((l) => [...l.filter((e) => e.stepId !== evt.stepId), evt]);

  function mergeCreatedRef(ref: EventRef): void {
    createdRefs.current = [...createdRefs.current.filter((r) => r.platform !== ref.platform), ref];
  }
  async function persistLink(): Promise<void> {
    if (createdRefs.current.length) await upsertLinkForRefs(createdRefs.current);
  }
  // Skip re-applying the poster on an edit whose source target didn't change it.
  function posterNeedsApply(p: Platform, perTargetCore: EventCore): boolean {
    if (mode === 'edit' && p === platform && sourceCore) {
      return diffEvents(sourceCore, perTargetCore).some((c) => c.path.startsWith('poster'));
    }
    return true;
  }

  async function applyPoster(p: Platform, eventId: string, poster: PosterRef | null, file: PosterFile | null): Promise<void> {
    const adapter = getAdapter(p);
    if (file) {
      await adapter.setPoster(eventId, file);
      return;
    }
    if (poster && poster.kind === 'url') {
      const pp = adapter.planPoster(eventId, poster);
      if (pp.steps.length) await runPlan(p, pp.steps, { onStep });
    }
  }

  const posterFile: PosterFile | null =
    form.poster && form.poster.kind === 'bytes'
      ? { bytes: form.poster.bytes, mimeType: form.poster.mimeType, filename: form.poster.filename ?? 'poster' }
      : null;

  // Run one target from `startResults` (retry resumes with prior results).
  async function runTarget(p: Platform, startResults?: Record<string, JsonValue>): Promise<{ ok: boolean; ref?: EventRef }> {
    const perTargetCore: EventCore = { ...(core as EventCore), visibility: { ...(core as EventCore).visibility, publish: publishByTarget[p] ?? false } };
    const steps = planFor(p, perTargetCore).steps;
    const out = await runPlan(p, steps, { onStep, results: startResults });
    if (!out.ok) {
      const createdId = extractEventId(p, out.results);
      setFailed({ platform: p, steps, results: out.results, createdId });
      setRunError(`${PLATFORM_NAME[p]}: ${out.error ? errMessage(out.error) : 'step failed'}`);
      return { ok: false };
    }
    const eventId = extractEventId(p, out.results, mode === 'edit' && p === platform ? id : undefined);
    if (eventId && posterNeedsApply(p, perTargetCore)) await applyPoster(p, eventId, form.poster, posterFile);
    return { ok: true, ref: eventId ? { platform: p, id: eventId } : undefined };
  }

  function navAfterRun(): void {
    const first = createdRefs.current[0] ?? (mode === 'edit' && platform && id ? { platform, id } : undefined);
    goto(first ? `#/events/${first.platform}/${first.id}` : '#/events');
  }

  async function doRun(): Promise<void> {
    if (!core || running) return;
    setRunning(true);
    setRunError(null);
    setFailed(null);
    setLog([]);
    createdRefs.current = [];
    try {
      for (const p of targets) {
        const res = await runTarget(p);
        if (res.ref) mergeCreatedRef(res.ref);
        if (!res.ok) {
          await persistLink(); // keep the targets that already succeeded
          return;
        }
      }
      await persistLink();
      invalidate('platform:');
      invalidate('event:');
      addNotification(mode === 'edit' ? 'Event saved.' : 'Event created.', 'success');
      navAfterRun();
    } catch (e) {
      setRunError(errMessage(e));
    } finally {
      setRunning(false);
    }
  }

  async function doRetry(): Promise<void> {
    if (!failed || running) return;
    setRunning(true);
    setRunError(null);
    try {
      const res = await runTarget(failed.platform, failed.results);
      if (!res.ok) return; // still failing; runTarget re-set failed + error
      if (res.ref) mergeCreatedRef(res.ref);
      setFailed(null);
      // Continue any remaining targets after the recovered one.
      for (const p of targets.slice(targets.indexOf(failed.platform) + 1)) {
        const r = await runTarget(p);
        if (r.ref) mergeCreatedRef(r.ref);
        if (!r.ok) {
          await persistLink();
          return;
        }
      }
      await persistLink();
      invalidate('platform:');
      invalidate('event:');
      addNotification('Event saved.', 'success');
      navAfterRun();
    } catch (e) {
      setRunError(errMessage(e));
    } finally {
      setRunning(false);
    }
  }

  async function doRollback(): Promise<void> {
    if (!failed?.createdId || running) return;
    setRunning(true);
    try {
      const del = getAdapter(failed.platform).planDelete(failed.createdId);
      await runPlan(failed.platform, del.steps, { onStep });
      addNotification(`Deleted the created event on ${PLATFORM_NAME[failed.platform]}.`, 'info');
      setFailed(null);
    } catch (e) {
      setRunError(errMessage(e));
    } finally {
      setRunning(false);
    }
  }

  // ---- target toggles ----
  const toggleTarget = (p: Platform, on: boolean): void => {
    setChecked((cur) => {
      const next = new Set(cur);
      if (on) next.add(p);
      else next.delete(p);
      return next;
    });
    if (on && !(p in publishByTarget)) setPublishByTarget((cur) => ({ ...cur, [p]: false }));
  };

  const setPublish = (p: Platform, on: boolean): void => {
    if (on && p === 'vrcpop') {
      setPendingPublish('vrcpop');
      return;
    }
    setPublishByTarget((cur) => ({ ...cur, [p]: on }));
  };

  // ---- render ----
  if (mode === 'edit' && src.loading && !sourceCore) {
    return (
      <main className="p-4 bg-background min-h-screen">
        <div data-testid="editor-loading" className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner /> Loading event…
        </div>
      </main>
    );
  }

  const connectable = enabled;
  const anyConnected = connectable.some(connected);
  const zoneOpts: SmartSelectOption[] = timeZoneOptions().map((z) => ({ value: z, label: z }));
  const flagShown = (key: FlagKey): boolean => targets.some((p) => CAPS[p].flags[key] === true);
  const flagUnsupported = (key: FlagKey): Platform[] => targets.filter((p) => CAPS[p].flags[key] !== true);
  const nsfwShown = flagShown('nsfw');
  const nsfwRequired = targets.some((p) => CAPS[p].requiredFields.includes('flags.nsfw'));
  const vrcpopTarget = checked.has('vrcpop');

  const cancelHref = mode === 'edit' && platform && id ? `#/events/${platform}/${id}` : '#/events';

  return (
    <main className="p-4 bg-background min-h-screen pb-24" data-testid="event-editor">
      <header className="mb-4">
        <a href={cancelHref} data-testid="editor-back" className="text-2xs text-muted-foreground underline-offset-2 hover:underline">
          ← Back
        </a>
        <h1 className="font-orbitron text-2xl text-foreground mt-2">{mode === 'edit' ? 'Edit event' : 'New event'}</h1>
        <p className="text-sm text-muted-foreground mt-1">Create or edit your event on every platform you pick. No platform is required.</p>
      </header>

      {!anyConnected ? (
        <EmptyState
          data-testid="editor-none-connected"
          headingLevel="h2"
          title="Connect a platform first"
          description="Sign in to at least one platform to create or edit events."
          action={<Button asChild><a href="#/events">Back to events</a></Button>}
        />
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle as="h2">Targets</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {connectable.map((p) => {
                const isConnected = connected(p);
                const on = checked.has(p);
                const label = conns.data?.[p]?.label;
                return (
                  <div key={p} className="flex flex-col gap-2 rounded-md border border-border px-3 py-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        data-testid={`editor-target-${p}`}
                        checked={on}
                        disabled={!isConnected}
                        onCheckedChange={(v) => toggleTarget(p, v === true)}
                      />
                      <span className="text-sm text-foreground">{PLATFORM_NAME[p]}</span>
                      {isConnected ? (
                        <span className="text-2xs text-brand-mint">{label ? `Connected (${label})` : 'Connected'}</span>
                      ) : (
                        <span className="text-2xs text-muted-foreground">Not connected</span>
                      )}
                    </label>
                    {on && isConnected && (
                      <div data-testid={`editor-club-${p}`}>
                        <SmartSelect
                          label="Club"
                          allowSearch
                          options={clubsOf(p).map((c) => ({ value: c.id, label: c.name }))}
                          value={clubByTarget[p] ?? null}
                          placeholder="Pick a club"
                          onChange={(v) => setClubByTarget((cur) => ({ ...cur, [p]: typeof v === 'string' ? v : '' }))}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
                <div className="overflow-x-auto">
                  <TabsList>
                    <TabsTrigger value="basics" data-testid="editor-tab-basics">Basics</TabsTrigger>
                    <TabsTrigger value="details" data-testid="editor-tab-details">Details</TabsTrigger>
                    <TabsTrigger value="lineup" data-testid="editor-tab-lineup">Lineup</TabsTrigger>
                    <TabsTrigger value="poster" data-testid="editor-tab-poster">Poster</TabsTrigger>
                    <TabsTrigger value="review" data-testid="editor-tab-review">Review</TabsTrigger>
                  </TabsList>
                </div>

                {/* ---- Basics ---- */}
                <TabsContent value="basics" className="flex flex-col gap-4 pt-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="editor-title">Title</Label>
                    <Input id="editor-title" data-testid="editor-title" value={form.title} onChange={(e) => patch({ title: e.currentTarget.value })} />
                    <label className="flex items-center gap-2 mt-1">
                      <Switch data-testid="editor-test-prefix" checked={testEvent} onCheckedChange={setTestEvent} />
                      <span className="text-2xs text-muted-foreground">Prefix as test event ({testPrefix.trim()})</span>
                    </label>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="editor-description">Description</Label>
                    <Textarea id="editor-description" data-testid="editor-description" rows={4} value={form.description ?? ''} onChange={(e) => patch({ description: e.currentTarget.value })} />
                  </div>
                  <div data-testid="editor-zone">
                    <SmartSelect label="Time zone" allowSearch options={zoneOpts} value={form.zone} placeholder="Time zone" onChange={(v) => patch({ zone: typeof v === 'string' ? v : form.zone })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <TimeField testId="editor-start" label="Start" value={form.startLocal} onChange={(v) => patch({ startLocal: v })} />
                    <TimeField testId="editor-end" label="End" value={form.endLocal} onChange={(v) => patch({ endLocal: v })} />
                    <TimeField testId="editor-doors" label="Doors open" value={form.doorsLocal} onChange={(v) => patch({ doorsLocal: v })} />
                  </div>
                  <div data-testid="editor-audience">
                    <SmartSelect
                      label="Audience"
                      options={AUDIENCES.map((a) => ({ value: a, label: a }))}
                      value={form.audience}
                      onChange={(v) => patch({ audience: (typeof v === 'string' ? v : form.audience) as Audience })}
                    />
                  </div>
                </TabsContent>

                {/* ---- Details ---- */}
                <TabsContent value="details" className="flex flex-col gap-4 pt-4">
                  {nsfwShown && (
                    <div className="flex flex-col gap-1" data-testid="editor-nsfw">
                      <Label>
                        Content rating{nsfwRequired && <span className="text-brand-base"> * required for vrc.tl</span>}
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={form.flags.nsfw === false ? 'secondary' : 'outline'}
                          aria-pressed={form.flags.nsfw === false}
                          data-testid="editor-nsfw-sfw"
                          onClick={() => patch({ flags: { ...form.flags, nsfw: false } })}
                        >
                          SFW
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={form.flags.nsfw === true ? 'secondary' : 'outline'}
                          aria-pressed={form.flags.nsfw === true}
                          data-testid="editor-nsfw-nsfw"
                          onClick={() => patch({ flags: { ...form.flags, nsfw: true } })}
                        >
                          NSFW
                        </Button>
                      </div>
                    </div>
                  )}

                  {BOOL_FLAGS.filter((f) => flagShown(f.key)).map((f) => (
                    <label key={f.key} className="flex items-center gap-2">
                      <Checkbox
                        data-testid={`editor-flag-${f.key}`}
                        checked={form.flags[f.key] === true}
                        onCheckedChange={(v) => patch({ flags: { ...form.flags, [f.key]: v === true } })}
                      />
                      <span className="text-sm text-foreground">{f.label}</span>
                      <FlagHint platforms={flagUnsupported(f.key)} />
                    </label>
                  ))}

                  {flagShown('platforms') && (
                    <div data-testid="editor-flag-platforms">
                      <SmartSelect
                        label="VR platforms"
                        isMulti
                        options={VR_PLATFORMS.map((v) => ({ value: v, label: v }))}
                        value={form.flags.platforms ?? []}
                        onChange={(v) => patch({ flags: { ...form.flags, platforms: (Array.isArray(v) ? v : v ? [v] : []) as VrPlatform[] } })}
                      />
                      <FlagHint platforms={flagUnsupported('platforms')} />
                    </div>
                  )}

                  {flagShown('photosensitivity') && (
                    <div data-testid="editor-flag-photosensitivity">
                      <SmartSelect
                        label="Photosensitivity"
                        options={PHOTOSENS.map((v) => ({ value: v, label: v }))}
                        value={form.flags.photosensitivity ?? 'none'}
                        onChange={(v) => patch({ flags: { ...form.flags, photosensitivity: (typeof v === 'string' ? v : 'none') as Photosensitivity } })}
                      />
                    </div>
                  )}

                  <div data-testid="editor-genres">
                    <SmartSelect
                      label="Genres"
                      isMulti
                      allowSearch
                      allowCreate
                      options={genreOptions}
                      value={form.genres}
                      onChange={(v) => patch({ genres: Array.isArray(v) ? v : v ? [v] : [] })}
                    />
                  </div>

                  {vrcpopTarget && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div data-testid="editor-energy">
                        <SmartSelect
                          label="Energy"
                          allowSearch
                          allowCreate
                          options={ENERGY_HINTS.map((v) => ({ value: v, label: v }))}
                          value={form.energy ?? null}
                          onChange={(v) => patch({ energy: typeof v === 'string' ? v : undefined })}
                        />
                      </div>
                      <div data-testid="editor-scene">
                        <SmartSelect
                          label="Scene type"
                          allowSearch
                          allowCreate
                          options={SCENE_HINTS.map((v) => ({ value: v, label: v }))}
                          value={form.sceneType ?? null}
                          onChange={(v) => patch({ sceneType: typeof v === 'string' ? v : undefined })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <LinkField testId="editor-link-twitch" label="Twitch" value={form.links.twitch} onChange={(v) => patch({ links: { ...form.links, twitch: v } })} />
                    <LinkField testId="editor-link-announcement" label="Announcement" value={form.links.announcement} onChange={(v) => patch({ links: { ...form.links, announcement: v } })} />
                    <LinkField testId="editor-link-world" label="World" value={form.links.world} onChange={(v) => patch({ links: { ...form.links, world: v } })} />
                    <LinkField testId="editor-link-join" label="Join" value={form.links.join} onChange={(v) => patch({ links: { ...form.links, join: v } })} />
                    <LinkField testId="editor-link-discord" label="Discord" value={form.links.discord} onChange={(v) => patch({ links: { ...form.links, discord: v } })} />
                    <LinkField testId="editor-link-stream" label="Stream" value={form.links.stream} onChange={(v) => patch({ links: { ...form.links, stream: v } })} />
                  </div>
                </TabsContent>

                {/* ---- Lineup ---- */}
                <TabsContent value="lineup" className="pt-4">
                  <LineupEditor
                    value={form.lineup}
                    onChange={(next: Slot[]) => patch({ lineup: next })}
                    eventStart={core?.start ?? null}
                    zone={(formIsZoneValid(form) ? form.zone : browserZone()) as IanaZone}
                    targets={targets}
                  />
                </TabsContent>

                {/* ---- Poster ---- */}
                <TabsContent value="poster" className="pt-4">
                  <PosterPanel value={form.poster} file={posterFile} onChange={(poster) => patch({ poster })} />
                </TabsContent>

                {/* ---- Review ---- */}
                <TabsContent value="review" className="flex flex-col gap-4 pt-4">
                  {targets.length === 0 ? (
                    <p className="text-sm text-muted-foreground" data-testid="editor-review-empty">Pick at least one target platform.</p>
                  ) : (
                    reviews.map((r) => (
                      <Card key={r.platform} data-testid={`editor-review-${r.platform}`}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <CardTitle as="h3">{PLATFORM_NAME[r.platform]}</CardTitle>
                            {r.needsClub && <Badge variant="warning">Pick a club</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                          <LossReportView loss={r.loss} onJump={setTab} />
                          {r.issues.length > 0 && (
                            <ul className="flex flex-col gap-1" data-testid={`editor-issues-${r.platform}`}>
                              {r.issues.map((iss) => (
                                <li key={iss.path} className="text-2xs text-brand-base">
                                  <button type="button" className="underline-offset-2 hover:underline" onClick={() => setTab(tabForPath(iss.path))}>
                                    {humanizePath(iss.path)}: {iss.message}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <label className="flex items-center gap-2">
                            <Switch
                              data-testid={`editor-publish-${r.platform}`}
                              checked={publishByTarget[r.platform] ?? false}
                              onCheckedChange={(v) => setPublish(r.platform, v)}
                            />
                            <span className="text-sm text-foreground">Publish {publishByTarget[r.platform] ? '(public)' : '(draft)'}</span>
                          </label>

                          {r.changes.length > 0 && (
                            <details data-testid={`editor-changes-${r.platform}`} open>
                              <summary className="cursor-pointer text-2xs text-muted-foreground">Changed fields ({r.changes.length})</summary>
                              <ul className="mt-1 flex flex-col gap-0.5">
                                {r.changes.map((c) => (
                                  <li key={c.path} className="text-2xs text-foreground">{humanizePath(c.path)}</li>
                                ))}
                              </ul>
                            </details>
                          )}

                          {r.planError ? (
                            <p className="text-2xs text-brand-base" data-testid={`editor-plan-error-${r.platform}`}>{r.planError}</p>
                          ) : (
                            <details data-testid={`editor-preview-disclosure-${r.platform}`}>
                              <summary className="cursor-pointer text-2xs text-muted-foreground">Show exact request</summary>
                              <pre data-testid={`editor-preview-${r.platform}`} className="mt-2 max-h-72 overflow-auto rounded-md border border-border bg-card p-2 text-2xs whitespace-pre-wrap">
                                {r.preview}
                              </pre>
                            </details>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}

                  {log.length > 0 && (
                    <Card data-testid="editor-steplog">
                      <CardHeader>
                        <CardTitle as="h3">Run log</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="flex flex-col gap-2">
                          {log.map((e) => (
                            <li key={e.stepId} data-testid={`editor-step-${e.stepId}`} className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <Badge variant={e.status === 'done' ? 'success' : e.status === 'error' ? 'error' : 'info'}>{e.status}</Badge>
                                <span className="text-2xs text-foreground">{e.stepId}</span>
                              </div>
                              {e.error && <span className="text-2xs text-brand-base pl-1">{errMessage(e.error)}</span>}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {runError && (
                    <div className="flex flex-col gap-2 rounded-md border border-brand-base/40 p-3" data-testid="editor-run-error">
                      <p className="text-2xs text-brand-base">{runError}</p>
                      <div className="flex flex-wrap gap-2">
                        {failed && (
                          <Button type="button" size="sm" variant="outline" data-testid="editor-retry" disabled={running} onClick={() => void doRetry()}>
                            Retry from failed step
                          </Button>
                        )}
                        {failed?.createdId && (
                          <Button type="button" size="sm" variant="destructive" data-testid="editor-rollback" disabled={running} onClick={() => void doRollback()}>
                            Delete created event on {PLATFORM_NAME[failed.platform]}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <Button type="button" data-testid="editor-run" disabled={!runnable || running} onClick={() => void doRun()}>
                      {running ? 'Running…' : mode === 'edit' ? 'Save event' : 'Create event'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {/* sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur px-4 py-3 flex items-center justify-end gap-2" data-testid="editor-footer">
        <Button asChild variant="ghost" data-testid="editor-cancel"><a href={cancelHref}>Cancel</a></Button>
        <Button type="button" data-testid="editor-review" onClick={() => setTab('review')}>Review &amp; run</Button>
      </div>

      <ConfirmDialog
        isOpen={pendingPublish === 'vrcpop'}
        type="danger"
        title="Publish on vrcpop.com?"
        message="This publishes PUBLICLY on vrcpop.com immediately."
        confirmText="Publish"
        cancelText="Keep as draft"
        onConfirm={() => {
          setPublishByTarget((cur) => ({ ...cur, vrcpop: true }));
          setPendingPublish(null);
        }}
        onCancel={() => setPendingPublish(null)}
      />
    </main>
  );
}

function formIsZoneValid(form: EventForm): boolean {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: form.zone }) != null;
  } catch {
    return false;
  }
}

function TimeField({ testId, label, value, onChange }: { testId: string; label: string; value: string; onChange: (v: string) => void }): React.JSX.Element {
  // The kit DateTimePicker binds local 'YYYY-MM-DDTHH:mm' strings in the event
  // zone; the plain input keeps happy-dom render tests deterministic.
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={testId}>{label}</Label>
      <Input id={testId} data-testid={testId} type="datetime-local" value={value} onChange={(e) => onChange(e.currentTarget.value)} />
    </div>
  );
}

function LinkField({ testId, label, value, onChange }: { testId: string; label: string; value?: string; onChange: (v: string) => void }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={testId}>{label}</Label>
      <Input id={testId} data-testid={testId} value={value ?? ''} placeholder="https://…" onChange={(e) => onChange(e.currentTarget.value)} />
    </div>
  );
}

function FlagHint({ platforms }: { platforms: Platform[] }): React.JSX.Element | null {
  if (!platforms.length) return null;
  return <span className="text-2xs text-muted-foreground">not on {platforms.map((p) => PLATFORM_NAME[p]).join(', ')}</span>;
}

function LossReportView({ loss, onJump }: { loss: LossReport; onJump: (tab: Tab) => void }): React.JSX.Element | null {
  const { dropped, approximated, required } = loss;
  if (!dropped.length && !approximated.length && !required.length) {
    return <p className="text-2xs text-brand-mint" data-testid="loss-none">Everything maps cleanly.</p>;
  }
  return (
    <div className="flex flex-col gap-2" data-testid="loss-report">
      {required.length > 0 && (
        <div>
          <p className="text-2xs uppercase tracking-wide text-brand-base">Required</p>
          <ul className="flex flex-col gap-0.5">
            {required.map((e) => (
              <li key={e.path} className="text-2xs">
                <button type="button" className="text-brand-base underline-offset-2 hover:underline" onClick={() => onJump(tabForPath(e.path))}>
                  {humanizePath(e.path)}: {e.reason}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {dropped.length > 0 && (
        <div>
          <p className="text-2xs uppercase tracking-wide text-muted-foreground">Dropped</p>
          <ul className="flex flex-col gap-0.5">
            {dropped.map((e) => (
              <li key={e.path} className="text-2xs text-muted-foreground">{humanizePath(e.path)}: {e.reason}</li>
            ))}
          </ul>
        </div>
      )}
      {approximated.length > 0 && (
        <div>
          <p className="text-2xs uppercase tracking-wide text-muted-foreground">Approximated</p>
          <ul className="flex flex-col gap-0.5">
            {approximated.map((e) => (
              <li key={e.path} className="text-2xs text-muted-foreground">{humanizePath(e.path)}: {e.reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
