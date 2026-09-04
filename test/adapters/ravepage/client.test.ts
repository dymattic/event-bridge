import { beforeEach, describe, expect, it, vi } from 'vitest';

// client.ts -> token-store -> webext; mock it so happy-dom can load the module.
const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { configureClient, ensureConfigured, toBridgeError } from '../../../src/adapters/ravepage/client';
import { OpenAPI } from '../../../src/adapters/ravepage/api-client/core/OpenAPI';
import { ApiError } from '../../../src/adapters/ravepage/api-client/core/ApiError';
import { CancelError } from '../../../src/adapters/ravepage/api-client/core/CancelablePromise';
import { BridgeError } from '../../../src/core/errors';
import { RAVEPAGE_DEFAULT_INSTANCE } from '../../../src/runtime/settings';
import { createFake } from '../../runtime/fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('ensureConfigured', () => {
  it('sets OpenAPI.BASE from the default instance when storage is empty', async () => {
    configureClient('https://stale.example'); // prove it changes
    const base = await ensureConfigured();
    expect(base).toBe(RAVEPAGE_DEFAULT_INSTANCE.apiOrigin);
    expect(OpenAPI.BASE).toBe(RAVEPAGE_DEFAULT_INSTANCE.apiOrigin);
  });

  it('sets OpenAPI.BASE from a configured custom instance', async () => {
    h.ext = createFake({ storage: { settings: { ravepage: { appOrigin: 'https://app.custom.example', apiOrigin: 'https://api.custom.example' } } } }).ext;
    const base = await ensureConfigured();
    expect(base).toBe('https://api.custom.example');
    expect(OpenAPI.BASE).toBe('https://api.custom.example');
  });
});

function apiError(status: number, body: unknown): ApiError {
  return new ApiError(
    { method: 'GET', url: '/x' },
    { url: '/x', ok: false, status, statusText: 'x', body },
    'msg',
  );
}

describe('toBridgeError', () => {
  it('passes through an existing BridgeError', () => {
    const e = new BridgeError('NOT_LOGGED_IN', 'x');
    expect(toBridgeError(e)).toBe(e);
  });

  it('maps CancelError -> CANCELLED', () => {
    expect(toBridgeError(new CancelError('aborted')).code).toBe('CANCELLED');
  });

  it('401 -> NOT_LOGGED_IN and surfaces the API message', () => {
    const b = toBridgeError(apiError(401, { message: 'Could not validate credentials', details: { code: 'UNAUTHORIZED' } }));
    expect(b.code).toBe('NOT_LOGGED_IN');
    expect(b.message).toBe('Could not validate credentials');
  });

  it('403 -> NOT_AUTHORIZED', () => {
    expect(toBridgeError(apiError(403, {})).code).toBe('NOT_AUTHORIZED');
  });

  it('404 -> NOT_FOUND', () => {
    expect(toBridgeError(apiError(404, {})).code).toBe('NOT_FOUND');
  });

  it('409 / 422 / 400 -> VALIDATION with message + details', () => {
    expect(toBridgeError(apiError(409, {})).code).toBe('VALIDATION');
    expect(toBridgeError(apiError(400, {})).code).toBe('VALIDATION');
    const b = toBridgeError(apiError(422, { message: 'bad', details: { field: 'title' } }));
    expect(b.code).toBe('VALIDATION');
    expect(b.message).toBe('bad');
    expect(b.details).toEqual({ field: 'title' });
  });

  it('429 -> RATE_LIMITED', () => {
    expect(toBridgeError(apiError(429, {})).code).toBe('RATE_LIMITED');
  });

  it('5xx -> NETWORK', () => {
    expect(toBridgeError(apiError(500, {})).code).toBe('NETWORK');
    expect(toBridgeError(apiError(503, {})).code).toBe('NETWORK');
  });

  it('TypeError (fetch failure) -> NETWORK', () => {
    expect(toBridgeError(new TypeError('failed to fetch')).code).toBe('NETWORK');
  });

  it('unknown -> UNKNOWN', () => {
    expect(toBridgeError('weird').code).toBe('UNKNOWN');
  });
});
