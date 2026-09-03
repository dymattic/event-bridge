// vrc.tl adapter barrel — PURE modules only (node/happy-dom importable). The
// webext-bound PlatformAdapter lives in ./platform and is imported directly by
// the registry/dev entry, never re-exported here (it would drag the chrome shim
// into unit tests).
export * from './ids';
export * from './parse';
export * from './forms';
export * from './routes';
export * from './planner';
export {
  listOwnClubs,
  listCategories,
  listOwnEvents,
  readEvent,
  readEventForm,
  loadVocabForm,
  resolvePerformer,
  type VrctlVocab,
} from './adapter';
