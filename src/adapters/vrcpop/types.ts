// vrcpop adapter local types + own-surface brands. Kept separate from the shared
// src/adapters/types.ts (PlatformAdapter, P3): these are vrcpop-internal.
//
// Own-agency safety: write/edit routes accept only ids minted from the user's own
// manage surfaces. OwnGroupRef comes from listOwnClubs (GET /dashboard), OwnEventRef
// from listOwnEvents / readEvent. A raw user-typed number/string can't be branded,
// so it is refused structurally (compile-time) AND at runtime (isOwn* guards).
import type { AgentOpFor, AgentOpName, AgentResultMap } from '../../shared/agent-protocol';
import type { VrcpopVocabItem } from '../../core/mapping/to-vrcpop';

// Minimal agent surface the adapter drives (structurally satisfied by the
// dashboard's AgentHandle). Adapters never import UI: this decouples them.
export interface VrcpopAgent {
  call<K extends AgentOpName>(op: AgentOpFor<K>, opts?: { timeoutMs?: number }): Promise<AgentResultMap[K]>;
  sendBlob(bytes: Uint8Array, mime: string, opts?: { timeoutMs?: number }): Promise<{ blobId: string; sha256?: string }>;
}

// ---- own-surface brands ----

export interface OwnGroupRef {
  readonly __ownGroup: true;
  readonly id: string; // grp_<uuid>
  readonly name: string;
}

export interface OwnEventRef {
  readonly __ownEvent: true;
  readonly id: number;
}

export function ownGroupRef(id: string, name: string): OwnGroupRef {
  return { __ownGroup: true, id, name };
}

export function ownEventRef(id: number): OwnEventRef {
  return { __ownEvent: true, id };
}

export function isOwnGroupRef(v: unknown): v is OwnGroupRef {
  return typeof v === 'object' && v !== null && (v as OwnGroupRef).__ownGroup === true && typeof (v as OwnGroupRef).id === 'string';
}

export function isOwnEventRef(v: unknown): v is OwnEventRef {
  return typeof v === 'object' && v !== null && (v as OwnEventRef).__ownEvent === true && typeof (v as OwnEventRef).id === 'number';
}

// ---- parsed reads ----

export interface VrcpopClub {
  groupId: string;
  name: string;
  ref: OwnGroupRef;
}

export type VrcpopEventStatus = 'upcoming' | 'draft' | 'past';

export interface VrcpopEventRef {
  id: number;
  title: string;
  date: string; // human label as rendered on the card
  status: VrcpopEventStatus;
  ref: OwnEventRef;
}

export interface VrcpopVocab {
  genres: VrcpopVocabItem[];
  energies: VrcpopVocabItem[];
}

// Performer autocomplete hit (action=search-all; search returns 400 "Unknown action").
export interface PerformerHit {
  name: string;
  profileId: number | null;
  source: 'profile' | 'historical';
}
