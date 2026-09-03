/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerAliasConflictOut } from '../models/PerformerAliasConflictOut';
import type { PerformerAliasConflictResolveIn } from '../models/PerformerAliasConflictResolveIn';
import type { PerformerAliasCreateIn } from '../models/PerformerAliasCreateIn';
import type { PerformerAliasOut } from '../models/PerformerAliasOut';
import type { PerformerAliasProposalResultOut } from '../models/PerformerAliasProposalResultOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PerformerAliasesService {
    /**
     * List the caller's open alias conflicts
     * Returns open `performer_alias_conflicts` rows where the caller manages either the proposing performer OR the conflicting performer. Used by the in-app conflict-resolution notification list.
     * @returns PerformerAliasConflictOut OK
     * @throws ApiError
     */
    public static listMyAliasConflicts(): CancelablePromise<Array<PerformerAliasConflictOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/alias-conflicts',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve an open alias conflict
     * Authenticated. Allowed terminal statuses: withdrawn /
     * approved_for_proposer / rejected / merged.
     * approved_for_proposer + merged are admin-only.
     * withdrawn requires the proposing side (or admin).
     * rejected requires the conflicting side (or admin).
     * @returns PerformerAliasConflictOut OK
     * @throws ApiError
     */
    public static resolvePerformerAliasConflict({
        conflictId,
        requestBody,
    }: {
        /**
         * Conflict UUID (bare or pac_<uuid>)
         */
        conflictId: any,
        /**
         * Conflict resolution payload
         */
        requestBody: PerformerAliasConflictResolveIn,
    }): CancelablePromise<PerformerAliasConflictOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/performer-alias-conflicts/{conflict_id}',
            path: {
                'conflict_id': conflictId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid resolution status OR already resolved`,
                401: `Authentication required`,
                403: `Authorization failed`,
                404: `Conflict not found`,
                422: `Invalid id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List a performer's aliases
     * Return every alias attached to performer_id, including historical names. Anonymous-public (no auth required). 404 when the parent performer row is absent.
     * @returns PerformerAliasOut OK
     * @throws ApiError
     */
    public static listPerformerAliases({
        performerId,
    }: {
        /**
         * Bare UUID or perf_<uuid>
         */
        performerId: any,
    }): CancelablePromise<Array<PerformerAliasOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/aliases',
            path: {
                'performer_id': performerId,
            },
            errors: {
                404: `Performer not found`,
                422: `Invalid performer_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Propose a new alias on a performer
     * Authenticated; manager-or-admin only. Returns either
     * the attached alias OR (on collision with another
     * user's claimed performer) a conflict row.
     * @returns PerformerAliasProposalResultOut OK
     * @throws ApiError
     */
    public static proposePerformerAlias({
        performerId,
        requestBody,
    }: {
        /**
         * Performer UUID
         */
        performerId: any,
        /**
         * Alias create payload
         */
        requestBody: PerformerAliasCreateIn,
    }): CancelablePromise<PerformerAliasProposalResultOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performers/{performer_id}/aliases',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Only the performer's manager (or an admin) can do that`,
                404: `Performer not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Promote an alias to be the performer's canonical name
     * Authenticated; manager-or-admin only. Row-swap: the
     * prior canonical name is parked as a (non-historical)
     * alias so historical references keep resolving.
     * @returns PerformerAliasOut OK
     * @throws ApiError
     */
    public static promotePerformerAlias({
        performerId,
        aliasId,
    }: {
        /**
         * Performer UUID
         */
        performerId: any,
        /**
         * Alias UUID (bare or pal_<uuid>)
         */
        aliasId: any,
    }): CancelablePromise<PerformerAliasOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performers/{performer_id}/aliases/{alias_id}/promote',
            path: {
                'performer_id': performerId,
                'alias_id': aliasId,
            },
            errors: {
                400: `Bad request (alias mismatch)`,
                401: `Authentication required`,
                403: `Only the performer's manager (or an admin) can do that`,
                404: `Performer or alias not found`,
                409: `Alias absorbed into canonical`,
                422: `Invalid id`,
                500: `Internal error`,
            },
        });
    }
}
