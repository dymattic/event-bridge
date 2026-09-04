// Editor Lineup-tab helper: resolve free-text performers to real ids on targets
// that REQUIRE them (vrc.tl). Exact case-insensitive name matches are adopted
// automatically; the rest get a search picker. A pick adds the platform alias to
// the lineup performer so the create/transfer carries the id, not the name.
// Reuses performer-search.ts (paced, per-target). Shown only when a checked
// required-id target has an unresolved performer.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, SmartSelect, type SmartSelectOption } from '@rave-page/ui';
import type { PerformerAlias, Slot } from '../../../core/schema';
import { CAPS } from '../../../core/capabilities';
import type { Platform } from '../../../shared/agent-protocol';
import { PLATFORM_NAME } from '../../lib/platform-meta';
import { createPerformerSearch } from '../lib/performer-search';

export interface PerformerResolverProps {
  lineup: Slot[];
  targets: Platform[];
  onResolve: (slotIdx: number, perfIdx: number, alias: PerformerAlias) => void;
}

interface Unresolved {
  slotIdx: number;
  perfIdx: number;
  name: string;
  platforms: Platform[]; // required-id targets this performer still lacks
}

function computeUnresolved(lineup: Slot[], required: Platform[]): Unresolved[] {
  const out: Unresolved[] = [];
  lineup.forEach((slot, slotIdx) => {
    slot.performers.forEach((p, perfIdx) => {
      const platforms = required.filter((rp) => !p.aliases.some((a) => a.platform === rp && a.id));
      if (platforms.length && p.name.trim()) out.push({ slotIdx, perfIdx, name: p.name, platforms });
    });
  });
  return out;
}

export function PerformerResolver({ lineup, targets, onResolve }: PerformerResolverProps): React.JSX.Element | null {
  const required = useMemo(() => targets.filter((p) => CAPS[p].performerIds === 'required'), [targets]);
  const requiredKey = required.join(',');
  const unresolved = useMemo(() => computeUnresolved(lineup, required), [lineup, requiredKey]);
  const unresolvedKey = unresolved.map((u) => `${u.slotIdx}.${u.perfIdx}:${u.name}`).join('|');

  // Auto-adopt exact matches once per (platforms, name). resolve() reads the same
  // search's side map, so a hit carries the platform alias with its id.
  const controller = useMemo(() => createPerformerSearch(required), [requiredKey]);
  const attempted = useRef<Set<string>>(new Set());
  useEffect(() => {
    let alive = true;
    void (async () => {
      for (const u of unresolved) {
        const key = `${u.platforms.join(',')}:${u.name.trim().toLowerCase()}`;
        if (attempted.current.has(key)) continue;
        attempted.current.add(key);
        try {
          const picks = await controller.search(u.name);
          const exact = picks.find((p) => p.name.trim().toLowerCase() === u.name.trim().toLowerCase());
          const perf = exact ? controller.resolve(exact.id) : undefined;
          if (!perf || !alive) continue;
          for (const rp of u.platforms) {
            const alias = perf.aliases.find((a) => a.platform === rp && a.id);
            if (alias) onResolve(u.slotIdx, u.perfIdx, alias);
          }
        } catch {
          // degrade: leave for the manual picker
        }
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unresolvedKey, requiredKey]);

  if (required.length === 0 || unresolved.length === 0) return null;

  return (
    <Card className="mt-4" data-testid="performer-resolver">
      <CardHeader>
        <CardTitle as="h3">Resolve performers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-2xs text-muted-foreground">
          {required.map((p) => PLATFORM_NAME[p]).join(', ')} needs a known performer for each of these — search and pick so the
          transfer carries the real id.
        </p>
        {unresolved.map((u) => (
          <PerformerPicker key={`${u.slotIdx}-${u.perfIdx}`} u={u} onResolve={onResolve} />
        ))}
      </CardContent>
    </Card>
  );
}

function PerformerPicker({ u, onResolve }: { u: Unresolved; onResolve: PerformerResolverProps['onResolve'] }): React.JSX.Element {
  const controller = useMemo(() => createPerformerSearch(u.platforms), [u.platforms.join(',')]);
  const [options, setOptions] = useState<SmartSelectOption[]>([]);
  const [value, setValue] = useState<string | null>(null);

  const onQuery = (q: string): void => {
    void controller.search(q).then((picks) =>
      setOptions(picks.filter((p): p is { id: string; name: string; subtitle?: string | null } => !!p.id).map((p) => ({ value: p.id, label: p.name, meta: p.subtitle ?? undefined }))),
    );
  };
  const onChange = (v: string | string[] | null): void => {
    const id = typeof v === 'string' ? v : null;
    setValue(id);
    const perf = id ? controller.resolve(id) : undefined;
    if (!perf) return;
    for (const rp of u.platforms) {
      const alias = perf.aliases.find((a) => a.platform === rp && a.id);
      if (alias) onResolve(u.slotIdx, u.perfIdx, alias);
    }
  };

  return (
    <div data-testid={`resolve-${u.slotIdx}-${u.perfIdx}`}>
      <SmartSelect
        label={`${u.name} → ${u.platforms.map((p) => PLATFORM_NAME[p]).join(', ')}`}
        allowSearch
        options={options}
        value={value}
        placeholder="Search performers…"
        onChange={onChange}
        onQueryChange={onQuery}
        filterOption={() => true}
      />
    </div>
  );
}
