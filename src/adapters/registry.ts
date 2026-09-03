// Adapter registry. All three platform adapters register here. The vrcpop/vrctl
// entries come from each platform's ./platform module (webext-bound), NOT the
// pure ./adapter/index barrels — importing this module pulls in the runtime.
import type { PlatformId } from '../core/schema';
import { BridgeError } from '../core/errors';
import type { PlatformAdapter } from './types';
import { ravepageAdapter } from './ravepage/adapter';
import { vrcpopAdapter } from './vrcpop/platform';
import { vrctlAdapter } from './vrctl/platform';

const ADAPTERS: Record<PlatformId, PlatformAdapter> = {
  ravepage: ravepageAdapter,
  vrcpop: vrcpopAdapter,
  vrctl: vrctlAdapter,
};

export const ADAPTER_IDS: readonly PlatformId[] = ['ravepage', 'vrcpop', 'vrctl'];

export function getAdapter(id: PlatformId): PlatformAdapter {
  const a = ADAPTERS[id];
  if (!a) throw new BridgeError('UNSUPPORTED', `no adapter registered for ${id}`);
  return a;
}

export function hasAdapter(id: PlatformId): boolean {
  return ADAPTERS[id] !== undefined;
}
