import { useCallback, useEffect, useState } from 'react';
import type { Platform } from '../../../shared/agent-protocol';
import { getSessionStatus, type SessionStatus } from '../../../runtime/sessions';
import { PLATFORMS, PLATFORM_ORIGINS } from '../../../runtime/tabs';

export interface PlatformRow {
  platform: Platform;
  name: string;
  status: SessionStatus;
}

const initialRows = (): PlatformRow[] =>
  PLATFORMS.map((p) => ({ platform: p, name: PLATFORM_ORIGINS[p].name, status: { state: 'no-tab' } }));

export function usePlatformSessions(): { rows: PlatformRow[]; loading: boolean; refresh: () => void } {
  const [rows, setRows] = useState<PlatformRow[]>(initialRows);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    void Promise.all(
      PLATFORMS.map(async (p) => ({
        platform: p,
        name: PLATFORM_ORIGINS[p].name,
        status: await getSessionStatus(p),
      })),
    ).then((rs) => {
      setRows(rs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, refresh };
}
