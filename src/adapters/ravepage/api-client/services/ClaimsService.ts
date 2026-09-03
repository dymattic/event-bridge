/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClaimEntityIn } from '../models/ClaimEntityIn';
import type { NameDisputeAdminUpdate } from '../models/NameDisputeAdminUpdate';
import type { NameDisputeCreate } from '../models/NameDisputeCreate';
import type { NameDisputeOut } from '../models/NameDisputeOut';
import type { UnregisteredEntityCreate } from '../models/UnregisteredEntityCreate';
import type { UnregisteredEntityOut } from '../models/UnregisteredEntityOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClaimsService {
    /**
     * Search unregistered entity stubs
     * Anonymous-accepting search across unclaimed entity
     * stubs (artist/venue/club/label) by name (partial),
     * type, or claim status.
     * @returns UnregisteredEntityOut OK
     * @throws ApiError
     */
    public static searchUnregisteredEntities({
        q,
        entityType,
        isClaimed,
        skip,
        limit,
    }: {
        /**
         * Name partial match (case-insensitive)
         */
        q?: any,
        /**
         * Filter: artist | venue | club | label
         */
        entityType?: any,
        /**
         * Filter by claim status
         */
        isClaimed?: any,
        /**
         * Skip rows (default 0)
         */
        skip?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<UnregisteredEntityOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/claims/entities',
            query: {
                'q': q,
                'entity_type': entityType,
                'is_claimed': isClaimed,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Create an unregistered entity stub manually
     * Auth-required create of an unregistered entity stub
     * (artist/venue/club/label). Dedupes on
     * (entity_type, name_normalized) → 409.
     * @returns UnregisteredEntityOut Created
     * @throws ApiError
     */
    public static createUnregisteredEntity({
        requestBody,
    }: {
        /**
         * Entity fields
         */
        requestBody: UnregisteredEntityCreate,
    }): CancelablePromise<UnregisteredEntityOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/claims/entities',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Auth missing or invalid`,
                409: `Entity already exists`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Claim an unregistered entity as a registered user
     * Auth-required claim of an unregistered entity stub.
     * Returns 404 on missing entity, 409 on already-claimed.
     * @returns UnregisteredEntityOut OK
     * @throws ApiError
     */
    public static claimEntity({
        entityId,
        requestBody,
    }: {
        /**
         * Entity ID (prefixed 'urg_<uuid>' or bare UUID)
         */
        entityId: any,
        /**
         * Optional payload (entity_id path-param wins)
         */
        requestBody?: ClaimEntityIn,
    }): CancelablePromise<UnregisteredEntityOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/claims/entities/{entity_id}/claim',
            path: {
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                404: `Entity not found`,
                409: `Entity already claimed`,
                422: `Malformed entity_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Claim an unregistered entity on behalf of a group
     * Auth-required claim on behalf of a group. Caller MUST
     * be admin/owner/manager of the group OR platform
     * admin. Returns 404 on missing entity, 409 on already-
     * claimed, 403 when caller is not group admin, 503 when
     * the groups membership-role contract is unreachable.
     * @returns UnregisteredEntityOut OK
     * @throws ApiError
     */
    public static claimEntityForGroup({
        groupId,
        entityId,
    }: {
        /**
         * Group ID (prefixed 'grp_<uuid>' or bare)
         */
        groupId: any,
        /**
         * Entity ID (prefixed 'urg_<uuid>' or bare)
         */
        entityId: any,
    }): CancelablePromise<UnregisteredEntityOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/claims/groups/{group_id}/entities/{entity_id}/claim',
            path: {
                'group_id': groupId,
                'entity_id': entityId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller not admin of group`,
                404: `Entity not found`,
                409: `Entity already claimed`,
                422: `Malformed group_id / entity_id`,
                500: `Internal error`,
                503: `Groups membership-role contract unavailable`,
            },
        });
    }
    /**
     * List all disputes (admin only)
     * Admin-only paginated list. Filterable by status and
     * email_verified. Non-admin callers receive 403.
     * @returns NameDisputeOut OK
     * @throws ApiError
     */
    public static listDisputes({
        status,
        emailVerified,
        skip,
        limit,
    }: {
        /**
         * Filter by status
         */
        status?: any,
        /**
         * Filter by email_verified
         */
        emailVerified?: any,
        /**
         * Skip (default 0)
         */
        skip?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<NameDisputeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/disputes',
            query: {
                'status': status,
                'email_verified': emailVerified,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Admin role required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * File a name dispute (anonymous-accepting)
     * Anonymous-accepting: anyone may file a dispute
     * against a registered username or group name.
     * Wire shape unchanged - the response carries the row
     * with verification_token set.
     * @returns NameDisputeOut Created
     * @throws ApiError
     */
    public static createDispute({
        requestBody,
    }: {
        /**
         * Dispute fields
         */
        requestBody: NameDisputeCreate,
    }): CancelablePromise<NameDisputeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/disputes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or missing target`,
                404: `Disputed user/group not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Verify a dispute claimant's email address
     * Anonymous-accepting verify via the token sent to
     * the claimant. Idempotent: an already-verified row
     * returns the same shape.
     * @returns NameDisputeOut OK
     * @throws ApiError
     */
    public static verifyDispute({
        token,
    }: {
        /**
         * Verification token (urlsafe-base64-32)
         */
        token: any,
    }): CancelablePromise<NameDisputeOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/disputes/verify/{token}',
            path: {
                'token': token,
            },
            errors: {
                404: `Invalid or expired verification token`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update dispute status / notes (admin only)
     * Admin-only PATCH-as-PUT. When status transitions to
     * resolved/dismissed, resolved_by + resolved_at are
     * stamped from the caller's claim.
     * @returns NameDisputeOut OK
     * @throws ApiError
     */
    public static updateDispute({
        disputeId,
        requestBody,
    }: {
        /**
         * Dispute ID (prefixed 'disp_<uuid>' or bare)
         */
        disputeId: any,
        /**
         * Patch fields
         */
        requestBody: NameDisputeAdminUpdate,
    }): CancelablePromise<NameDisputeOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/disputes/{dispute_id}',
            path: {
                'dispute_id': disputeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Auth missing or invalid`,
                403: `Admin role required`,
                404: `Dispute not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
}
