import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { dismissSuggestion, listDismissed } from '../../src/runtime/dismissals';
import { createFake } from './fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('dismissals store', () => {
  it('persists a dismissed suggestion key and is idempotent', async () => {
    await dismissSuggestion('vrcpop:100001|vrctl:100002');
    await dismissSuggestion('vrcpop:100001|vrctl:100002');
    expect(await listDismissed()).toEqual(['vrcpop:100001|vrctl:100002']);
  });

  it('accumulates distinct keys', async () => {
    await dismissSuggestion('a');
    await dismissSuggestion('b');
    expect((await listDismissed()).sort()).toEqual(['a', 'b']);
  });
});
