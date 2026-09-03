import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ensureAgent, queryPlatformTabs, PLATFORM_ORIGINS } from '../../runtime/tabs';
import { callAgent, sendBlob } from '../../runtime/agent-transport';
import { getSessionStatus } from '../../runtime/sessions';

// Runtime surface exposed on the popup page for e2e drivers (see e2e/tests/*).
// The popup is a privileged extension page, not reachable by web content.
declare global {
  interface Window {
    __eventBridgeRuntime?: {
      ensureAgent: typeof ensureAgent;
      queryPlatformTabs: typeof queryPlatformTabs;
      callAgent: typeof callAgent;
      sendBlob: typeof sendBlob;
      getSessionStatus: typeof getSessionStatus;
      PLATFORM_ORIGINS: typeof PLATFORM_ORIGINS;
    };
  }
}
window.__eventBridgeRuntime = { ensureAgent, queryPlatformTabs, callAgent, sendBlob, getSessionStatus, PLATFORM_ORIGINS };

const el = document.getElementById('root');
if (el) createRoot(el).render(<App />);
