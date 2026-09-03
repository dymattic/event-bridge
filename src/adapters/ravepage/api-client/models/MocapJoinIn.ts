/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MocapJoinIn = {
    /**
     * Label is a human-readable session label shown in the crew
     * panel (≤64 chars).
     */
    label?: string;
    /**
     * Role is the session role. `master` requires event-editor
     * standing (403 MASTER_REQUIRES_EDITOR otherwise).
     */
    role?: 'node' | 'master';
    /**
     * Tier is the informational rig tier (panel | camera | log).
     * Optional - defaults to the caller's roster tier.
     */
    tier?: 'panel' | 'camera' | 'log';
};

