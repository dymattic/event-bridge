/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupTypesReplaceIn = {
    /**
     * TypeIDs is the full set of GroupType ids the group should
     * belong to (replace semantics). Required. Empty list is
     * valid and clears the group's types. Duplicates are
     * deduped server-side.
     */
    type_ids?: Array<number>;
};

