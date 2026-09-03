import { useCallback, useEffect, useState } from 'react';
import { ext } from '../../../shared/webext';
import type { Platform } from '../../../shared/agent-protocol';
import { PLATFORM_ORIGINS } from '../../../runtime/tabs';

export function usePermission(platform: Platform): {
  granted: boolean;
  loading: boolean;
  request: () => Promise<boolean>;
} {
  const pattern = `${PLATFORM_ORIGINS[platform].origin}/*`;
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void ext.permissions.contains({ origins: [pattern] }).then((g) => {
      if (alive) {
        setGranted(g);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [pattern]);

  // MUST be called from within the click handler — Firefox requires the user
  // gesture to be live when permissions.request runs.
  const request = useCallback(async () => {
    const g = await ext.permissions.request({ origins: [pattern] });
    setGranted(g);
    return g;
  }, [pattern]);

  return { granted, loading, request };
}
