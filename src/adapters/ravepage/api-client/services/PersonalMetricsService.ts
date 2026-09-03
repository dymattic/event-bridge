/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricAggregateOut } from '../models/PersonalMetricAggregateOut';
import type { PersonalMetricBlockIn } from '../models/PersonalMetricBlockIn';
import type { PersonalMetricBlockListOut } from '../models/PersonalMetricBlockListOut';
import type { PersonalMetricIngestIn } from '../models/PersonalMetricIngestIn';
import type { PersonalMetricIngestOut } from '../models/PersonalMetricIngestOut';
import type { PersonalMetricSummaryIn } from '../models/PersonalMetricSummaryIn';
import type { PersonalMetricSummaryOut } from '../models/PersonalMetricSummaryOut';
import type { PersonalMetricUserStatsOut } from '../models/PersonalMetricUserStatsOut';
import type { PersonalMetricVisibilityIn } from '../models/PersonalMetricVisibilityIn';
import type { PersonalMetricVisibilityOut } from '../models/PersonalMetricVisibilityOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonalMetricsService {
    /**
     * List blocked viewers
     * Returns the blocklist for you, or for a group you
     * administer when `owner_kind=group` and `owner_id` name
     * one. A blocked viewer sees exactly what a stranger
     * sees, so blocking is never visible to them.
     * @returns PersonalMetricBlockListOut OK
     * @throws ApiError
     */
    public static listPersonalMetricsBlocks({
        ownerKind,
        ownerId,
    }: {
        /**
         * user (default) or group
         */
        ownerKind?: any,
        /**
         * Group id when owner_kind=group
         */
        ownerId?: any,
    }): CancelablePromise<PersonalMetricBlockListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personal-metrics/blocks',
            query: {
                'owner_kind': ownerKind,
                'owner_id': ownerId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Not an administrator of that group`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Block a viewer from your stats
     * Blocks one user from seeing your stats, overriding the
     * per-stat audience. Enforced server-side on every read.
     * The blocked viewer's responses are identical to those
     * of someone you simply never shared with, so blocking
     * does not tell them they were blocked. Idempotent.
     * @returns void
     * @throws ApiError
     */
    public static addPersonalMetricsBlock({
        requestBody,
    }: {
        /**
         * Block to add
         */
        requestBody: PersonalMetricBlockIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/personal-metrics/blocks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Auth missing or invalid`,
                403: `Not an administrator of that group`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unblock a viewer
     * Lifts a block added with POST /personal-metrics/blocks.
     * Returns 204 whether or not a block was present, so the
     * endpoint cannot be used to probe the blocklist.
     * @returns void
     * @throws ApiError
     */
    public static removePersonalMetricsBlock({
        blockedUserId,
        ownerKind,
        ownerId,
    }: {
        /**
         * User to unblock (prefixed or bare UUID)
         */
        blockedUserId: any,
        /**
         * user (default) or group
         */
        ownerKind?: any,
        /**
         * Group id when owner_kind=group
         */
        ownerId?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/personal-metrics/blocks/{blocked_user_id}',
            path: {
                'blocked_user_id': blockedUserId,
            },
            query: {
                'owner_kind': ownerKind,
                'owner_id': ownerId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Not an administrator of that group`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Aggregate audience for an entity
     * How many people recorded this entity, and how many
     * times in total. `people` counts distinct subjects and
     * users, so extra devices and repeat plays cannot
     * inflate it.
     * Counts below `k_threshold` are returned as null rather
     * than rounded - a count of one is a disclosure, not a
     * metric. An entity with no rows returns null too, so a
     * null says nothing about which side of zero the real
     * number is on.
     * @returns PersonalMetricAggregateOut OK
     * @throws ApiError
     */
    public static getPersonalMetricsAggregate({
        entityType,
        entityId,
    }: {
        /**
         * Entity kind
         */
        entityType: any,
        /**
         * Canonical entity id (prefixed or bare UUID)
         */
        entityId: any,
    }): CancelablePromise<PersonalMetricAggregateOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personal-metrics/entities/{entity_type}/{entity_id}/aggregate',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Read your own stats
     * Returns the caller's own behaviour rows per stat.
     * This is a POST, not a GET, because it carries
     * `subject_id` and that value must never appear in a URL
     * - request paths are written to the access log.
     * Stats set to `private` are read from the subject-keyed
     * store and require `subject_id`; every other stat is
     * read from the user-keyed store. Each entry reports
     * which of the two it came from in `storage`.
     * @returns PersonalMetricSummaryOut OK
     * @throws ApiError
     */
    public static getOwnPersonalMetrics({
        requestBody,
    }: {
        /**
         * Read options
         */
        requestBody: PersonalMetricSummaryIn,
    }): CancelablePromise<PersonalMetricSummaryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/personal-metrics/me/summary',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Auth missing or invalid`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Record behaviour occurrences
     * Records a batch of listens / attendances / visits.
     * Presence of `subject_id` selects the PRIVATE storage
     * path: rows are keyed by that opaque subject and no
     * user_id is written anywhere. Omit it to record under
     * the authenticated user, which is what stats whose
     * audience is not `private` use.
     * Each occurrence carries a client-generated
     * `occurrence_id`; repeats inside the retention window
     * are dropped, so retries and two devices flushing the
     * same offline queue cannot inflate a counter. Reuse the
     * same id when retrying.
     * `entity_id` is resolved to the CANONICAL entity before
     * any row is written. Send `entity_source=library` with
     * a user_library_tracks id to have the server resolve it;
     * an unresolvable row is rejected rather than counted
     * under a provider-local id.
     * Read stats back with POST /personal-metrics/me/summary
     * and change what is shared with PUT /personal-metrics/visibility.
     * @returns PersonalMetricIngestOut Accepted
     * @throws ApiError
     */
    public static recordPersonalMetricOccurrences({
        requestBody,
    }: {
        /**
         * Occurrence batch
         */
        requestBody: PersonalMetricIngestIn,
    }): CancelablePromise<PersonalMetricIngestOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/personal-metrics/occurrences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Auth missing or invalid`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Read another user's shared stats
     * Returns only the stats that user shares with you.
     * The response is IDENTICAL when they never shared a
     * stat, when they set it to private, and when they
     * blocked you: `stats` is empty in all three cases and
     * the status code is always 200. That is deliberate - if
     * a blocked viewer got a different answer, absence would
     * tell them they were blocked.
     * `mutuals` means people you follow who follow you back.
     * It is NOT your accepted friends: mutual follow is the
     * precondition for sending a friend request, and a
     * friendship survives a later unfollow, so the two sets
     * overlap without one containing the other over time.
     * @returns PersonalMetricUserStatsOut OK
     * @throws ApiError
     */
    public static getUserPersonalMetrics({
        userId,
        limit,
    }: {
        /**
         * User (prefixed or bare UUID)
         */
        userId: any,
        /**
         * Items per stat (1..200, default 20)
         */
        limit?: any,
    }): CancelablePromise<PersonalMetricUserStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personal-metrics/users/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Read per-stat visibility
     * Returns every stat with the audience currently in
     * force. A stat that was never configured reads as
     * `private` - nothing is shared by default.
     * Change these with PUT /personal-metrics/visibility.
     * @returns PersonalMetricVisibilityOut OK
     * @throws ApiError
     */
    public static getPersonalMetricsVisibility(): CancelablePromise<PersonalMetricVisibilityOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personal-metrics/visibility',
            errors: {
                401: `Auth missing or invalid`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Change per-stat visibility
     * Sets the audience for one or more stats. `private`
     * stores rows under an opaque subject with no user_id
     * anywhere; every other audience stores them under your
     * user_id, because sharing means the link is disclosed.
     * A change that crosses that boundary therefore MOVES
     * the stored rows and needs `subject_id` - only the
     * client can compute it. The setting and the move commit
     * in one transaction, so a failure leaves both unchanged
     * and the setting can never claim `private` while a
     * user-keyed copy survives.
     * Going private stops future sharing; it does not
     * retract what was already shared.
     * @returns PersonalMetricVisibilityOut OK
     * @throws ApiError
     */
    public static setPersonalMetricsVisibility({
        requestBody,
    }: {
        /**
         * Audience changes
         */
        requestBody: PersonalMetricVisibilityIn,
    }): CancelablePromise<PersonalMetricVisibilityOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/personal-metrics/visibility',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Auth missing or invalid`,
                422: `Validation failed, or subject_id missing for a change that re-keys data`,
                500: `Internal error`,
            },
        });
    }
}
