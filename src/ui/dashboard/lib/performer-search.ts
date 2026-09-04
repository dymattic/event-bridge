// Cross-platform performer search backing the LineupEditor's add-performer
// picker. Fans out `resolvePerformer` over the target adapters (platforms in
// parallel, each third-party host paced ≥300 ms via event-data's shared
// throttle), merges hits by lowercased name into one Performer per name with
// one alias per platform, and keeps a side map so a chosen pick resolves back
// to that Performer. One platform failing degrades to the others — a search
// never throws. Wraps the adapter registry (webext), so NOT node-importable;
// the editor render test mocks it.
import type { Performer, PerformerAlias } from '../../../core/schema';
import type { Platform } from '../../../shared/agent-protocol';
import type { PerformerPick } from '@rave-page/ui';
import { getAdapter } from '../../../adapters/registry';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';
import { paceHost } from './event-data';

const MIN_QUERY = 2;

export interface PerformerSearchController {
  search(query: string): Promise<PerformerPick[]>;
  resolve(pickId: string | null | undefined): Performer | undefined;
}

export function createPerformerSearch(targets: Platform[]): PerformerSearchController {
  const byPick = new Map<string, Performer>();

  async function search(query: string): Promise<PerformerPick[]> {
    const q = query.trim();
    if (q.length < MIN_QUERY) return [];

    const perPlatform = await Promise.all(
      targets.map(async (platform) => {
        try {
          await paceHost(platform);
          const matches = await getAdapter(platform).resolvePerformer(q);
          return { platform, matches };
        } catch {
          return { platform, matches: [] }; // degrade: one host down != whole search down
        }
      }),
    );

    // merge by lowercased name; one alias per contributing platform.
    const merged = new Map<string, { name: string; aliases: PerformerAlias[]; platforms: Set<Platform> }>();
    for (const { platform, matches } of perPlatform) {
      for (const m of matches) {
        const key = m.name.trim().toLowerCase();
        if (!key) continue;
        const cur = merged.get(key) ?? { name: m.name, aliases: [], platforms: new Set<Platform>() };
        cur.aliases.push({ platform, id: m.id, name: m.name });
        cur.platforms.add(platform);
        merged.set(key, cur);
      }
    }

    byPick.clear();
    const picks: PerformerPick[] = [];
    for (const [key, v] of merged) {
      const pickId = `merged:${key}`;
      byPick.set(pickId, { name: v.name, aliases: v.aliases });
      const subtitle = PLATFORM_ORDER.filter((p) => v.platforms.has(p)).map((p) => PLATFORM_NAME[p]).join(' · ');
      picks.push({ id: pickId, name: v.name, subtitle: subtitle || null });
    }
    return picks;
  }

  function resolve(pickId: string | null | undefined): Performer | undefined {
    return pickId ? byPick.get(pickId) : undefined;
  }

  return { search, resolve };
}
