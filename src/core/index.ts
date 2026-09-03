// Core barrel. Types re-exported with `export type` (verbatimModuleSyntax).

// schema
export type {
  PlatformId,
  IsoUtc,
  IanaZone,
  Audience,
  VrPlatform,
  Photosensitivity,
  PerformerAlias,
  Performer,
  OrganizerRef,
  PosterRef,
  PosterFile,
  Visibility,
  Flags,
  Music,
  Links,
  Slot,
  EventCore,
} from './schema';

// errors
export type { BridgeErrorCode } from './errors';
export { BridgeError, isBridgeError } from './errors';

// time
export type { ZonedParts } from './time';
export {
  asIsoUtc,
  asIanaZone,
  isValidZone,
  zonedLocalToUtc,
  utcToZonedParts,
  toDatetimeLocal,
  addMinutes,
  diffMinutes,
} from './time';

// hash
export type { JsonValue } from './hash';
export { canonicalJson, sha256Hex, hashCanonical } from './hash';

// diff
export type { ChangedPath } from './diff';
export { diffEvents } from './diff';

// validate
export type { ValidationIssue } from './validate';
export { validateEvent, isValidEvent } from './validate';

// capabilities
export type { PlatformCapabilities, FlagKey, FlagSupport, LossEntry, LossReport } from './capabilities';
export { VRCPOP_CAPS, VRCTL_CAPS, RAVEPAGE_CAPS, CAPS, computeLoss } from './capabilities';

// planner
export type { StepKind, PlannedStep } from './planner';
export { ref, resolveRefs, renderPreview } from './planner';

// mapping: vrcpop
export type {
  VrcpopVocabItem,
  VrcpopBuildCtx,
  VrcpopPerformerPayload,
  VrcpopSetPayload,
  VrcpopEventPayload,
} from './mapping/to-vrcpop';
export { toVrcpopPayload } from './mapping/to-vrcpop';
export type {
  VrcpopDataEvent,
  VrcpopDataEventSet,
  VrcpopDataEventPerformer,
  VrcpopLineupBody,
  VrcpopLineupSet,
  VrcpopLineupPerformer,
} from './mapping/from-vrcpop';
export { fromVrcpop } from './mapping/from-vrcpop';

// mapping: vrctl
export type {
  VrctlOption,
  VrctlFlagKind,
  VrctlFlagCategory,
  VrctlSlotForm,
  VrctlDetailForm,
} from './mapping/vrctl-types';
export type { VrctlField, VrctlCreateCtx, VrctlDetailCtx } from './mapping/to-vrctl';
export { buildVrctlCreateFields, buildVrctlDetailFields } from './mapping/to-vrctl';
export type { VrctlParseCtx } from './mapping/from-vrctl';
export { fromVrctl } from './mapping/from-vrctl';

// mapping: ravepage
export type {
  RavepageBuildCtx,
  RavepagePerformerBuild,
  RavepageEventBuild,
} from './mapping/to-ravepage';
export { toRavepage } from './mapping/to-ravepage';
export { fromRavepage } from './mapping/from-ravepage';
