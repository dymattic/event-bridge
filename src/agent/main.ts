// Injected on demand per origin (P2+). Stateless, JSON-only messages.
import { ext } from '../shared/webext';
import { BUILD_ID } from '../shared/build-id';
import type { AgentMessage, AgentResponse } from '../shared/agent-protocol';

function isMessage(msg: unknown, type: AgentMessage['type']): boolean {
  return typeof msg === 'object' && msg !== null && (msg as { type?: unknown }).type === type;
}

const g = globalThis as { __eventBridgeAgent?: { buildId: string } };
// Idempotent: re-injection with the same build is a no-op; a new build re-registers.
if (g.__eventBridgeAgent?.buildId !== BUILD_ID) {
  g.__eventBridgeAgent = { buildId: BUILD_ID };
  ext.runtime.onMessage.addListener((msg: unknown, _sender, sendResponse) => {
    if (isMessage(msg, 'ping')) {
      const res: AgentResponse = { ok: true, origin: location.origin, buildId: BUILD_ID };
      sendResponse(res);
    }
    return true;
  });
}
