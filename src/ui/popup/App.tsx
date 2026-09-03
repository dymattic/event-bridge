import { ext } from '../../shared/webext';
import { BUILD_ID } from '../../shared/build-id';

export function App() {
  const openDashboard = (): void => {
    void ext.tabs.create({ url: ext.runtime.getURL('dashboard.html') });
  };
  return (
    <main className="min-w-[260px] p-3">
      <h1 className="font-orbitron text-lg text-foreground">event-bridge</h1>
      <p className="text-2xs text-muted-foreground mb-3">build {BUILD_ID}</p>
      <button
        type="button"
        onClick={openDashboard}
        className="bg-brand-base text-white rounded-md h-[var(--control-h)] px-4"
      >
        Open dashboard
      </button>
    </main>
  );
}
