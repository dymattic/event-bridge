/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReleaseCreateIn } from '../models/ReleaseCreateIn';
import type { ReleaseLinkInstagramIn } from '../models/ReleaseLinkInstagramIn';
import type { ReleaseLinkSoundCloudIn } from '../models/ReleaseLinkSoundCloudIn';
import type { ReleaseLinkYouTubeIn } from '../models/ReleaseLinkYouTubeIn';
import type { ReleaseOut } from '../models/ReleaseOut';
import type { ReleaseUpdateIn } from '../models/ReleaseUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReleasesService {
    /**
     * List releases
     * Returns publicly-visible releases (public + unlisted) for anonymous callers. Authed callers also see logged_in releases plus any private release where the caller is in `release_users` or a member of a group attached via `release_groups`. Filter by `release_type`.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static listReleases({
        releaseType,
    }: {
        /**
         * Filter by release type (single, ep, album, dj_set, mix, ...)
         */
        releaseType?: any,
    }): CancelablePromise<Array<ReleaseOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/releases',
            query: {
                'release_type': releaseType,
            },
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a new release
     * Creates a new release owned by the authenticated user. Use `release_type` to categorise (single, ep, album, compilation, dj_set, mix, podcast, live_recording). DJ sets previously managed under /dj-sets should now be created here with `release_type: "dj_set"`. `visibility` defaults to `public` when omitted; pick `unlisted` / `logged_in` / `private` for narrower access.
     * @returns ReleaseOut Created
     * @throws ApiError
     */
    public static createRelease({
        requestBody,
    }: {
        /**
         * Release fields
         */
        requestBody: ReleaseCreateIn,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/releases',
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
     * List releases by owner (user or group)
     * Returns releases owned by a user or a group, scoped directly by UUID - no cross-worker identity hop, so anonymous callers can use it (unlike /releases/user/{username}, which requires the authed-only username resolver). Anonymous and non-member callers see public + unlisted releases only; the owner (or a group member, for group owners) or a platform admin sees everything the owner/group is attached to.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static listReleasesByOwner({
        ownerType,
        ownerId,
    }: {
        /**
         * Owner kind: user or group
         */
        ownerType: any,
        /**
         * Owner ID (UUID, usr_<uuid>/grp_<uuid> accepted)
         */
        ownerId: any,
    }): CancelablePromise<Array<ReleaseOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/releases/by-owner/{owner_type}/{owner_id}',
            path: {
                'owner_type': ownerType,
                'owner_id': ownerId,
            },
            errors: {
                422: `Invalid owner_type or owner_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link an Instagram post to a release
     * Idempotently attaches an Instagram post id to a release. Caller must be a release owner (or platform admin); BOLA-safe 404 otherwise.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static linkInstagramToRelease({
        requestBody,
    }: {
        /**
         * Link payload (release_id + instagram_post_id)
         */
        requestBody: ReleaseLinkInstagramIn,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/releases/link/instagram',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Release not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a SoundCloud track to a release
     * Attaches a SoundCloud track to a release via the cross-worker social-platforms entity-links contract. Caller must be a release owner (or platform admin); BOLA-safe 404 otherwise.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static linkSoundcloudToRelease({
        requestBody,
    }: {
        /**
         * Link payload (release_id required; provide soundcloud_track_id OR soundcloud_track_uuid)
         */
        requestBody: ReleaseLinkSoundCloudIn,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/releases/link/soundcloud',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Release or SoundCloud track not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a YouTube video to a release
     * Attaches a YouTube video to a release via the cross-worker social-platforms entity-links contract. Caller must be a release owner (or platform admin); BOLA-safe 404 otherwise.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static linkYoutubeToRelease({
        requestBody,
    }: {
        /**
         * Link payload (release_id required; provide youtube_video_id OR youtube_video_uuid)
         */
        requestBody: ReleaseLinkYouTubeIn,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/releases/link/youtube',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Release or YouTube video not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink an Instagram post from a release
     * Removes the release-instagram-link row. Caller must be a release owner (or platform admin); BOLA-safe 404 otherwise. Returns 404 when the link row was not present.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static unlinkInstagramFromRelease({
        releaseId,
        instagramPostId,
    }: {
        /**
         * Release ID (UUID or rel_<uuid>)
         */
        releaseId: any,
        /**
         * Instagram post ID (free-form string)
         */
        instagramPostId: any,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/releases/unlink/instagram/{release_id}/{instagram_post_id}',
            path: {
                'release_id': releaseId,
                'instagram_post_id': instagramPostId,
            },
            errors: {
                401: `Authentication required`,
                404: `Release or link not found`,
                422: `Invalid release_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a SoundCloud track from a release
     * Removes the release-SoundCloud-link row via the cross-worker social-platforms entity-links contract. Caller must be a release owner (or platform admin); BOLA-safe 404 otherwise.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static unlinkSoundcloudFromRelease({
        releaseId,
        soundcloudTrackId,
    }: {
        /**
         * Release ID (UUID or rel_<uuid>)
         */
        releaseId: any,
        /**
         * SoundCloud cache UUID
         */
        soundcloudTrackId: any,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/releases/unlink/soundcloud/{release_id}/{soundcloud_track_id}',
            path: {
                'release_id': releaseId,
                'soundcloud_track_id': soundcloudTrackId,
            },
            errors: {
                401: `Authentication required`,
                404: `Release or SoundCloud track not found / not linked`,
                422: `Invalid release_id/track UUID`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a YouTube video from a release
     * Removes the release-YouTube-link row via the cross-worker social-platforms entity-links contract. Caller must be a release owner (or platform admin); BOLA-safe 404 otherwise. The `youtube_video_id` segment accepts either a cache-row UUID OR a raw YouTube video ID (e.g. "0K1Vld4tKXc").
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static unlinkYoutubeFromRelease({
        releaseId,
        youtubeVideoId,
    }: {
        /**
         * Release ID (UUID or rel_<uuid>)
         */
        releaseId: any,
        /**
         * YouTube cache UUID OR raw YouTube video ID (e.g. 0K1Vld4tKXc)
         */
        youtubeVideoId: any,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/releases/unlink/youtube/{release_id}/{youtube_video_id}',
            path: {
                'release_id': releaseId,
                'youtube_video_id': youtubeVideoId,
            },
            errors: {
                401: `Authentication required`,
                404: `Release or YouTube video not found / not linked`,
                422: `Invalid release_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List releases by username
     * Returns the target user's public releases for anonymous callers, or all of the target's releases when the caller is the target user or a platform admin. Resolves the username via the identity cross-worker contract.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static getReleasesByUsername({
        username,
    }: {
        /**
         * Username of the target user
         */
        username: any,
    }): CancelablePromise<Array<ReleaseOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/releases/user/{username}',
            path: {
                'username': username,
            },
            errors: {
                404: `User not found`,
                422: `Invalid username`,
                500: `Internal error`,
                502: `Identity resolver unavailable`,
                503: `Identity resolver not configured`,
            },
        });
    }
    /**
     * Delete a release
     * Deletes a release by ID. Only the release owner (or a platform admin) may delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteRelease({
        releaseId,
    }: {
        /**
         * Release ID (UUID or rel_<uuid>)
         */
        releaseId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/releases/{release_id}',
            path: {
                'release_id': releaseId,
            },
            errors: {
                401: `Authentication required`,
                404: `Release not found`,
                422: `Invalid release_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a release by ID
     * Returns a release by ID. Visibility rules - public/unlisted: any caller; logged_in: any authed caller; private: owner (release_users), group-member (release_groups → group_memberships), or platform admin. Anonymous callers blocked by logged_in/private get 401; authed callers blocked by private get 403.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static getRelease({
        releaseId,
    }: {
        /**
         * Release ID (UUID or rel_<uuid>)
         */
        releaseId: any,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/releases/{release_id}',
            path: {
                'release_id': releaseId,
            },
            errors: {
                401: `Authentication required for private release`,
                403: `Forbidden`,
                404: `Release not found`,
                422: `Invalid release_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a release
     * Updates an existing release. Only the release owner (or a platform admin) may update. Supply `visibility` to change the release's read-audience policy (public, unlisted, logged_in, private); omit to leave it alone.
     * @returns ReleaseOut OK
     * @throws ApiError
     */
    public static updateRelease({
        releaseId,
        requestBody,
    }: {
        /**
         * Release ID (UUID or rel_<uuid>)
         */
        releaseId: any,
        /**
         * Fields to update
         */
        requestBody: ReleaseUpdateIn,
    }): CancelablePromise<ReleaseOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/releases/{release_id}',
            path: {
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Release not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
}
