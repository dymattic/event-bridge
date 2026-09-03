import { ext } from '../../shared/webext';
import { BUILD_ID } from '../../shared/build-id';
import type { BackgroundRequest } from '../../shared/messages';
import type { SessionState } from '../../runtime/sessions';
import { usePlatformSessions, type PlatformRow } from './hooks/usePlatformSessions';
import { usePermission } from './hooks/usePermission';

// TODO(P0b): swap to @rave-page/ui Button/Badge once the shared kit is available.

const STATE_TEXT: Record<SessionState, string> = {
  'logged-in': 'Logged in',
  'logged-out': 'Logged out',
  'no-tab': 'No tab open',
  'no-permission': 'No access',
  error: 'Error',
};

// Hue = intent: mint confirm, amber warn, muted absent, brand-base action/error.
const STATE_CLASS: Record<SessionState, string> = {
  'logged-in': 'text-brand-mint',
  'logged-out': 'text-brand-amber',
  'no-tab': 'text-muted-foreground',
  'no-permission': 'text-brand-base',
  error: 'text-brand-base',
};

function Row({ row, onGranted }: { row: PlatformRow; onGranted: () => void }) {
  const { request } = usePermission(row.platform);
  const grant = (): void => {
    void request().then((ok) => {
      if (ok) onGranted();
    });
  };
  const label = row.status.info?.label ? ` (${row.status.info.label})` : '';
  return (
    <li className="flex items-center justify-between border-b border-border py-2">
      <span className="text-foreground">{row.name}</span>
      <span className="flex items-center gap-2">
        <span data-testid={`status-${row.platform}`} className={`text-2xs ${STATE_CLASS[row.status.state]}`}>
          {STATE_TEXT[row.status.state]}
          {label}
        </span>
        {row.status.state === 'no-permission' && (
          <button
            type="button"
            onClick={grant}
            className="text-2xs text-brand-base border border-border rounded px-2 h-[var(--control-h)]"
          >
            Grant access
          </button>
        )}
      </span>
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
        <button
          type="button"
          onClick={openDashboard}
          className="bg-brand-base text-white rounded-md h-[var(--control-h)] px-4"
        >
          Open dashboard
        </button>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="border border-border text-foreground rounded-md h-[var(--control-h)] px-4"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </main>
  );
}
