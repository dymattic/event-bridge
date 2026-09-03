/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterGroupCreateIn } from '../models/FilterGroupCreateIn';
import type { FilterGroupEntityIn } from '../models/FilterGroupEntityIn';
import type { FilterGroupEntityOut } from '../models/FilterGroupEntityOut';
import type { FilterGroupFeedOut } from '../models/FilterGroupFeedOut';
import type { FilterGroupGrantIn } from '../models/FilterGroupGrantIn';
import type { FilterGroupGrantOut } from '../models/FilterGroupGrantOut';
import type { FilterGroupGrantUpdateIn } from '../models/FilterGroupGrantUpdateIn';
import type { FilterGroupOut } from '../models/FilterGroupOut';
import type { FilterGroupSubscriptionIn } from '../models/FilterGroupSubscriptionIn';
import type { FilterGroupSubscriptionOut } from '../models/FilterGroupSubscriptionOut';
import type { FilterGroupUpdateIn } from '../models/FilterGroupUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FilterGroupsService {
    /**
     * List filter groups visible to the caller
     * Authenticated. Returns groups the caller owns, plus
     * those shared directly via a user-grant, plus
     * visibility='public' groups.
     * @returns FilterGroupOut OK
     * @throws ApiError
     */
    public static listFilterGroups(): CancelablePromise<Array<FilterGroupOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/filter-groups',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a new filter group
     * Authenticated. Creates the parent row + optional inline
     * entities + grants + the owner's initial subscription
     * (notify_mode='off' by default). Visibility defaults to
     * 'private', algorithm to 'personalized'.
     * @returns FilterGroupOut Created
     * @throws ApiError
     */
    public static createFilterGroup({
        requestBody,
    }: {
        /**
         * Filter group payload
         */
        requestBody: FilterGroupCreateIn,
    }): CancelablePromise<FilterGroupOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/filter-groups',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a filter group
     * Owner-only. Child rows (entities + grants +
     * subscriptions) CASCADE at the database layer. 204 No
     * Content on success.
     * @returns void
     * @throws ApiError
     */
    public static deleteFilterGroup({
        filterGroupId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/filter-groups/{filter_group_id}',
            path: {
                'filter_group_id': filterGroupId,
            },
            errors: {
                400: `Invalid filter_group_id`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a filter group
     * Viewer+. Returns the parent row plus its entities,
     * grants, and the caller's own subscription (if any).
     * 404 when the row does not exist OR the caller has no
     * access to a private group (existence not leaked).
     * @returns FilterGroupOut OK
     * @throws ApiError
     */
    public static getFilterGroup({
        filterGroupId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
    }): CancelablePromise<FilterGroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/filter-groups/{filter_group_id}',
            path: {
                'filter_group_id': filterGroupId,
            },
            errors: {
                400: `Invalid filter_group_id`,
                401: `Authentication required`,
                403: `Access denied`,
                404: `Filter group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a filter group
     * Owner-only. Partial update - only fields present on
     * the wire are mutated.
     * @returns FilterGroupOut OK
     * @throws ApiError
     */
    public static updateFilterGroup({
        filterGroupId,
        requestBody,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Partial update payload
         */
        requestBody: FilterGroupUpdateIn,
    }): CancelablePromise<FilterGroupOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/filter-groups/{filter_group_id}',
            path: {
                'filter_group_id': filterGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add or upsert a linked entity
     * editor+. Upserts on (group, entity_type, entity_id) -
     * re-posting the same key updates weight + order_index
     * rather than creating a duplicate. py lines 318-354.
     * @returns FilterGroupEntityOut Created
     * @throws ApiError
     */
    public static addFilterGroupEntity({
        filterGroupId,
        requestBody,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Entity payload
         */
        requestBody: FilterGroupEntityIn,
    }): CancelablePromise<FilterGroupEntityOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/filter-groups/{filter_group_id}/entities',
            path: {
                'filter_group_id': filterGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a linked entity
     * editor+. 404 when the entity_row_id does not exist or
     * belongs to a different group (scope check). py lines 365-388.
     * @returns void
     * @throws ApiError
     */
    public static deleteFilterGroupEntity({
        filterGroupId,
        entityRowId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Entity row ID (UUID or fge_<uuid>)
         */
        entityRowId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/filter-groups/{filter_group_id}/entities/{entity_row_id}',
            path: {
                'filter_group_id': filterGroupId,
                'entity_row_id': entityRowId,
            },
            errors: {
                400: `Invalid ID`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group or linked entity not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Run the saved feed preset
     * Runs this filter group's algorithm against the discover
     * feed (trending / events / people / personalized) then
     * post-filters the result against the group's `filter_spec`
     * (exclude_entity_ids, include_only_linked, date_range).
     * Caller must have at least viewer access on the filter
     * group (404 for private filter groups the caller can't
     * see - existence is not leaked). The wire shape matches
     * the regular /discover* endpoints so frontends reuse the
     * same renderers.
     * @returns FilterGroupFeedOut OK
     * @throws ApiError
     */
    public static getFilterGroupFeed({
        filterGroupId,
        limit,
        cursor,
    }: {
        /**
         * Filter group UUID or flg_<uuid>
         */
        filterGroupId: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<FilterGroupFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/filter-groups/{filter_group_id}/feed',
            path: {
                'filter_group_id': filterGroupId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `Invalid filter_group_id or limit`,
                401: `Authentication required`,
                404: `Filter group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List share grants
     * Owner-only. Returns every share-grant row on the group. py lines 403-410.
     * @returns FilterGroupGrantOut OK
     * @throws ApiError
     */
    public static listFilterGroupGrants({
        filterGroupId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
    }): CancelablePromise<Array<FilterGroupGrantOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/filter-groups/{filter_group_id}/grants',
            path: {
                'filter_group_id': filterGroupId,
            },
            errors: {
                400: `Invalid filter_group_id`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a share grant
     * Owner-only. Upserts on (group, principal_type,
     * principal_id) - re-posting the same key overwrites
     * role + min_group_role.
     * py lines 421-464.
     * @returns FilterGroupGrantOut Created
     * @throws ApiError
     */
    public static createFilterGroupGrant({
        filterGroupId,
        requestBody,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Grant payload
         */
        requestBody: FilterGroupGrantIn,
    }): CancelablePromise<FilterGroupGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/filter-groups/{filter_group_id}/grants',
            path: {
                'filter_group_id': filterGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a share grant
     * Owner-only. 404 when the grant_id does not exist or
     * belongs to a different group. py lines 515-537.
     * @returns void
     * @throws ApiError
     */
    public static deleteFilterGroupGrant({
        filterGroupId,
        grantId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Grant ID (UUID or fgg_<uuid>)
         */
        grantId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/filter-groups/{filter_group_id}/grants/{grant_id}',
            path: {
                'filter_group_id': filterGroupId,
                'grant_id': grantId,
            },
            errors: {
                400: `Invalid ID`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group or grant not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a share grant
     * Owner-only. Partial patch - only fields present on the
     * wire are mutated. Explicit null on min_group_role clears
     * the column. py lines
     * 474-504.
     * @returns FilterGroupGrantOut OK
     * @throws ApiError
     */
    public static updateFilterGroupGrant({
        filterGroupId,
        grantId,
        requestBody,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Grant ID (UUID or fgg_<uuid>)
         */
        grantId: any,
        /**
         * Partial patch
         */
        requestBody: FilterGroupGrantUpdateIn,
    }): CancelablePromise<FilterGroupGrantOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/filter-groups/{filter_group_id}/grants/{grant_id}',
            path: {
                'filter_group_id': filterGroupId,
                'grant_id': grantId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Filter group or grant not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Drop the caller's subscription
     * Viewer+. Idempotent - 204 whether or not the caller had
     * a subscription row .
     * @returns void
     * @throws ApiError
     */
    public static deleteFilterGroupSubscription({
        filterGroupId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/filter-groups/{filter_group_id}/subscription',
            path: {
                'filter_group_id': filterGroupId,
            },
            errors: {
                400: `Invalid filter_group_id`,
                401: `Authentication required`,
                403: `Access denied`,
                404: `Filter group not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get the caller's subscription on this filter group
     * Viewer+. Returns the caller's own subscription row.
     * 404 when the filter group does not exist OR the caller
     * has no read access OR the caller has read access but no
     * subscription row yet .
     * @returns FilterGroupSubscriptionOut OK
     * @throws ApiError
     */
    public static getFilterGroupSubscription({
        filterGroupId,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
    }): CancelablePromise<FilterGroupSubscriptionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/filter-groups/{filter_group_id}/subscription',
            path: {
                'filter_group_id': filterGroupId,
            },
            errors: {
                400: `Invalid filter_group_id`,
                401: `Authentication required`,
                403: `Access denied`,
                404: `Filter group or subscription not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upsert the caller's notification subscription
     * Viewer+. Idempotent on (filter_group_id, caller). PUTting
     * twice updates the existing row instead of creating a
     * duplicate. Setting notify_mode='off' disables delivery
     * without removing the row, preserving the previous
     * schedule for a future toggle .
     * @returns FilterGroupSubscriptionOut OK
     * @throws ApiError
     */
    public static upsertFilterGroupSubscription({
        filterGroupId,
        requestBody,
    }: {
        /**
         * Filter group ID (UUID or flg_<uuid>)
         */
        filterGroupId: any,
        /**
         * Subscription payload
         */
        requestBody: FilterGroupSubscriptionIn,
    }): CancelablePromise<FilterGroupSubscriptionOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/filter-groups/{filter_group_id}/subscription',
            path: {
                'filter_group_id': filterGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Access denied`,
                404: `Filter group not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
}
