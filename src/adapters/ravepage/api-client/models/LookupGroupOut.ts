/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LookupGroupOut = {
    /**
     * Found - true when the group_id resolves to a row, false on
     * not-found. Callers map false→404. Distinct from a missing JSON
     * payload so callers can differentiate "didn't resolve" from
     * "upstream error" cleanly.
     */
    found?: boolean;
    /**
     * ID - the canonical group UUID (re-emitted so callers don't
     * have to round-trip their input). Empty string when Found=false.
     */
    id?: string;
    /**
     * Name - `groups.name`. Empty string when Found=false.
     */
    name?: string;
    /**
     * VRChatGroupID - `groups.vrchat_group_id`. Empty string when
     * the group has no VRChat link OR when Found=false. The events
     * group-link enrichment passes this verbatim to the FE.
     */
    vrchat_group_id?: string;
};

