import { expect, openDashboard, openPopup, openPlatformTab, test } from '../fixtures/extension';
import { CSRF, GROUP_ID, mockVrcpopSite, newRecorder, type VrcpopRecorder } from '../mocks/vrcpop-api';

// Runtime surface P2 exposes on the popup page (see src/ui/popup/main.tsx).
interface RuntimeApi {
  ensureAgent: (platform: string, opts: { allowOpen: boolean }) => Promise<{ tabId: number }>;
  callAgent: (
    tabId: number,
    op: unknown,
    opts?: { timeoutMs?: number },
  ) => Promise<{ status: number; finalUrl: string; headers: Record<string, string>; body: string | null }>;
  sendBlob: (tabId: number, bytes: Uint8Array, mime: string) => Promise<{ blobId: string; sha256?: string }>;
}

// --- Always-on integration: the agent transport + mock contract in a real
// browser (CSRF header pass-through, JSON writes, optimistic-lock version,
// multipart flyer via the blob protocol). Mirrors the adapter's requests; the
// adapter's own logic is covered exhaustively in test/adapters/vrcpop/. ---
test('vrcpop transport: create draft, update w/ version, stale->500, flyer multipart, delete', async ({ context }) => {
  const recorder: VrcpopRecorder = newRecorder();
  await mockVrcpopSite(context, recorder);
  await openPlatformTab(context, 'vrcpop');
  const popup = await openPopup(context);

  const out = await popup.evaluate(
    async ({ groupId }) => {
      const rt = (window as unknown as { __eventBridgeRuntime: RuntimeApi }).__eventBridgeRuntime;
      const { tabId } = await rt.ensureAgent('vrcpop', { allowOpen: false });
      const http = (request: unknown) => rt.callAgent(tabId, { op: 'http', request });

      const dash = await http({ method: 'GET', path: '/dashboard', responseType: 'text' });
      const csrf = /<meta name="csrf-token" content="([^"]+)"/.exec(dash.body ?? '')?.[1] ?? '';

      const created = await http({
        method: 'POST',
        path: '/api/events/?action=create',
        headers: { 'X-CSRF-Token': csrf },
        body: { kind: 'json', json: { action: 'create', group_id: groupId, event_name: '[event-bridge test] draft', status: 'draft', sets: [] } },
        responseType: 'json',
      });
      const eventId = JSON.parse(created.body ?? '{}').event_id as number;

      const edit = await http({ method: 'GET', path: `/manage/club/${groupId}/events/100001/edit`, responseType: 'text' });
      const version = Number(/version&quot;:(\d+)/.exec(edit.body ?? '')?.[1] ?? '0');

      const upd = await http({
        method: 'POST',
        path: '/api/events/?action=update',
        headers: { 'X-CSRF-Token': csrf },
        body: { kind: 'json', json: { action: 'update', event_id: 100001, version, group_id: groupId, event_name: '[event-bridge test] draft', status: 'draft', sets: [] } },
        responseType: 'json',
      });

      const stale = await http({
        method: 'POST',
        path: '/api/events/?action=update',
        headers: { 'X-CSRF-Token': csrf },
        body: { kind: 'json', json: { action: 'update', event_id: 100001, version: version - 1, group_id: groupId, event_name: 'x', status: 'draft', sets: [] } },
        responseType: 'json',
      });

      const bytes = new Uint8Array([137, 80, 78, 71, 1, 2, 3, 4]);
      const { blobId } = await rt.sendBlob(tabId, bytes, 'image/png');
      const flyer = await http({
        method: 'POST',
        path: '/api/events/upload-flyer.php',
        headers: { 'X-CSRF-Token': csrf },
        body: { kind: 'multipart', parts: [{ name: 'flyer', filename: 'f.png', mime: 'image/png', blobId }, { name: 'group_id', value: groupId }, { name: 'event_id', value: '100001' }] },
        responseType: 'json',
      });

      const del = await http({
        method: 'POST',
        path: '/api/events/?action=delete',
        headers: { 'X-CSRF-Token': csrf },
        body: { kind: 'json', json: { event_id: 100001 } },
        responseType: 'json',
      });

      return {
        csrf,
        eventId,
        version,
        createStatus: created.status,
        updateStatus: upd.status,
        staleStatus: stale.status,
        flyerStatus: flyer.status,
        flyerUrl: JSON.parse(flyer.body ?? '{}').flyer_url,
        deleteStatus: del.status,
      };
    },
    { groupId: GROUP_ID },
  );

  expect(out.csrf).toBe(CSRF);
  expect(out.createStatus).toBe(201);
  expect(out.eventId).toBe(100010);
  expect(out.version).toBe(2);
  expect(out.updateStatus).toBe(200);
  expect(out.staleStatus).toBe(500); // Concurrent edit detected
  expect(out.flyerStatus).toBe(200);
  expect(out.flyerUrl).toBe('/flyers/example.png');
  expect(out.deleteStatus).toBe(200);

  // recorder (Node side) captured the write bodies:
  expect(recorder.csrfSeen).toContain(CSRF);
  expect(recorder.createBodies[0]).toMatchObject({ status: 'draft', group_id: GROUP_ID });
  expect(recorder.updateBodies).toHaveLength(1); // only the fresh-version update succeeded
  expect(recorder.flyerUploads[0]).toMatchObject({ hasFlyer: true, groupId: GROUP_ID, eventId: '100001' });
  expect(recorder.deleteBodies[0]).toMatchObject({ event_id: 100001 });
});

