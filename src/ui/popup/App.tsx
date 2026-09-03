import { Badge, Button, type BadgeProps } from '@rave-page/ui';
import { ext } from '../../shared/webext';
import { BUILD_ID } from '../../shared/build-id';
import type { BackgroundRequest } from '../../shared/messages';
import type { SessionState } from '../../runtime/sessions';
import { usePlatformSessions, type PlatformRow } from './hooks/usePlatformSessions';
import { usePermission } from './hooks/usePermission';

const STATE_TEXT: Record<SessionState, string> = {
  'logged-in': 'Logged in',
  'logged-out': 'Logged out',
  'no-tab': 'No tab open',
  'no-permission': 'No access',
  error: 'Error',
};

// Hue = intent (kit Badge variants): mint confirm, amber warn, neutral chrome
// when absent, brand-base soft for the error/no-access states.
const STATE_VARIANT: Record<SessionState, BadgeProps['variant']> = {
  'logged-in': 'success',
  'logged-out': 'warning',
  'no-tab': 'secondary',
  'no-permission': 'error',
  error: 'error',
};

function Row({ row, onGranted }: { row: PlatformRow; onGranted: () => void }) {
  const { request } = usePermission(row.platform);
  // request() calls ext.permissions.request synchronously (no await before it) —
  // Firefox needs the user gesture live when it runs.
  const grant = (): void => {
    void request().then((ok) => {
      if (ok) onGranted();
    });
  };
  const label = row.status.info?.label ? ` (${row.status.info.label})` : '';
  return (
    <li className="flex items-center justify-between border-b border-border py-2">
      <span className="text-foreground">{row.name}</span>
      <div className="flex items-center gap-2">
        <Badge data-testid={`status-${row.platform}`} variant={STATE_VARIANT[row.status.state]}>
          {STATE_TEXT[row.status.state]}
          {label}
        </Badge>
        {row.status.state === 'no-permission' && (
          <Button type="button" variant="outline" size="sm" onClick={grant}>
            Grant access
          </Button>
        )}
      </div>
    </li>
  );
}

export function App() {
  const { rows, loading, refresh } = usePlatformSessions();
  const openDashboard = (): void => {
    const msg: BackgroundRequest = { type: 'open-dashboard' };
    void ext.runtime.sendMessage(msg);
  };
  return (
    <main className="min-w-[280px] p-3 bg-background">
      <h1 className="font-orbitron text-lg text-foreground">event-bridge</h1>
      <p className="text-2xs text-muted-foreground mb-2">build {BUILD_ID}</p>
      <ul className="mb-3">
        {rows.map((r) => (
          <Row key={r.platform} row={r} onGranted={refresh} />
        ))}
      </ul>
      <div className="flex gap-2">
        <Button type="button" onClick={openDashboard}>
          Open dashboard
        </Button>
        <Button type="button" variant="outline" onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>
    </main>
  );
}
