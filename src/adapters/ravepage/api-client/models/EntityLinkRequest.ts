/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkEntityType } from './LinkEntityType';
import type { LinkOp } from './LinkOp';
import type { LinkProvider } from './LinkProvider';
export type EntityLinkRequest = {
    /**
     * EntityID - bare-UUID string of the release_id or tracklist_id.
     * Tracks resolves the typed prefix (`rel_...`) BEFORE calling the
     * contract; the contract receives the bare UUID.
     */
    entity_id?: string;
    /**
     * EntityType - "release". Identifies the local-owner-side table.
     * "tracklist" was retired by U1c.
     */
    entity_type?: LinkEntityType;
    /**
     * Op - "link" or "unlink".
     */
    op?: LinkOp;
    /**
     * PlatformID - raw provider ID string (e.g. YouTube "0K1Vld4tKXc"
     * or SoundCloud numeric "123456789"). Mutually exclusive with
     * PlatformUUID - exactly one MUST be set.
     */
    platform_id?: string;
    /**
     * PlatformUUID - cache-row UUID. Mutually exclusive with PlatformID.
     */
    platform_uuid?: string;
    /**
     * Provider - "youtube" or "soundcloud".
     */
    provider?: LinkProvider;
};

