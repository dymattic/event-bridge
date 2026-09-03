// Standalone mount for the vrc.tl dev panel. NOT built as its own entry today
// (tools/build.mjs bundles background/agent/popup/dashboard only). The lead wires
// the panel into the dashboard in P6 with one line in src/ui/dashboard/App.tsx:
//
//   import { VrctlDevPanel } from './dev/VrctlDevPanel';
//   ... <VrctlDevPanel />
//
// This helper exists so the panel can also be mounted directly (e.g. a future
// e2e that drives the real adapter through a built page). createElement (not JSX)
// keeps this a .ts file.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { VrctlDevPanel } from './VrctlDevPanel';

export function mountVrctlDevPanel(el: HTMLElement): void {
  createRoot(el).render(createElement(VrctlDevPanel));
}
