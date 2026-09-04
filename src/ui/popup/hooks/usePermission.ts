import { useCallback, useEffect, useState } from 'react';
import { ext } from '../../../shared/webext';
import type { Platform } from '../../../shared/agent-protocol';
import { getPlatformMeta } from '../../../runtime/tabs';

export function usePermission(platform: Platform): {
  granted: boolean;
  loading: boolean;
  request: () => Promise<boolean>;
} {
  // rave.page's origin is instance-configurable → resolve the match pattern async.
  const [pattern, setPattern] = useState<string | null>(null);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    void getPlatformMeta(platform).then(async (meta) => {
      const pat = `${meta.origin}/*`;
      if (!alive) return;
      setPattern(pat);
      const g = await ext.permissions.contains({ origins: [pat] });
      if (alive) {
        setGranted(g);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [platform]);

  // MUST be called from within the click handler — Firefox requires the user
  // gesture to be live when permissions.request runs (pattern is pre-resolved).
  const request = useCallback(async () => {
    if (!pattern) return false;
    const g = await ext.permissions.request({ origins: [pattern] });
    setGranted(g);
    return g;
  }, [pattern]);

  return { granted, loading, request };
}
