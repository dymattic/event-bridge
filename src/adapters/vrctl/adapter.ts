// vrc.tl own-surface reads + EventCore mapping. Pure: every function takes an
// injected `send` (the agent `http` op) so it is node/happy-dom importable and
// unit-tested with a fake transport. The webext-bound PlatformAdapter that the
// registry consumes lives in ./platform (imports the runtime agent).
import type { EventCore } from '../../core/schema';
import { fromVrctl } from '../../core/mapping/from-vrctl';
import type { VrctlDetailForm, VrctlFlagCategory, VrctlOption } from '../../core/mapping/vrctl-types';
import { BridgeError } from '../../core/errors';
import type { HttpSend } from './routes';
import { request } from './routes';
import {
  isSignInRedirect,
  parseChooseCategory,
  parseChooseOrganizer,
  parseDetailForm,
  parseGrid,
  parsePerformerSearch,
  type VrctlCategory,
  type VrctlGridRow,
  type VrctlOrganizer,
  type VrctlPerformer,
} from './parse';
import type { VrctlEventId, VrctlOrganizerId } from './ids';

function guard(res: { finalUrl: string; status: number; body?: string | null }): void {
  if (isSignInRedirect(res)) throw new BridgeError('NOT_LOGGED_IN', 'vrc.tl bounced to sign-in');
}

export interface VrctlVocab {
  organizerOptions: VrctlOption[];
  timezoneOptions: string[];
  howToJoinOptions: VrctlOption[];
  flagCategories: Record<string, VrctlFlagCategory>;
}

export async function listOwnClubs(send: HttpSend): Promise<VrctlOrganizer[]> {
  const res = await request(send, 'chooseOrganizer', {});
  guard(res);
  return parseChooseOrganizer(res.body ?? '');
}

export async function listCategories(send: HttpSend, organizerId: VrctlOrganizerId): Promise<VrctlCategory[]> {
  const res = await request(send, 'chooseCategory', { organizerId });
  guard(res);
  return parseChooseCategory(res.body ?? '');
}

export async function listOwnEvents(send: HttpSend): Promise<VrctlGridRow[]> {
  const res = await request(send, 'grid', {});
  guard(res);
  return parseGrid(res.body ?? '');
}

export async function readEventForm(send: HttpSend, eventId: VrctlEventId): Promise<VrctlDetailForm> {
  const res = await request(send, 'detail', { eventId });
  guard(res);
  if (!res.body) throw new BridgeError('NOT_FOUND', `no detail body for event ${eventId}`);
  return parseDetailForm(res.body);
}

export async function readEvent(send: HttpSend, eventId: VrctlEventId): Promise<{ form: VrctlDetailForm; core: EventCore }> {
  const form = await readEventForm(send, eventId);
  return { form, core: fromVrctl(form) };
}

export async function loadVocabForm(send: HttpSend, eventId: VrctlEventId): Promise<VrctlVocab> {
  const form = await readEventForm(send, eventId);
  return {
    organizerOptions: form.organizerOptions,
    timezoneOptions: form.timezoneOptions,
    howToJoinOptions: form.howToJoinOptions,
    flagCategories: form.flagCategories,
  };
}

export async function resolvePerformer(send: HttpSend, term: string): Promise<VrctlPerformer[]> {
  const res = await request(send, 'performerSearch', { term });
  guard(res);
  return parsePerformerSearch(res.body ?? '');
}
