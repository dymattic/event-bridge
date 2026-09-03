// SW (Chrome) / event page (Firefox). Sole job: open or focus the dashboard tab
// (on toolbar click, or on an `open-dashboard` runtime message from popup/dashboard).
// WebWorker lib only — no DOM types here (see tsconfig.background.json).
import { ext } from '../shared/webext';
import { BUILD_ID } from '../shared/build-id';
import { isBackgroundRequest, type BackgroundResponse } from '../shared/messages';

const DASHBOARD_URL = ext.runtime.getURL('dashboard.html');

async function openDashboard(): Promise<void> {
  const tabs = await ext.tabs.query({ url: `${DASHBOARD_URL}*` });
  const existing = tabs[0];
  if (existing?.id != null) {
    await ext.tabs.update(existing.id, { active: true });
    if (existing.windowId != null) await ext.windows.update(existing.windowId, { focused: true });
    return;
  }
  await ext.tabs.create({ url: DASHBOARD_URL });
}

ext.action.onClicked.addListener(() => {
  void openDashboard();
});

ext.runtime.onMessage.addListener((msg: unknown, _sender, sendResponse) => {
  if (isBackgroundRequest(msg)) {
    openDashboard().then(
      () => sendResponse({ ok: true } satisfies BackgroundResponse),
      (e: unknown) =>
        sendResponse({ ok: false, message: e instanceof Error ? e.message : String(e) } satisfies BackgroundResponse),
    );
    return true; // async response
  }
  return false;
});

ext.runtime.onInstalled.addListener(() => {
  console.info('event-bridge', BUILD_ID);
});
