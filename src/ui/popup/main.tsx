import { createRoot } from 'react-dom/client';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { App } from './App';
import { ensureAgent, queryPlatformTabs, getPlatformMeta } from '../../runtime/tabs';
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
      getPlatformMeta: typeof getPlatformMeta;
    };
  }
}
window.__eventBridgeRuntime = { ensureAgent, queryPlatformTabs, callAgent, sendBlob, getSessionStatus, getPlatformMeta };

const el = document.getElementById('root');
if (el)
  createRoot(el).render(
    <TooltipProvider>
      <NotificationProvider>
        <App />
        <Toast />
      </NotificationProvider>
    </TooltipProvider>,
  );
