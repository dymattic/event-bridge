import { expect, mockPlatform, openPlatformTab, openPopup, test } from '../fixtures/extension';

interface RuntimeApi {
  ensureAgent: (platform: string, opts: { allowOpen: boolean }) => Promise<{ tabId: number; opened: boolean }>;
  sendBlob: (tabId: number, bytes: Uint8Array, mime: string) => Promise<{ blobId: string; sha256?: string }>;
}

// Proves the base64 slice protocol survives a real port round-trip: dashboard
// (popup page, same runtime) -> agent -> assembled blob -> agent-computed sha256.
test('3 MiB blob round-trips popup -> agent with matching sha256', async ({ context }) => {
  await mockPlatform(context, 'vrcpop', 'logged-in');
  await openPlatformTab(context, 'vrcpop');
  const popup = await openPopup(context);

  const result = await popup.evaluate(async () => {
    const rt = (window as unknown as { __eventBridgeRuntime: RuntimeApi }).__eventBridgeRuntime;
    const bytes = new Uint8Array(3 * 1024 * 1024);
    for (let off = 0; off < bytes.length; off += 65536) {
      crypto.getRandomValues(bytes.subarray(off, Math.min(off + 65536, bytes.length)));
    }
    const { tabId } = await rt.ensureAgent('vrcpop', { allowOpen: false });
    const ack = await rt.sendBlob(tabId, bytes, 'application/octet-stream');
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const local = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    return { agent: ack.sha256, local };
  });

  expect(result.local).toMatch(/^[0-9a-f]{64}$/);
  expect(result.agent).toBe(result.local);
});
