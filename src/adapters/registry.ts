// Adapter registry. rave.page is registered in P3; vrcpop/vrctl register in P4/P5.
import type { PlatformId } from '../core/schema';
import { BridgeError } from '../core/errors';
import type { PlatformAdapter } from './types';
import { ravepageAdapter } from './ravepage/adapter';

const ADAPTERS: Partial<Record<PlatformId, PlatformAdapter>> = {
  ravepage: ravepageAdapter,
};

export function registerAdapter(adapter: PlatformAdapter): void {
  ADAPTERS[adapter.id] = adapter;
}

export function getAdapter(id: PlatformId): PlatformAdapter {
  const a = ADAPTERS[id];
  if (!a) throw new BridgeError('UNSUPPORTED', `no adapter registered for ${id}`);
  return a;
}

export function hasAdapter(id: PlatformId): boolean {
  return ADAPTERS[id] !== undefined;
}
