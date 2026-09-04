// Developer harness for the LineupEditor at #/dev/lineup. Loads a sanitized
// sample event (mirrors test/fixtures/core/lineup-sample.json), lets you pick
// target platforms, and mirrors the live core `Slot[]` as JSON. No real ids.
import { useState } from 'react';
import { Checkbox } from '@rave-page/ui';
import { BUILD_ID } from '../../../shared/build-id';
import { asIanaZone, asIsoUtc } from '../../../core/time';
import type { EventCore, Slot } from '../../../core/schema';
import type { Platform } from '../../../shared/agent-protocol';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { LineupEditor } from '../components/LineupEditor';

// Sanitized sample — same shape as test/fixtures/core/lineup-sample.json. Slot 2
// starts 30 min after slot 1 ends, so a vrc.tl target (no gaps) shows a gap
// badge + "Make contiguous".
const SAMPLE: EventCore = {
  title: 'Example Warehouse Night',
  description: 'A sanitized sample event for the lineup editor dev harness.',
  start: asIsoUtc('2026-09-10T20:00:00.000Z'),
  end: asIsoUtc('2026-09-10T23:30:00.000Z'),
  zone: asIanaZone('Europe/Berlin'),
  organizer: { name: 'Example Collective', platformIds: {} },
  lineup: [
    {
      order: 1,
      start: asIsoUtc('2026-09-10T20:00:00.000Z'),
      end: asIsoUtc('2026-09-10T21:00:00.000Z'),
      title: 'Opening',
      performers: [
        {
          name: 'Example DJ 1',
          aliases: [
            { platform: 'vrctl', name: 'Example DJ 1' },
            { platform: 'vrcpop', name: 'Example DJ 1' },
          ],
        },
      ],
      vj: { name: 'Example VJ', aliases: [] },
      dancers: [{ name: 'Example Dancer', aliases: [] }],
      genre: 'Techno',
      energy: 'High',
      notes: 'Warm up',
      publicNote: 'Doors at 8',
      privateNote: 'Backstage code 42',
    },
    {
      order: 2,
      start: asIsoUtc('2026-09-10T21:30:00.000Z'),
      end: asIsoUtc('2026-09-10T22:30:00.000Z'),
      performers: [{ name: 'Example DJ 2', aliases: [{ platform: 'ravepage', name: 'Example DJ 2' }] }],
      dancers: [],
    },
    {
      order: 3,
      start: asIsoUtc('2026-09-10T22:30:00.000Z'),
      end: asIsoUtc('2026-09-10T23:30:00.000Z'),
      performers: [{ name: 'Example DJ 3', aliases: [] }],
      dancers: [],
    },
  ],
  hosts: [],
  dancers: [],
  visibility: { publish: false, audience: 'unlisted' },
  flags: {},
  music: { genres: [] },
  links: {},
  extras: {},
};

export function LineupDevPanel(): React.JSX.Element {
  const [value, setValue] = useState<Slot[]>(SAMPLE.lineup);
  const [targets, setTargets] = useState<Platform[]>([]);

  const toggle = (p: Platform, on: boolean): void =>
    setTargets((cur) => (on ? [...cur, p].filter((x, i, a) => a.indexOf(x) === i) : cur.filter((x) => x !== p)));

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="lineup-dev-panel">
      <h2 className="font-orbitron text-xl text-foreground">Lineup editor dev panel</h2>
      <p className="text-2xs text-muted-foreground mb-3">build {BUILD_ID} · sample event · pick targets to see capability-driven affordances</p>

      <div className="mb-4 flex flex-wrap items-center gap-4" data-testid="lineup-targets">
        <span className="text-2xs uppercase tracking-wide text-muted-foreground">Targets</span>
        {PLATFORM_ORDER.map((p) => (
          <label key={p} className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              checked={targets.includes(p)}
              onCheckedChange={(v) => toggle(p, v === true)}
              data-testid={`lineup-target-${p}`}
            />
            {PLATFORM_NAME[p]}
          </label>
        ))}
      </div>

      <LineupEditor
        value={value}
        onChange={setValue}
        eventStart={SAMPLE.start}
        zone={SAMPLE.zone}
        targets={targets}
      />

      <details className="mt-4" open data-testid="lineup-json-details">
        <summary className="cursor-pointer text-2xs text-muted-foreground">Core lineup JSON</summary>
        <pre
          data-testid="lineup-json"
          className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-card p-2 text-2xs whitespace-pre-wrap"
        >
          {JSON.stringify(value, null, 2)}
        </pre>
      </details>
    </main>
  );
}
