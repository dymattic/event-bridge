// rave.page chunked media upload (poster path). Runs on the dashboard (an
// extension page → CORS-exempt via host_permissions). Flow:
//   sha256(file) -> POST /media-upload/initiate -> PUT chunks (raw octet-stream +
//   X-Chunk-Checksum) -> POST …/complete -> poll GET …/status until the pipeline
//   is terminal -> PATCH /events/{id}/poster {media_upload_id}.
// The chunk plan + checksum helper are pure and unit-tested; the orchestrator
// takes injectable deps so tests can stub the network.
import { BridgeError } from '../../core/errors';
import type { PosterFile } from '../../core/schema';
import { API_BASE, toBridgeError } from './client';
import { ROUTES } from './routes';
import { clear, getValidToken } from './token-store';
import type { ChunkUploadNativeResponse } from './api-client/models/ChunkUploadNativeResponse';
import type { InitiateUploadRequest } from './api-client/models/InitiateUploadRequest';
import type { InitiateUploadResponse } from './api-client/models/InitiateUploadResponse';
import type { UploadStatusOut } from './api-client/models/UploadStatusOut';

const MAX_CHUNK = 10 * 1024 * 1024; // 10 MiB ceiling per chunk
const POLL_INTERVAL_MS = 1_000;
const POLL_MAX_MS = 30_000;
const PIPELINE_READY = 'ready';
const PIPELINE_FAILED = new Set(['failed', 'quarantined']);

export interface ChunkPlanEntry {
  index: number; // 0-based chunk number
  start: number; // byte offset, inclusive
  end: number; // byte offset, exclusive
}

// Pure: which chunks to send, skipping ones the server already holds. Chunk size
// is the server's chunk_size clamped to MAX_CHUNK.
export function planChunks(fileSize: number, chunkSize: number, alreadyUploaded: number[] = []): ChunkPlanEntry[] {
  const size = Math.min(chunkSize > 0 ? chunkSize : MAX_CHUNK, MAX_CHUNK);
  const total = Math.max(1, Math.ceil(fileSize / size));
  const done = new Set(alreadyUploaded);
  const out: ChunkPlanEntry[] = [];
  for (let i = 0; i < total; i++) {
    if (done.has(i)) continue;
    const start = i * size;
    out.push({ index: i, start, end: Math.min(start + size, fileSize) });
  }
  return out;
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  // Copy into a fresh ArrayBuffer-backed view: a bare Uint8Array is typed
  // Uint8Array<ArrayBufferLike>, which crypto.subtle.digest's BufferSource rejects.
  const buf = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function chunkChecksumHeader(hex: string): string {
  return `sha256:${hex}`;
}

export interface UploadDeps {
  digest(bytes: Uint8Array): Promise<string>;
  initiate(req: InitiateUploadRequest): Promise<InitiateUploadResponse>;
  putChunk(uploadId: string, index: number, bytes: Uint8Array): Promise<ChunkUploadNativeResponse>;
  complete(uploadId: string): Promise<void>;
  status(uploadId: string): Promise<UploadStatusOut>;
  sleep(ms: number): Promise<void>;
  now(): number;
}

async function rawPutChunk(uploadId: string, index: number, bytes: Uint8Array): Promise<ChunkUploadNativeResponse> {
  const token = await getValidToken();
  if (!token) throw new BridgeError('NOT_LOGGED_IN', 'no valid rave.page token');
  const checksum = chunkChecksumHeader(await sha256Hex(bytes));
  const url = `${API_BASE}/media-upload/${encodeURIComponent(uploadId)}/chunks/${index}`;
  let res: Response;
  try {
    // MediaUploadService.uploadChunk sends no request body and no X-Chunk-Checksum
    // header; the chunk PUT needs a raw octet-stream body + that header.
    res = await fetch(url, { // raw-fetch-allowed: chunk PUT (octet-stream + X-Chunk-Checksum)
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'X-Chunk-Checksum': checksum,
      },
      body: bytes as unknown as BodyInit,
    });
  } catch (e) {
    throw new BridgeError('NETWORK', e instanceof Error ? e.message : String(e));
  }
  if (res.status === 401) {
    void clear().catch(() => undefined);
    throw new BridgeError('NOT_LOGGED_IN', `chunk ${index} unauthorized`);
  }
  if (!res.ok) throw new BridgeError(res.status >= 500 ? 'NETWORK' : 'VALIDATION', `chunk ${index} -> HTTP ${res.status}`);
  return (await res.json()) as ChunkUploadNativeResponse;
}

export function defaultUploadDeps(): UploadDeps {
  return {
    digest: sha256Hex,
    initiate: (req) => ROUTES.initiateUpload({ requestBody: req }),
    putChunk: rawPutChunk,
    complete: (id) => ROUTES.completeUpload({ uploadId: id }).then(() => undefined),
    status: (id) => ROUTES.uploadStatus({ uploadId: id }),
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    now: () => Date.now(),
  };
}

// Upload a file via the chunked pipeline and return its media_upload_id (poster
// assign uses it). Resumes from the server's uploaded_chunk_numbers.
export async function uploadMedia(file: PosterFile, deps: UploadDeps = defaultUploadDeps()): Promise<string> {
  try {
    const fileHash = await deps.digest(file.bytes);
    const init = await deps.initiate({
      file_hash: fileHash,
      file_size: file.bytes.length,
      mime_type: file.mimeType,
      original_filename: file.filename,
    });
    const uploadId = init.upload_id;
    if (!uploadId) throw new BridgeError('VALIDATION', 'initiate returned no upload_id');

    if (init.status !== 'completed') {
      const plan = planChunks(file.bytes.length, init.chunk_size ?? MAX_CHUNK, init.uploaded_chunk_numbers ?? []);
      for (const c of plan) {
        const ack = await deps.putChunk(uploadId, c.index, file.bytes.slice(c.start, c.end));
        if (ack.status === 'checksum_mismatch') {
          throw new BridgeError('VALIDATION', `chunk ${c.index} checksum mismatch`);
        }
      }
      await deps.complete(uploadId);
    }

    const deadline = deps.now() + POLL_MAX_MS;
    for (;;) {
      const st = await deps.status(uploadId);
      const pipeline = st.pipeline_status ?? PIPELINE_READY;
      if (pipeline === PIPELINE_READY) break;
      if (PIPELINE_FAILED.has(pipeline)) {
        throw new BridgeError('VALIDATION', `upload pipeline ${pipeline}: ${st.pipeline_error ?? ''}`);
      }
      if (deps.now() >= deadline) throw new BridgeError('TIMEOUT', 'upload processing timed out');
      await deps.sleep(POLL_INTERVAL_MS);
    }
    return uploadId;
  } catch (e) {
    throw toBridgeError(e);
  }
}

// Upload the bytes then attach as the event poster.
export async function setEventPoster(eventId: string, file: PosterFile, deps?: UploadDeps): Promise<string> {
  const mediaUploadId = await uploadMedia(file, deps ?? defaultUploadDeps());
  try {
    await ROUTES.assignPoster({ eventId, requestBody: { media_upload_id: mediaUploadId } });
  } catch (e) {
    throw toBridgeError(e);
  }
  return mediaUploadId;
}

export async function removeEventPoster(eventId: string): Promise<void> {
  try {
    await ROUTES.deletePoster({ eventId });
  } catch (e) {
    throw toBridgeError(e);
  }
}
