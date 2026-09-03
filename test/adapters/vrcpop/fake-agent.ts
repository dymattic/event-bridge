// In-memory VrcpopAgent for unit tests: records http requests + blobs, serves
// HttpResults from a handler. No real transport, no chrome globals.
import type { HttpRequest, HttpResult, SessionInfo } from '../../../src/shared/agent-protocol';
import type { VrcpopAgent } from '../../../src/adapters/vrcpop/types';

export type HttpHandler = (req: HttpRequest) => HttpResult | Promise<HttpResult>;

export interface FakeAgent {
  agent: VrcpopAgent;
  httpCalls: HttpRequest[];
  blobs: { bytes: Uint8Array; mime: string }[];
}

export function ok(body: unknown, status = 200): HttpResult {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return { status, finalUrl: `https://vrcpop.com/x`, headers: { 'content-type': 'application/json' }, body: text };
}

export function html(body: string, status = 200, finalUrl = 'https://vrcpop.com/x'): HttpResult {
  return { status, finalUrl, headers: { 'content-type': 'text/html' }, body };
}

export function makeFakeAgent(handler: HttpHandler, session: SessionInfo = { loggedIn: true, label: 'user 9001' }): FakeAgent {
  const httpCalls: HttpRequest[] = [];
  const blobs: { bytes: Uint8Array; mime: string }[] = [];
  let blobN = 0;
  const agent = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    call: (async (op: any) => {
      switch (op.op) {
        case 'http':
          httpCalls.push(op.request);
          return handler(op.request);
        case 'session':
          return session;
        case 'blobBegin':
        case 'blobChunk':
        case 'blobEnd':
        case 'blobDrop':
          return { blobId: op.blobId };
        default:
          throw new Error(`fake agent: unsupported op ${op.op}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
    async sendBlob(bytes: Uint8Array, mime: string) {
      blobs.push({ bytes, mime });
      return { blobId: `blob-${++blobN}`, sha256: 'deadbeef' };
    },
  } satisfies VrcpopAgent;
  return { agent, httpCalls, blobs };
}
