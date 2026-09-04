import { Badge, Button } from '@rave-page/ui';
import { ext } from '../../shared/webext';
import { BUILD_ID } from '../../shared/build-id';
import type { BackgroundRequest } from '../../shared/messages';
import { ravepageStatusView, tabStatusView, type StatusView } from '../lib/status';
import { usePlatformSessions, type PlatformRow } from './hooks/usePlatformSessions';
import { usePermission } from './hooks/usePermission';

// Same wording as the dashboard Overview cards: tab platforms speak
// signed-in/out; rave.page speaks connected/not-connected (token store).
function statusViewFor(row: PlatformRow): StatusView {
  if (row.platform === 'ravepage') {
    const connected = row.status.state === 'logged-in';
    return ravepageStatusView(connected, row.status.info?.label, row.status.info?.expiresAt);
  }
  return tabStatusView(row.status);
}

function Row({ row, onGranted }: { row: PlatformRow; onGranted: () => void }) {
  const { request } = usePermission(row.platform);
  // request() calls ext.permissions.request synchronously (no await before it) —
  // Firefox needs the user gesture live when it runs.
  const grant = (): void => {
    void request().then((ok) => {
      if (ok) onGranted();
    });
  };
  const view = statusViewFor(row);
  return (
    <li className="flex items-center justify-between border-b border-border py-2">
      <span className="text-foreground">{row.name}</span>
      <div className="flex items-center gap-2">
        <Badge data-testid={`status-${row.platform}`} variant={view.variant}>
          {view.text}
        </Badge>
        {view.noAccess && (
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
