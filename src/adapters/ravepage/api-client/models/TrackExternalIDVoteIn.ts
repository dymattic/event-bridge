/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackExternalIDVoteIn = {
    /**
     * Value is the cast vote (+1 / 0 / -1). ValueSet records whether
     * the field was present in the wire JSON; absence triggers a 422
     * at the route layer ` makes the field required by emission of the
     * ellipsis, though `TrackExternalIdVoteRequest.value` uses
     * `Field(ge=-1, le=1, description=...)` without the ellipsis
     * which technically makes it required since no default is
     * declared.
     */
    value?: number;
    valueSet?: boolean;
};

