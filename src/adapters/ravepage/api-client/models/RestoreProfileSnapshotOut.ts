/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestoreProfileSnapshotOut = {
    /**
     * EntityID is the bare UUID of the restored profile row.
     */
    entity_id?: string;
    /**
     * EntityType is always "profile" for this contract.
     */
    entity_type?: string;
    /**
     * Restored is true when the snapshot was applied successfully.
     */
    restored?: boolean;
};

