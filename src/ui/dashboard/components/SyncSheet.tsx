// Per-link sync control: a kit Sheet opened from a linked event's Sync cell. Edit
// this link's mode/source/fields, review the per-target changed fields (path:
// from -> to), resolve conflicts field-by-field, then Apply. A publish flip to
// public asks once (red confirm) before any write. Set-as-baseline records the
// current state without writing. All engine calls come from dashboard/lib/sync
// (webext-bound), so render tests mock them.
import { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  ConfirmDialog,
  LoadingSpinner,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SmartSelect,
  Switch,
  type SmartSelectOption,
} from '@rave-page/ui';
import type { ChangedPath } from '../../../core/diff';
import type { JsonValue } from '../../../core/hash';
import type { Platform } from '../../../shared/agent-protocol';
import { saveLink, type EventLink } from '../../../runtime/link-store';
import type { Settings } from '../../../runtime/settings';
import { planSync, scopedHash, type LinkSync, type SyncFields, type SyncMode, type SyncSource } from '../../lib/sync-plan';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import {
  applySync,
  assessLink,
  effectiveSync,
  setBaseline,
  type AssessedLink,
  type ApplyOutcome,
  type SyncResolutions,
} from '../lib/sync';

const MODES: { value: SyncMode; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'notify', label: 'Notify (assess only)' },
  { value: 'apply', label: 'Apply automatically' },
];
const FIELD_KEYS: { key: keyof SyncFields; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'lineup', label: 'Lineup' },
  { key: 'poster', label: 'Poster' },
  { key: 'publishState', label: 'Publish state' },
];

function humanizePath(path: string): string {
  return path.replace(/\./g, ' › ').replace(/›\s(\d+)/g, (_, n: string) => `› #${Number(n) + 1}`);
}
function short(v: JsonValue | undefined): string {
  if (v === undefined) return '∅';
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > 60 ? `${s.slice(0, 57)}…` : s;
}

export interface SyncSheetProps {
  link: EventLink;
  settings: Settings;
  connected: Platform[];
  initialAssessed?: AssessedLink;
  onClose: () => void;
  onChanged: () => void;
}

