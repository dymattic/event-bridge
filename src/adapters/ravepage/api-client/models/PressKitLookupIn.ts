/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PressKitLookupIn = {
    /**
     * ProfileIDs are the profile ids to resolve. Each entry accepts a
     * bare UUID or a `pro_<uuid>` prefixed form. An empty slice is
     * accepted and returns an empty items map. The handler 400s when the
     * slice length exceeds MaxPressKitLookupIDs.
     */
    profile_ids?: Array<string>;
};

