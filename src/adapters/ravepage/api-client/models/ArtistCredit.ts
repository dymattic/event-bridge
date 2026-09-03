/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtistCredit = {
    /**
     * CreditedName is the credit text as captured (always present for a
     * credited row; may differ from the linked performer's display name).
     */
    credited_name?: string;
    /**
     * PerformerID is the linked performer (`perf_<uuid>`), null for a
     * credit-only row.
     */
    performer_id?: string;
    /**
     * PerformerName is the linked performer's display name, null when
     * unlinked or the name lookup was unavailable.
     */
    performer_name?: string;
};

