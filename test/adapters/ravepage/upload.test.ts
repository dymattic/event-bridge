import { beforeEach, describe, expect, it, vi } from 'vitest';

// upload.ts -> client/token-store -> webext; mock it so the module can load.
const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { chunkChecksumHeader, planChunks, uploadMedia, type UploadDeps } from '../../../src/adapters/ravepage/upload';
import type { PosterFile } from '../../../src/core/schema';
import { createFake } from '../../runtime/fake-ext';

const MiB = 1024 * 1024;

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('planChunks', () => {
  it('splits by chunk size with 0-based indexing and a short last chunk', () => {
    expect(planChunks(2500, 1000)).toEqual([
      { index: 0, start: 0, end: 1000 },
      { index: 1, start: 1000, end: 2000 },
      { index: 2, start: 2000, end: 2500 },
    ]);
  });

  it('skips already-uploaded chunks (resume)', () => {
    expect(planChunks(2500, 1000, [0, 2])).toEqual([{ index: 1, start: 1000, end: 2000 }]);
  });

  it('caps chunk size at 10 MiB', () => {
    const plan = planChunks(25 * MiB, 100 * MiB);
    expect(plan).toHaveLength(3); // ceil(25/10)
    expect(plan[0]).toEqual({ index: 0, start: 0, end: 10 * MiB });
    expect(plan[2]).toEqual({ index: 2, start: 20 * MiB, end: 25 * MiB });
  });
});

describe('chunkChecksumHeader', () => {
  it('prefixes sha256:', () => {
    expect(chunkChecksumHeader('deadbeef')).toBe('sha256:deadbeef');
  });
});

function file(size: number): PosterFile {
  return { bytes: new Uint8Array(size), mimeType: 'image/png', filename: 'poster.png' };
}

interface Calls {
  put: number[];
  completed: number;
}

function stubDeps(over: Partial<UploadDeps> = {}): { deps: UploadDeps; calls: Calls } {
  const calls: Calls = { put: [], completed: 0 };
  const deps: UploadDeps = {
    digest: async () => 'filehash',
    initiate: async () => ({ upload_id: 'upl_1', chunk_size: 1000, total_chunks: 3, uploaded_chunk_numbers: [], status: 'uploading' }),
    putChunk: async (_id, index) => {
      calls.put.push(index);
      return { status: 'ok', chunk_number: index };
    },
    complete: async () => {
      calls.completed++;
    },
    status: async () => ({ pipeline_status: 'ready' }),
    sleep: async () => undefined,
    now: () => 0,
    ...over,
  };
  return { deps, calls };
}

describe('uploadMedia', () => {
  it('uploads every chunk, completes, polls to ready, returns upload_id', async () => {
    const { deps, calls } = stubDeps();
    expect(await uploadMedia(file(2500), deps)).toBe('upl_1');
    expect(calls.put).toEqual([0, 1, 2]);
    expect(calls.completed).toBe(1);
  });

  it('resumes: sends only the chunks the server does not already hold', async () => {
    const { deps, calls } = stubDeps({
      initiate: async () => ({ upload_id: 'upl_1', chunk_size: 1000, uploaded_chunk_numbers: [0, 1], status: 'uploading' }),
    });
    await uploadMedia(file(2500), deps);
    expect(calls.put).toEqual([2]);
    expect(calls.completed).toBe(1);
  });

  it('skips chunk uploads + complete when initiate reports completed', async () => {
    const { deps, calls } = stubDeps({ initiate: async () => ({ upload_id: 'upl_1', chunk_size: 1000, status: 'completed' }) });
    await uploadMedia(file(2500), deps);
    expect(calls.put).toEqual([]);
    expect(calls.completed).toBe(0);
  });

  it('throws VALIDATION on a checksum mismatch', async () => {
    const { deps } = stubDeps({ putChunk: async (_id, index) => ({ status: 'checksum_mismatch', chunk_number: index }) });
    await expect(uploadMedia(file(1000), deps)).rejects.toMatchObject({ code: 'VALIDATION' });
  });

  it('throws when the pipeline fails', async () => {
    const { deps } = stubDeps({ status: async () => ({ pipeline_status: 'failed', pipeline_error: 'infected' }) });
    await expect(uploadMedia(file(1000), deps)).rejects.toMatchObject({ code: 'VALIDATION' });
  });

  it('times out when the pipeline never becomes ready', async () => {
    let t = 0;
    const { deps } = stubDeps({ status: async () => ({ pipeline_status: 'optimizing' }), now: () => (t += 20_000) });
    await expect(uploadMedia(file(1000), deps)).rejects.toMatchObject({ code: 'TIMEOUT' });
  });
});
