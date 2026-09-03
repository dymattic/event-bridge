import { createRoot } from 'react-dom/client';
import { NotificationProvider, Toast, TooltipProvider } from '@rave-page/ui';
import { App } from './App';

// Providers required by @rave-page/ui: TooltipProvider backs any Button/tooltip;
// NotificationProvider + <Toast/> back useNotification(). Mount once at the root.
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
