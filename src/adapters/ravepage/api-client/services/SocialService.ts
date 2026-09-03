/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnqueueResult } from '../models/EnqueueResult';
import type { followAllBody } from '../models/followAllBody';
import type { FollowAllResult } from '../models/FollowAllResult';
import type { FollowCapabilitiesResult } from '../models/FollowCapabilitiesResult';
import type { FollowJobStatusOut } from '../models/FollowJobStatusOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SocialService {
    /**
     * @deprecated
     * [Deprecated] Follow all linked accounts for a target group
     * Deprecated. Use POST /social/follow-all/group/{entity_id}.
     * Returns 410 Gone with a Location header pointing at the modern path.
     * @returns void
     * @throws ApiError
     */
    public static followAllGroupDeprecated({
        targetGroupId,
    }: {
        /**
         * Target group UUID
         */
        targetGroupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/follow-all/group/{target_group_id}',
            path: {
                'target_group_id': targetGroupId,
            },
            errors: {
                410: `Deprecated - use modern path`,
                422: `Invalid target_group_id`,
            },
        });
    }
    /**
     * Get follow-all job status
     * Returns the status of an async cross-platform follow job created via `POST /social/follow-all/{entity_type}/{entity_id}/async`.
     * @returns FollowJobStatusOut OK
     * @throws ApiError
     */
    public static getFollowAllJobStatus({
        jobId,
    }: {
        /**
         * Follow-job id (`sfj_<uuid>` or bare uuid)
         */
        jobId: any,
    }): CancelablePromise<FollowJobStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/follow-all/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                401: `Authentication required`,
                404: `Follow job not found (or caller is not owner/admin)`,
                422: `Invalid job id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * @deprecated
     * [Deprecated] Follow all linked accounts for a target user
     * Deprecated. Use POST /social/follow-all/user/{entity_id}.
     * Returns 410 Gone with a Location header pointing at the modern path.
     * @returns void
     * @throws ApiError
     */
    public static followAllUserDeprecated({
        targetUserId,
    }: {
        /**
         * Target user UUID
         */
        targetUserId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/follow-all/user/{target_user_id}',
            path: {
                'target_user_id': targetUserId,
            },
            errors: {
                410: `Deprecated - use modern path`,
                422: `Invalid target_user_id`,
            },
        });
    }
    /**
     * Follow all linked accounts for a target entity
     * Dispatches the follow on every (caller-link, server-
     * followable) provider. Note: provider HTTP is not yet
     * wired in the Go port - currently every result shows
     * success=false / error=not_executed_yet.
     * @returns FollowAllResult OK
     * @throws ApiError
     */
    public static followAll({
        entityType,
        entityId,
        requestBody,
    }: {
        /**
         * Target entity type (user|group)
         */
        entityType: any,
        /**
         * Target UUID
         */
        entityId: any,
        /**
         * Optional platforms filter
         */
        requestBody?: followAllBody,
    }): CancelablePromise<FollowAllResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/follow-all/{entity_type}/{entity_id}',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Self-follow rejected`,
                401: `Authentication required`,
                404: `Target not found`,
                422: `Invalid entity_type/entity_id`,
                502: `Upstream profiles worker unavailable`,
                503: `Cross-worker mesh disabled`,
            },
        });
    }
    /**
     * Queue a follow-all job
     * The worker consumer drains the queue and runs the
     * follow dispatch (provider HTTP - separate cycle).
     * @returns EnqueueResult OK
     * @throws ApiError
     */
    public static followAllAsync({
        entityType,
        entityId,
        requestBody,
    }: {
        /**
         * Target entity type (user|group)
         */
        entityType: any,
        /**
         * Target UUID
         */
        entityId: any,
        /**
         * Optional platforms filter
         */
        requestBody?: followAllBody,
    }): CancelablePromise<EnqueueResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/follow-all/{entity_type}/{entity_id}/async',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Self-follow rejected`,
                401: `Authentication required`,
                404: `Target not found`,
                422: `Invalid entity_type/entity_id`,
                502: `Upstream profiles worker unavailable`,
                503: `Cross-worker mesh or job-bus disabled`,
            },
        });
    }
    /**
     * Preview cross-platform follow capabilities
     * Returns the (eligible, unavailable, source-linked,
     * target-linked) platform breakdown for a caller→target
     * pair.
     * @returns FollowCapabilitiesResult OK
     * @throws ApiError
     */
    public static previewFollowAll({
        entityType,
        entityId,
        platforms,
    }: {
        /**
         * Target entity type (user|group)
         */
        entityType: any,
        /**
         * Target UUID (bare or prefixed usr_/grp_)
         */
        entityId: any,
        /**
         * Optional platform filter
         */
        platforms?: any,
    }): CancelablePromise<FollowCapabilitiesResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/follow-all/{entity_type}/{entity_id}/preview',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            query: {
                'platforms': platforms,
            },
            errors: {
                400: `Self-follow rejected`,
                401: `Authentication required`,
                404: `Target not found`,
                422: `Invalid entity_type/entity_id`,
                502: `Upstream profiles worker unavailable`,
                503: `Cross-worker mesh disabled`,
            },
        });
    }
}
