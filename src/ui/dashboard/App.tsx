import { BUILD_ID } from '../../shared/build-id';

const PLATFORMS = ['vrc.tl', 'vrcpop.com', 'rave.page', 'development.rave.page'];

export function App() {
  return (
    <main className="p-4">
      <h1 className="font-orbitron text-2xl text-foreground">
        event-bridge <span data-testid="brand" className="text-brand-base">.page</span>
      </h1>
      <p className="text-2xs text-muted-foreground mb-3">build {BUILD_ID}</p>
      <ul className="list-disc pl-5">
        {PLATFORMS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </main>
  );
}