// --- Panel-driven end-to-end. Requires the lead to wire VrcpopDevPanel into the
// dashboard (App.tsx is off-limits to P4). Skips cleanly until then; the lead
// un-skips after adding the #/dev/vrcpop route (see docs/platforms/vrcpop.md). ---
test('vrcpop dev panel: clubs -> events(draft) -> read -> preview==recorded create (draft) -> flyer -> conflict -> delete', async ({ context }) => {
  const recorder: VrcpopRecorder = newRecorder();
  await mockVrcpopSite(context, recorder);
  await openPlatformTab(context, 'vrcpop');
  const page = await openDashboard(context);
  await page.evaluate(() => {
    location.hash = '#/dev/vrcpop';
  });
  await page.reload();

  const panel = page.getByTestId('vrcpop-dev-panel');
  const wired = (await panel.count()) > 0;
  test.skip(!wired, 'VrcpopDevPanel not wired into App.tsx yet (App.tsx is off-limits to P4). Lead adds: `if (location.hash === "#/dev/vrcpop") return <VrcpopDevPanel/>;`');

  // clubs -> pick -> events (draft visible)
  await page.getByTestId('vp-clubs').click();
  await page.getByTestId('vp-club').first().click();
  await page.getByTestId('vp-events').click();
  const draft = page.locator('[data-testid="vp-event"][data-event-id="100002"]');
  await expect(draft).toBeVisible();
  await expect(draft).toContainText('draft');

  // read an event
  await page.locator('[data-testid="vp-event"][data-event-id="100001"]').click();
  await page.getByTestId('vp-read').click();
  await expect(page.getByTestId('vp-version')).toContainText('version 2');

  // preview create draft
  await page.getByTestId('vp-preview').click();
  const previewText = await page.getByTestId('vp-preview-json').innerText();
  const previewBody = JSON.parse(previewText);
  expect(previewBody).toMatchObject({ action: 'create', status: 'draft', group_id: GROUP_ID });

  // run create draft -> recorded body equals the preview
  await page.getByTestId('vp-run-create').click();
  await expect(page.getByTestId('vp-created-id')).toContainText('created');
  expect(recorder.createBodies[recorder.createBodies.length - 1]).toEqual(previewBody);

  // set flyer (planPoster: reread version + flyerUpload + update) succeeds
  await page.locator('[data-testid="vp-event"][data-event-id="100001"]').click();
  await page.getByTestId('vp-flyer').click();
  await page.getByTestId('vp-file').setInputFiles({ name: 'flyer.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71, 5, 6, 7, 8]) });
  await expect(page.getByTestId('vp-log')).toContainText('flyer set');
  expect(recorder.flyerUploads.at(-1)).toMatchObject({ hasFlyer: true, groupId: GROUP_ID, eventId: '100001' });

  // stale version -> the update inside the poster flow yields VERSION_CONFLICT
  recorder.forceStale = true;
  await page.getByTestId('vp-flyer').click();
  await page.getByTestId('vp-file').setInputFiles({ name: 'flyer2.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71, 9]) });
  await expect(page.getByTestId('vp-error')).toContainText('VERSION_CONFLICT');
  recorder.forceStale = false;

  // delete records {event_id}
  await page.getByTestId('vp-delete').click();
  await expect(page.getByTestId('vp-log')).toContainText('deleted');
  expect(recorder.deleteBodies.at(-1)).toMatchObject({ event_id: 100001 });
});
