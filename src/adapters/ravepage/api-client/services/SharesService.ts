/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SharedLibraryOut } from '../models/SharedLibraryOut';
import type { ShareGrantCreateIn } from '../models/ShareGrantCreateIn';
import type { ShareGrantListOut } from '../models/ShareGrantListOut';
import type { ShareGrantOut } from '../models/ShareGrantOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SharesService {
    /**
     * Read a library shared with the caller
     * Paged read-only view of `owner_id`'s library for callers holding an ACCEPTED whole-library grant (direct or via qualifying group membership). Full library projection - tags, cues and beatgrid included (they are the point of sharing; local file paths were never stored). No grant → BOLA-safe 404. Paginate with `limit` (1-200, default 50) and `offset`.
     * @returns SharedLibraryOut OK
     * @throws ApiError
     */
    public static readSharedLibrary({
        ownerId,
        limit,
        offset,
    }: {
        /**
         * Library owner user ID (usr_<uuid> or bare UUID)
         */
        ownerId: any,
        /**
         * Page size (1-200; default 50)
         */
        limit?: any,
        /**
         * Row offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<SharedLibraryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library/shared/{owner_id}',
            path: {
                'owner_id': ownerId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                404: `No accepted grant for this library`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List the caller's whole-library share grants
     * Every grant (pending + accepted) the caller has issued on their own library.
     * @returns ShareGrantListOut OK
     * @throws ApiError
     */
    public static listLibraryShares(): CancelablePromise<ShareGrantListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library/shares',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Share the caller's whole library (read-only)
     * Creates a PENDING viewer grant on the caller's ENTIRE library for a user or group principal (role is forced viewer - whole-library write sharing does not exist). `min_group_role` optionally gates group grants. Once accepted, the grantee reads via GET /library/shared/{owner_id}.
     * @returns ShareGrantOut Created
     * @throws ApiError
     */
    public static createLibraryShare({
        requestBody,
    }: {
        /**
         * Grant payload (role viewer or omitted)
         */
        requestBody: ShareGrantCreateIn,
    }): CancelablePromise<ShareGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/shares',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                409: `Grant already exists for this principal`,
                422: `Validation failed (editor role, bad principal)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke a whole-library share grant
     * Owner only. Foreign/unknown grant ids are a BOLA-safe 404.
     * @returns void
     * @throws ApiError
     */
    public static deleteLibraryShare({
        shareId,
    }: {
        /**
         * Share grant ID (shr_<uuid> or bare UUID)
         */
        shareId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/library/shares/{share_id}',
            path: {
                'share_id': shareId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not the owner)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List a playlist's share grants
     * Owner only - every grant (pending + accepted) on the playlist. Non-owners get a BOLA-safe 404.
     * @returns ShareGrantListOut OK
     * @throws ApiError
     */
    public static listPlaylistShares({
        playlistId,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
    }): CancelablePromise<ShareGrantListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/playlists/{playlist_id}/shares',
            path: {
                'playlist_id': playlistId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not the owner)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Share a playlist
     * Owner only. Creates a PENDING grant for a user or group principal with role viewer|editor (default viewer). `min_group_role` (owner|admin|manager|member) optionally gates group grants - only members holding that role or higher inherit; it is dropped for user principals. The grantee (or any qualifying group member) flips it active via POST /shares/{share_id}/accept. Duplicate (entity, principal) pairs are a 409.
     * @returns ShareGrantOut Created
     * @throws ApiError
     */
    public static createPlaylistShare({
        playlistId,
        requestBody,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
        /**
         * Grant payload
         */
        requestBody: ShareGrantCreateIn,
    }): CancelablePromise<ShareGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/{playlist_id}/shares',
            path: {
                'playlist_id': playlistId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                404: `Playlist not found (or not the owner)`,
                409: `Grant already exists for this principal`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke a playlist share grant
     * Owner only. Foreign/unknown grant ids (or grants on someone else's playlist) are a BOLA-safe 404.
     * @returns void
     * @throws ApiError
     */
    public static deletePlaylistShare({
        playlistId,
        shareId,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
        /**
         * Share grant ID (shr_<uuid> or bare UUID)
         */
        shareId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/playlists/{playlist_id}/shares/{share_id}',
            path: {
                'playlist_id': playlistId,
                'share_id': shareId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not the owner)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List share grants targeting the caller
     * Pending + accepted grants the caller can act on: grants naming them directly, plus group grants whose group the caller is a member of (meeting min_group_role - membership resolved via the groups worker, fail-closed). Use POST /shares/{share_id}/accept|decline to respond.
     * @returns ShareGrantListOut OK
     * @throws ApiError
     */
    public static listIncomingShares(): CancelablePromise<ShareGrantListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shares/incoming',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Accept a share grant
     * Flips a grant to ACCEPTED. Callable by the granted user, or - for group grants - any member of the granted group meeting min_group_role (membership resolved via the groups worker). Idempotent. Ineligible callers get a BOLA-safe 404.
     * @returns ShareGrantOut OK
     * @throws ApiError
     */
    public static acceptShare({
        shareId,
    }: {
        /**
         * Share grant ID (shr_<uuid> or bare UUID)
         */
        shareId: any,
    }): CancelablePromise<ShareGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shares/{share_id}/accept',
            path: {
                'share_id': shareId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not eligible)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Decline a share grant
     * DELETES the grant. Same eligibility as accept (granted user, or qualifying group member). Ineligible callers get a BOLA-safe 404.
     * @returns void
     * @throws ApiError
     */
    public static declineShare({
        shareId,
    }: {
        /**
         * Share grant ID (shr_<uuid> or bare UUID)
         */
        shareId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shares/{share_id}/decline',
            path: {
                'share_id': shareId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not eligible)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
}