export function SyncSheet({ link, settings, connected, initialAssessed, onClose, onChanged }: SyncSheetProps): React.JSX.Element {
  const [linkState, setLinkState] = useState<EventLink>(initialAssessed?.link ?? link);
  const [sync, setSync] = useState<LinkSync>(() => effectiveSync(initialAssessed?.link ?? link, settings));
  const [assessed, setAssessed] = useState<AssessedLink | null>(initialAssessed ?? null);
  const [loading, setLoading] = useState(!initialAssessed);
  const [resolutions, setResolutions] = useState<SyncResolutions>({});
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<ApplyOutcome | null>(null);
  const [pendingPublish, setPendingPublish] = useState(false);

  const fullAssess = useCallback(
    async (l: EventLink): Promise<void> => {
      setLoading(true);
      const fresh = await assessLink(l, settings, connected);
      setAssessed(fresh);
      setLoading(false);
    },
    [settings, connected],
  );

  useEffect(() => {
    if (!initialAssessed) void fullAssess(link);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-assess after a settings change. Cheap: reuse the already-read cores and
  // recompute hashes with the new fields (scopedHash/planSync are pure). Falls
  // back to a full read when cores aren't loaded yet (e.g. link was off).
  async function persist(next: LinkSync): Promise<void> {
    setSync(next);
    const nextLink: EventLink = { ...linkState, sync: next };
    setLinkState(nextLink);
    await saveLink(nextLink);
    if (next.mode === 'off') {
      setAssessed((a) => (a ? { ...a, assessment: planSync({ link: nextLink, cores: {}, hashes: {} }), sync: next } : a));
      return;
    }
    if (!assessed || Object.keys(assessed.cores).length === 0) {
      await fullAssess(nextLink);
      return;
    }
    const cores = assessed.cores;
    const hashes: Partial<Record<Platform, string>> = {};
    for (const p of PLATFORM_ORDER) if (cores[p]) hashes[p] = await scopedHash(cores[p]!, next.fields);
    setAssessed({ ...assessed, hashes, sync: next, assessment: planSync({ link: nextLink, cores, hashes }) });
  }

  const assessment = assessed?.assessment;
  const source = assessment?.source;
  const conflictTargets = assessment?.targets.filter((t) => t.conflict) ?? [];
  const allResolved = conflictTargets.every((t) => t.changes.every((c) => resolutions[t.platform]?.[c.path]));
  const actionableState = assessment?.state === 'pending' || assessment?.state === 'conflict' || assessment?.state === 'pick-source';
  const canApply = !!source && actionableState && (assessment?.targets.length ?? 0) > 0 && (conflictTargets.length === 0 || allResolved);

  // Would applying flip a target to public? (needs a one-time confirm.)
  const wouldPublishPublic =
    !!assessment &&
    !!source &&
    sync.fields.publishState &&
    assessed?.cores[source]?.visibility.publish === true &&
    assessment.targets.some((t) => assessed?.cores[t.platform]?.visibility.publish === false);

  async function doApply(confirmedPublish: boolean): Promise<void> {
    if (!assessed || !source) return;
    let effLink = linkState;
    if (confirmedPublish && !sync.publishConfirmed) {
      const next: LinkSync = { ...sync, publishConfirmed: true };
      setSync(next);
      effLink = { ...linkState, sync: next };
      setLinkState(effLink);
      await saveLink(effLink);
    }
    setBusy(true);
    try {
      const result = await applySync(effLink, assessed, { source, settings, resolutions });
      setOutcome(result);
      setLinkState(result.link);
      await fullAssess(result.link);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  function onApplyClick(): void {
    if (wouldPublishPublic && !sync.publishConfirmed) {
      setPendingPublish(true);
      return;
    }
    void doApply(false);
  }

  async function doBaseline(): Promise<void> {
    setBusy(true);
    try {
      const saved = await setBaseline(linkState, settings, connected);
      setLinkState(saved);
      await fullAssess(saved);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  const pick = (platform: Platform, path: string, choice: 'source' | 'target'): void => {
    setResolutions((cur) => ({ ...cur, [platform]: { ...(cur[platform] ?? {}), [path]: choice } }));
  };

  const sourceOptions: SmartSelectOption[] = [
    { value: 'last-edited', label: 'Last edited' },
    ...PLATFORM_ORDER.filter((p) => link.refs.some((r) => r.platform === p)).map((p) => ({ value: p, label: PLATFORM_NAME[p] })),
  ];

  return (
    <Sheet open onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" data-testid="sync-sheet" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Sync</SheetTitle>
          <SheetDescription>
            Keep this event in step across platforms. Runs while this dashboard is open; conflicts are never applied automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          {/* settings */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div data-testid="sync-mode">
              <SmartSelect label="Mode" options={MODES} value={sync.mode} onChange={(v) => void persist({ ...sync, mode: (typeof v === 'string' ? v : 'off') as SyncMode })} />
            </div>
            <div data-testid="sync-source">
              <SmartSelect label="Source" options={sourceOptions} value={sync.source} onChange={(v) => void persist({ ...sync, source: (typeof v === 'string' ? v : 'last-edited') as SyncSource })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {FIELD_KEYS.map((f) => (
              <label key={f.key} className="flex items-center gap-2">
                <Switch data-testid={`sync-field-${f.key}`} checked={sync.fields[f.key]} onCheckedChange={(v) => void persist({ ...sync, fields: { ...sync.fields, [f.key]: v } })} />
                <span className="text-2xs text-foreground">{f.label}</span>
              </label>
            ))}
          </div>

          {/* assessment */}
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground" data-testid="sync-loading"><LoadingSpinner /> Assessing…</div>
          ) : !assessment || assessment.state === 'off' ? (
            <p className="text-2xs text-muted-foreground" data-testid="sync-state-off">Sync is off for this event. Pick a mode to start.</p>
          ) : assessment.state === 'in-sync' ? (
            <p className="text-2xs text-brand-mint" data-testid="sync-state-in-sync">Everything is in sync.</p>
          ) : (
            <div className="flex flex-col gap-3" data-testid="sync-assessment">
              <div className="flex items-center gap-2">
                <SyncStateBadge state={assessment.state} n={assessment.targets.length} />
                {source && <span className="text-2xs text-muted-foreground">source: {PLATFORM_NAME[source]}</span>}
              </div>
              {assessment.targets.map((t) => (
                <div key={t.platform} data-testid={`sync-target-${t.platform}`} className="rounded-md border border-border p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{PLATFORM_NAME[t.platform]}</span>
                    {t.conflict && <Badge variant="warning">Conflict</Badge>}
                  </div>
                  <ul className="mt-1 flex flex-col gap-1">
                    {t.changes.map((c: ChangedPath) => (
                      <li key={c.path} className="text-2xs text-foreground">
                        <span className="text-muted-foreground">{humanizePath(c.path)}:</span> {short(c.from)} → {short(c.to)}
                        {t.conflict && (
                          <span data-testid={`sync-pick-${c.path}`} className="ml-2 inline-flex gap-1">
                            <Button type="button" size="sm" variant={resolutions[t.platform]?.[c.path] === 'target' ? 'secondary' : 'outline'} data-testid={`sync-pick-${c.path}-target`} onClick={() => pick(t.platform, c.path, 'target')}>
                              keep {PLATFORM_NAME[t.platform]}
                            </Button>
                            <Button type="button" size="sm" variant={resolutions[t.platform]?.[c.path] === 'source' ? 'secondary' : 'outline'} data-testid={`sync-pick-${c.path}-source`} onClick={() => pick(t.platform, c.path, 'source')}>
                              take {source ? PLATFORM_NAME[source] : 'source'}
                            </Button>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* last outcome */}
          {outcome && (
            <div className="flex flex-col gap-1" data-testid="sync-outcome">
              {outcome.results.map((r) => (
                <p key={r.platform} className="text-2xs">
                  <span className="text-foreground">{PLATFORM_NAME[r.platform]}: </span>
                  {r.ok ? (
                    <span className="text-brand-mint">synced</span>
                  ) : r.skipped === 'needs-resolution' ? (
                    <span className="text-brand-base">
                      needs a known performer —{' '}
                      <a href={editHref(link, r.platform)} className="underline-offset-2 hover:underline">resolve in the editor</a>
                    </span>
                  ) : r.skipped === 'conflict' ? (
                    <span className="text-brand-base">conflict — pick a source per field</span>
                  ) : (
                    <span className="text-brand-base">{r.error ?? 'failed'}</span>
                  )}
                </p>
              ))}
            </div>
          )}

          {/* actions */}
          <div className="flex flex-wrap gap-2">
            <Button type="button" data-testid="sync-apply" disabled={!canApply || busy} onClick={onApplyClick}>
              {busy ? 'Applying…' : 'Apply now'}
            </Button>
            <Button type="button" variant="outline" data-testid="sync-baseline" disabled={busy || loading} onClick={() => void doBaseline()}>
              Set as baseline
            </Button>
          </div>
        </div>
      </SheetContent>

      <ConfirmDialog
        isOpen={pendingPublish}
        type="danger"
        title="Publish publicly?"
        message="Applying will make this event PUBLIC on a target platform."
        confirmText="Publish"
        cancelText="Keep current"
        onConfirm={() => { setPendingPublish(false); void doApply(true); }}
        onCancel={() => setPendingPublish(false)}
      />
    </Sheet>
  );
}

function editHref(link: EventLink, platform: Platform): string {
  const ref = link.refs.find((r) => r.platform === platform);
  return ref ? `#/events/${platform}/${ref.id}/edit` : '#/events';
}

function SyncStateBadge({ state, n }: { state: string; n: number }): React.JSX.Element {
  if (state === 'pending') return <Badge variant="info">{n} pending</Badge>;
  if (state === 'conflict') return <Badge variant="warning">Conflict</Badge>;
  if (state === 'pick-source') return <Badge variant="info">Pick source</Badge>;
  return <Badge variant="outline">{state}</Badge>;
}
