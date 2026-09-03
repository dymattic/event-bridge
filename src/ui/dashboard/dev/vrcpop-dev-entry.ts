// Non-React mount for the vrcpop dev panel, so the lead can wire it with one
// line without importing JSX into App.tsx. See docs/platforms/vrcpop.md.
//
// Wiring option A (App.tsx hash route), the intended path:
//   import { VrcpopDevPanel } from './dev/VrcpopDevPanel';
//   if (location.hash === '#/dev/vrcpop') return <VrcpopDevPanel />;
//
// Wiring option B (main.tsx, no JSX in App):
//   import { mountVrcpopDevPanel } from './dev/vrcpop-dev-entry';
//   if (location.hash === '#/dev/vrcpop') { mountVrcpopDevPanel(el); }
//   else createRoot(el).render(<App />);
import { createRoot, type Root } from 'react-dom/client';
import { createElement } from 'react';
import { VrcpopDevPanel } from './VrcpopDevPanel';

export function mountVrcpopDevPanel(el: HTMLElement): Root {
  const root = createRoot(el);
  root.render(createElement(VrcpopDevPanel));
  return root;
}
