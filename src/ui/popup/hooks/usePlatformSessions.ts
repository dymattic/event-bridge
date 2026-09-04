import { useCallback, useEffect, useState } from 'react';
import type { Platform } from '../../../shared/agent-protocol';
import { getSessionStatus, type SessionStatus } from '../../../runtime/sessions';
import { enabledPlatforms, getSettings, onSettingsChange } from '../../../runtime/settings';
import { PLATFORM_NAME } from '../../lib/platform-meta';

export interface PlatformRow {
  platform: Platform;
  name: string;
  status: SessionStatus;
}

const placeholder = (list: Platform[]): PlatformRow[] =>
  list.map((p) => ({ platform: p, name: PLATFORM_NAME[p], status: { state: 'no-tab' } }));

export function usePlatformSessions(): { rows: PlatformRow[]; loading: boolean; refresh: () => void } {
  // rave.page row only when the experimental toggle is on.
  const [rows, setRows] = useState<PlatformRow[]>(() => placeholder(['vrctl', 'vrcpop']));
  const [loading, setLoading] = useState(true);

  const load = useCallback((list: Platform[]) => {
    setRows(placeholder(list));
    setLoading(true);
    void Promise.all(
      list.map(async (p) => ({ platform: p, name: PLATFORM_NAME[p], status: await getSessionStatus(p) })),
    ).then((rs) => {
      setRows(rs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    void getSettings().then((s) => load(enabledPlatforms(s)));
    return onSettingsChange((s) => load(enabledPlatforms(s)));
  }, [load]);

  const refresh = useCallback(() => {
    void getSettings().then((s) => load(enabledPlatforms(s)));
  }, [load]);

  return { rows, loading, refresh };
}
