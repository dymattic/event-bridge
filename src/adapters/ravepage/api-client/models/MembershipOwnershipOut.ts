/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MembershipOwnershipOut = {
    /**
     * IsMember is true iff a `profile_users` row matches the
     * (profile_id, user_id) pair.
     *
     * Consumers MUST check this flag before deciding the authz
     * outcome. When false, fall through to the admin-override or
     * return 403 .
     */
    is_member?: boolean;
    /**
     * ProfileID echoes the request's path param so the caller can
     * correlate the response. Bare UUID string (no `prf_` prefix -
     * the contract is internal-mesh-only).
     */
    profile_id?: string;
    /**
     * UserID echoes the request's path param so the caller can
     * correlate the response.
     */
    user_id?: string;
};

