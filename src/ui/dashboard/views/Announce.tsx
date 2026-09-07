// #/announce — render a Discord-ready announcement for one of your events from a
// user-editable PRESET (template header / per-slot line / footer with {var} and
// {time:STYLE} placeholders). Live preview, char-count guard (2000), copy to
// clipboard. Presets: three code builtins + local user presets (create / edit /
// duplicate / delete). Links are PUBLIC event URLs of every linked platform.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  EmptyState,
  Input,
  LoadingSpinner,
  SmartSelect,
  Textarea,
  useNotification,
  type SmartSelectOption,
} from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import {
  DEFAULT_PRESETS,
  PLACEHOLDER_HELP,
  renderAnnouncement,
  type AnnounceLink,
  type AnnouncePreset,
} from '../../../core/discord';
import { deletePreset, duplicatePreset, listPresets, savePreset } from '../../../runtime/announce-presets';
import { listLinks } from '../../../runtime/link-store';
import { enabledPlatforms, getSettings, onSettingsChange } from '../../../runtime/settings';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { publicEventUrl } from '../../lib/platform-urls';
import { formatLocalDateTime } from '../../lib/format';
import { isUpcoming } from '../../lib/event-filters';
import { useResource } from '../../lib/resource';
import { loadConnections, loadPlatformData, readEventCore } from '../lib/event-data';

const CLASSIC = DEFAULT_PRESETS.find((p) => p.id === 'builtin:classic') ?? DEFAULT_PRESETS[0]!;

interface SelEvent {
  platform: Platform;
  id: string;
}

function parseQuery(query: string): { sel: SelEvent | null; preset: string } {
  const q = new URLSearchParams(query);
  const platform = q.get('platform');
  const id = q.get('id');
  const okPlatform = platform === 'vrctl' || platform === 'vrcpop' || platform === 'ravepage';
  return {
    sel: okPlatform && id ? { platform, id } : null,
    preset: q.get('preset') ?? '',
  };
}

function writeQuery(sel: SelEvent | null, preset: string): void {
  if (typeof window === 'undefined') return;
  const q = new URLSearchParams();
  if (sel) {
    q.set('platform', sel.platform);
    q.set('id', sel.id);
  }
  if (preset) q.set('preset', preset);
  const qs = q.toString();
  window.location.hash = qs ? `#/announce?${qs}` : '#/announce';
}

// Style legend as Discord renders each token in the READER's own time zone.
const TIME_LEGEND: { style: string; example: string }[] = [
  { style: 't', example: '16:20' },
  { style: 'T', example: '16:20:30' },
  { style: 'd', example: '20/04/2021' },
  { style: 'D', example: '20 April 2021' },
  { style: 'f', example: '20 April 2021 16:20' },
  { style: 'F', example: 'Tuesday, 20 April 2021 16:20' },
  { style: 'R', example: 'in 2 months' },
];

