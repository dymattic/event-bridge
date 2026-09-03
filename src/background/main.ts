// SW (Chrome) / event page (Firefox). Sole job: open or focus the dashboard tab.
// WebWorker lib only — no DOM types here (see tsconfig.background.json).
import { ext } from '../shared/webext';
import { BUILD_ID } from '../shared/build-id';

const DASHBOARD_URL = ext.runtime.getURL('dashboard.html');

async function openDashboard(): Promise<void> {
  const tabs = await ext.tabs.query({ url: `${DASHBOARD_URL}*` });
  const existing = tabs[0];
  if (existing?.id != null) {
    await ext.tabs.update(existing.id, { active: true });
    await ext.windows.update(existing.windowId, { focused: true });
    return;
  }
  await ext.tabs.create({ url: DASHBOARD_URL });
}

ext.action.onClicked.addListener(() => {
  void openDashboard();
});

ext.runtime.onInstalled.addListener(() => {
  console.info('event-bridge', BUILD_ID);
});