export default function Announce({ query }: { query: string }): React.JSX.Element {
  const initial = useMemo(() => parseQuery(query), []); // seed once; URL updates never clobber edits
  const { addNotification } = useNotification();

  const [enabled, setEnabled] = useState<Platform[]>(['vrctl', 'vrcpop']);
  useEffect(() => {
    void getSettings().then((s) => setEnabled(enabledPlatforms(s)));
    return onSettingsChange((s) => setEnabled(enabledPlatforms(s)));
  }, []);

  const [sel, setSel] = useState<SelEvent | null>(initial.sel);
  const [selectedId, setSelectedId] = useState<string>(initial.preset);
  const [draft, setDraft] = useState<AnnouncePreset | null>(null);
  const [links, setLinks] = useState<AnnounceLink[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const conns = useResource('connections', loadConnections);
  const c = conns.data;
  const vt = useResource(c?.vrctl.connected ? 'platform:vrctl' : null, () => loadPlatformData('vrctl'));
  const vp = useResource(c?.vrcpop.connected ? 'platform:vrcpop' : null, () => loadPlatformData('vrcpop'));
  const rp = useResource(enabled.includes('ravepage') && c?.ravepage.connected ? 'platform:ravepage' : null, () => loadPlatformData('ravepage'));
  const linksRes = useResource('links', listLinks);
  const presetsRes = useResource('announce:presets', listPresets);
  const eventRes = useResource(sel ? `event:${sel.platform}:${sel.id}` : null, () => readEventCore(sel!.platform, sel!.id));

  const presets = presetsRes.data ?? [];
  const selected = presets.find((p) => p.id === selectedId) ?? null;
  const isBuiltin = selected?.builtin === true;

  // Default the preset selection to the first builtin when nothing is chosen, or
  // when a chosen id is truly absent from a SETTLED list. The `loading` guard is
  // load-bearing: right after creating a preset the id is selected before the
  // list reloads, and without it the reset would clobber that fresh selection.
  useEffect(() => {
    if (presets.length === 0 || presetsRes.loading) return;
    if (selectedId === '' || !presets.some((p) => p.id === selectedId)) setSelectedId(presets[0]!.id);
  }, [presets, presetsRes.loading, selectedId]);

  // Reset the working draft from the store when the selection or its saved
  // revision changes; local field edits keep the same id/updatedAt so they survive.
  useEffect(() => {
    if (selected) setDraft({ ...selected });
  }, [selected?.id, selected?.updatedAt]);

  const connectedPlatforms = enabled.filter((p) => c?.[p].connected);
  const anyConnected = connectedPlatforms.length > 0;
  // First load of any connected platform's events still in flight -> show the
  // spinner, never flash the "nothing to announce" empty state.
  const eventsLoading =
    (!!c?.vrctl.connected && vt.loading && !vt.data) ||
    (!!c?.vrcpop.connected && vp.loading && !vp.data) ||
    (enabled.includes('ravepage') && !!c?.ravepage.connected && rp.loading && !rp.data);

  const rows = [vt.data, vp.data, rp.data].flatMap((d) => d?.events ?? []);
  const eventOptions: SmartSelectOption[] = rows
    .filter((r) => isUpcoming(r))
    .map((r) => ({
      value: `${r.platform}:${r.id}`,
      label: [r.title, formatLocalDateTime(r.start, r.zone), PLATFORM_NAME[r.platform]].filter(Boolean).join(' · '),
      keywords: [r.clubName],
    }));
  const selValue = sel ? `${sel.platform}:${sel.id}` : null;
  if (selValue && !eventOptions.some((o) => o.value === selValue)) {
    const title = eventRes.data?.title;
    eventOptions.unshift({
      value: selValue,
      label: [title, PLATFORM_NAME[sel!.platform]].filter(Boolean).join(' · '),
    });
  }

  const presetOptions: SmartSelectOption[] = presets.map((p) => ({
    value: p.id,
    label: p.name,
    meta: p.builtin ? 'built-in' : undefined,
  }));

  // Resolve every linked platform's PUBLIC event URL (async) into AnnounceLink[].
  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!sel) {
        if (alive) setLinks([]);
        return;
      }
      const link = (linksRes.data ?? []).find((l) => l.refs.some((r) => r.platform === sel.platform && r.id === sel.id));
      const refs = link
        ? [...link.refs].sort((a, b) => PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform))
        : [{ platform: sel.platform, id: sel.id }];
      const resolved = await Promise.all(
        refs.map(async (r) => ({ platform: r.platform, url: await publicEventUrl(r.platform, r.id), label: PLATFORM_NAME[r.platform] })),
      );
      if (alive) setLinks(resolved);
    })().catch(() => {
      if (alive) setLinks([]);
    });
    return () => {
      alive = false;
    };
  }, [sel?.platform, sel?.id, linksRes.data]);

  const core = eventRes.data;
  const previewText = core && draft ? renderAnnouncement(draft, { core, links }) : '';
  const over = previewText.length > 2000;

  const dirty =
    !!draft &&
    !!selected &&
    !selected.builtin &&
    (draft.name !== selected.name ||
      draft.header !== selected.header ||
      draft.slotLine !== selected.slotLine ||
      draft.footer !== selected.footer ||
      draft.emptyLineup !== selected.emptyLineup);

  const upd = (patch: Partial<AnnouncePreset>): void => setDraft((d) => (d ? { ...d, ...patch } : d));

  const onSelectEvent = (v: string | string[] | null): void => {
    if (typeof v !== 'string') return;
    const ci = v.indexOf(':');
    const platform = v.slice(0, ci) as Platform;
    const id = v.slice(ci + 1);
    const next: SelEvent = { platform, id };
    setSel(next);
    writeQuery(next, selectedId);
  };

  const onSelectPreset = (v: string | string[] | null): void => {
    if (typeof v !== 'string') return;
    setSelectedId(v);
    writeQuery(sel, v);
  };

  const selectNewPreset = (p: AnnouncePreset): void => {
    setSelectedId(p.id);
    setDraft({ ...p });
    presetsRes.refresh();
    writeQuery(sel, p.id);
  };

  const onDuplicate = (): void => {
    if (!selected) return;
    void duplicatePreset(selected.id, `${selected.name} copy`)
      .then(selectNewPreset)
      .catch((e: unknown) => addNotification(e instanceof Error ? e.message : 'Duplicate failed', 'error'));
  };

  const onNew = (): void => {
    void duplicatePreset(CLASSIC.id, 'New preset')
      .then(selectNewPreset)
      .catch((e: unknown) => addNotification(e instanceof Error ? e.message : 'Create failed', 'error'));
  };

  const onSave = (): void => {
    if (!draft) return;
    void savePreset(draft)
      .then(() => {
        presetsRes.refresh();
        addNotification('Preset saved', 'success');
      })
      .catch((e: unknown) => addNotification(e instanceof Error ? e.message : 'Save failed', 'error'));
  };

  const onDelete = (): void => {
    setConfirmDelete(false);
    if (!selected) return;
    void deletePreset(selected.id)
      .then(() => {
        setSelectedId(DEFAULT_PRESETS[0]!.id);
        presetsRes.refresh();
        addNotification('Preset deleted', 'info');
      })
      .catch((e: unknown) => addNotification(e instanceof Error ? e.message : 'Delete failed', 'error'));
  };

  const onCopy = useCallback(async (): Promise<void> => {
    const text = previewText;
    try {
      await navigator.clipboard.writeText(text);
      addNotification('Copied to clipboard', 'success');
      return;
    } catch {
      // Extension pages in headless Chromium may deny the async clipboard API;
      // fall back to a transient textarea + execCommand, still toasting success.
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) {
          addNotification('Copied to clipboard', 'success');
          return;
        }
      } catch {
        /* fall through to the error toast */
      }
      addNotification('Copy failed — select the preview to copy it manually', 'error');
    }
  }, [previewText, addNotification]);

  const readOnlyCls = 'bg-muted/40 text-muted-foreground';

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="announce">
      <header className="mb-4">
        <h1 className="font-orbitron text-2xl text-foreground">Announce</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Build a Discord-ready post for your event — live <code className="text-2xs">&lt;t:…&gt;</code> timestamps, your lineup and links to every platform, from presets you design.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* LEFT: event + preset */}
        <div className="flex flex-col gap-4">
          <Card data-testid="announce-event">
            <CardHeader>
              <CardTitle>Event</CardTitle>
            </CardHeader>
            <CardContent>
              {!conns.data ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoadingSpinner /> Checking your sessions…
                </div>
              ) : !anyConnected ? (
                <EmptyState
                  data-testid="announce-none-connected"
                  headingLevel="h2"
                  title="Connect a platform first"
                  description="Sign in to a platform to pick one of your events to announce."
                  action={
                    <a href="#/" className="text-sm text-brand-violet-soft underline">
                      Go to Overview
                    </a>
                  }
                />
              ) : eventsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoadingSpinner /> Loading your events…
                </div>
              ) : eventOptions.length === 0 ? (
                <EmptyState
                  data-testid="announce-no-events"
                  headingLevel="h2"
                  title="No upcoming events to announce"
                  description="Announcements are built from your upcoming own events. Create one first or transfer an existing event."
                  action={
                    <Button asChild>
                      <a href="#/events/new">Create event</a>
                    </Button>
                  }
                />
              ) : (
                <>
                  <div data-testid="announce-event-select">
                    <SmartSelect
                      label="Your upcoming events"
                      placeholder="Pick an event"
                      options={eventOptions}
                      value={selValue}
                      onChange={onSelectEvent}
                    />
                  </div>
                  {links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {links.map((l) => (
                        <a
                          key={l.platform}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`announce-link-${l.platform}`}
                          className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-2xs text-foreground underline-offset-2 hover:underline"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card data-testid="announce-preset">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Preset</CardTitle>
              <Button type="button" size="sm" variant="outline" data-testid="announce-preset-new" onClick={onNew}>
                New preset
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div data-testid="announce-preset-select">
                <SmartSelect options={presetOptions} value={selectedId || null} onChange={onSelectPreset} placeholder="Select a preset" />
              </div>

              {isBuiltin && (
                <div className="flex items-center gap-2">
                  <Badge variant="info" caps>
                    built-in
                  </Badge>
                  <span className="text-2xs text-muted-foreground">Read-only. Duplicate it to make your own.</span>
                </div>
              )}

              {draft && (
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-2xs uppercase tracking-wide text-muted-foreground">Name</span>
                    <Input
                      data-testid="announce-preset-name"
                      value={draft.name}
                      readOnly={isBuiltin}
                      className={isBuiltin ? readOnlyCls : undefined}
                      onChange={(e) => upd({ name: e.target.value })}
                    />
                  </label>
                  <PresetField testId="announce-preset-header" label="Header" value={draft.header} readOnly={isBuiltin} onChange={(v) => upd({ header: v })} />
                  <PresetField testId="announce-preset-slot" label="Per-slot line" value={draft.slotLine} readOnly={isBuiltin} onChange={(v) => upd({ slotLine: v })} />
                  <PresetField testId="announce-preset-footer" label="Footer" value={draft.footer} readOnly={isBuiltin} onChange={(v) => upd({ footer: v })} />
                  <PresetField testId="announce-preset-empty" label="Empty-lineup text" value={draft.emptyLineup} readOnly={isBuiltin} rows={1} onChange={(v) => upd({ emptyLineup: v })} />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {isBuiltin ? (
                  <Button type="button" size="sm" data-testid="announce-preset-duplicate" onClick={onDuplicate}>
                    Duplicate to edit
                  </Button>
                ) : (
                  <>
                    <Button type="button" size="sm" data-testid="announce-preset-save" disabled={!dirty} onClick={onSave}>
                      Save
                    </Button>
                    <Button type="button" size="sm" variant="outline" data-testid="announce-preset-duplicate" onClick={onDuplicate}>
                      Duplicate
                    </Button>
                    <Button type="button" size="sm" variant="destructive" data-testid="announce-preset-delete" onClick={() => setConfirmDelete(true)}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <details data-testid="announce-help" className="rounded-md border border-border bg-card p-3">
            <summary className="cursor-pointer text-sm text-foreground">Placeholders</summary>
            <div className="mt-3 flex flex-col gap-3">
              {(['event', 'slot'] as const).map((scope) => (
                <div key={scope}>
                  <p className="text-2xs uppercase tracking-wide text-muted-foreground mb-1">{scope} scope</p>
                  <ul className="flex flex-col gap-0.5">
                    {PLACEHOLDER_HELP.filter((t) => t.scope === scope).map((t) => (
                      <li key={`${scope}-${t.token}`} className="text-2xs text-foreground">
                        <code className="text-brand-violet-soft">{t.token}</code> — {t.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <p className="text-2xs uppercase tracking-wide text-muted-foreground mb-1">Time styles</p>
                <ul className="flex flex-col gap-0.5">
                  {TIME_LEGEND.map((s) => (
                    <li key={s.style} className="text-2xs text-foreground">
                      <code className="text-brand-violet-soft">{s.style}</code> {s.example}
                    </li>
                  ))}
                </ul>
                <p className="text-2xs text-muted-foreground mt-1">Discord shows every timestamp in each reader&apos;s own time zone.</p>
              </div>
            </div>
          </details>
        </div>

        {/* RIGHT: preview + copy */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {previewText ? (
                <>
                  <pre data-testid="announce-preview" className="whitespace-pre-wrap break-words rounded-md border border-border bg-card p-3 text-sm text-foreground">
                    {previewText}
                  </pre>
                  <p className="mt-2 flex items-center gap-2 text-2xs text-muted-foreground">
                    <span data-testid="announce-count">{previewText.length} characters</span>
                    {over && (
                      <Badge variant="warning" data-testid="announce-over-limit">
                        Discord message limit is 2000 characters
                      </Badge>
                    )}
                  </p>
                </>
              ) : (
                <EmptyState headingLevel="h2" title="Pick an event" description="Choose one of your events to see its announcement." />
              )}
            </CardContent>
          </Card>

          <div>
            <Button type="button" data-testid="announce-copy" disabled={!core} onClick={() => void onCopy()}>
              Copy for Discord
            </Button>
          </div>
        </div>
      </div>

      {/* Exact text for e2e / manual selection; hidden from layout. */}
      <textarea readOnly data-testid="announce-raw" hidden value={previewText} />

      <ConfirmDialog
        isOpen={confirmDelete}
        type="warning"
        title={`Delete “${selected?.name ?? ''}”?`}
        message="This preset is stored only in this browser and will be removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </main>
  );
}

function PresetField({
  testId,
  label,
  value,
  readOnly,
  rows = 2,
  onChange,
}: {
  testId: string;
  label: string;
  value: string;
  readOnly: boolean;
  rows?: number;
  onChange: (v: string) => void;
}): React.JSX.Element {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-2xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <Textarea
        data-testid={testId}
        value={value}
        rows={rows}
        readOnly={readOnly}
        className={readOnly ? 'bg-muted/40 text-muted-foreground font-mono text-2xs' : 'font-mono text-2xs'}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
