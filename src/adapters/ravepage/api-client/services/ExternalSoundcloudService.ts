/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OperationResultOut } from '../models/OperationResultOut';
import type { SoundCloudActivitiesOut } from '../models/SoundCloudActivitiesOut';
import type { SoundCloudArtistPlaylistsOut } from '../models/SoundCloudArtistPlaylistsOut';
import type { SoundCloudArtistProfileOut } from '../models/SoundCloudArtistProfileOut';
import type { SoundCloudArtistTracksOut } from '../models/SoundCloudArtistTracksOut';
import type { SoundCloudCommentItemOut } from '../models/SoundCloudCommentItemOut';
import type { SoundCloudCommentsOut } from '../models/SoundCloudCommentsOut';
import type { SoundCloudCommentWriteIn } from '../models/SoundCloudCommentWriteIn';
import type { SoundCloudFollowersOut } from '../models/SoundCloudFollowersOut';
import type { SoundCloudFollowingsOut } from '../models/SoundCloudFollowingsOut';
import type { SoundCloudPlaylistsOut } from '../models/SoundCloudPlaylistsOut';
import type { SoundCloudRefreshOut } from '../models/SoundCloudRefreshOut';
import type { SoundCloudStreamOut } from '../models/SoundCloudStreamOut';
import type { SoundCloudTrackCacheOut } from '../models/SoundCloudTrackCacheOut';
import type { SoundCloudTrackOut } from '../models/SoundCloudTrackOut';
import type { SoundCloudTracksOut } from '../models/SoundCloudTracksOut';
import type { SoundCloudTrackUpdateIn } from '../models/SoundCloudTrackUpdateIn';
import type { SoundCloudUserProfileOut } from '../models/SoundCloudUserProfileOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExternalSoundcloudService {
    /**
     * Cached public SoundCloud artist profile
     * Resolves identifier as a numeric SoundCloud id OR a permalink (case-insensitive) and returns the cached public profile. Backs unclaimed-performer presence pages. Anonymous; pure DB cache read.
     * @returns SoundCloudArtistProfileOut OK
     * @throws ApiError
     */
    public static getSoundCloudArtist({
        identifier,
    }: {
        /**
         * SoundCloud numeric user id OR permalink
         */
        identifier: any,
    }): CancelablePromise<SoundCloudArtistProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/artists/{identifier}',
            path: {
                'identifier': identifier,
            },
            errors: {
                404: `Artist not in cache`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * Cached public playlists of a SoundCloud artist
     * Pages the artist's cached playlists, newest first. Anonymous; pure DB cache read.
     * @returns SoundCloudArtistPlaylistsOut OK
     * @throws ApiError
     */
    public static listSoundCloudArtistPlaylists({
        identifier,
        limit,
        offset,
    }: {
        /**
         * SoundCloud numeric user id OR permalink
         */
        identifier: any,
        /**
         * Page size (1..100, default 20)
         */
        limit?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<SoundCloudArtistPlaylistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/artists/{identifier}/playlists',
            path: {
                'identifier': identifier,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Invalid limit / offset`,
                404: `Artist not in cache`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * Cached public uploads of a SoundCloud artist
     * Pages the artist's own cached uploads, newest first. kind filters on the shared/setmix catalog_class verdict (sets = set_mix; tracks = everything else incl. unclassified). access='blocked' rows are excluded. Anonymous; pure DB cache read.
     * @returns SoundCloudArtistTracksOut OK
     * @throws ApiError
     */
    public static listSoundCloudArtistTracks({
        identifier,
        kind,
        limit,
        offset,
    }: {
        /**
         * SoundCloud numeric user id OR permalink
         */
        identifier: any,
        /**
         * Filter
         */
        kind?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<SoundCloudArtistTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/artists/{identifier}/tracks',
            path: {
                'identifier': identifier,
            },
            query: {
                'kind': kind,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Invalid kind / limit / offset`,
                404: `Artist not in cache`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * Cached SoundCloud image by raw sndcdn URL
     * URL-keyed passthrough for surfaces that hold a RAW sndcdn image URL with NO SoundCloud numeric id (landing trending, discover/feed cards). Validates host is *.sndcdn.com (https only) - 400 and NO fetch otherwise (SSRF guard). Applies the same size-variant suffix swap as the id-keyed endpoints, proxies + caches the bytes. Strong ETag + If-None-Match 304 + public max-age=86400. Anonymous.
     * @returns string Image bytes (jpeg/png/webp/gif)
     * @throws ApiError
     */
    public static getSoundCloudImageByUrl({
        url,
        size,
    }: {
        /**
         * URL-encoded sndcdn image URL (https, *.sndcdn.com)
         */
        url: any,
        /**
         * CDN size variant
         */
        size?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/image',
            query: {
                'url': url,
                'size': size,
            },
            errors: {
                400: `Missing/invalid url, non-sndcdn host, or invalid size`,
                404: `Upstream gone / not an image`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * List the authenticated user's SoundCloud activities
     * Returns the user's activity feed via SoundCloud `/me/activities` with cursor pagination through `next_href`.
     * @returns SoundCloudActivitiesOut OK
     * @throws ApiError
     */
    public static getSoundCloudActivities({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudActivitiesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/activities',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's own SoundCloud activities
     * Returns the user's own recent activities via SoundCloud `/me/activities/all/own`.
     * @returns SoundCloudActivitiesOut OK
     * @throws ApiError
     */
    public static getSoundCloudOwnActivities({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudActivitiesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/activities/own',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's SoundCloud track activities
     * Returns the user's track-related activity feed via SoundCloud `/me/activities/tracks`.
     * @returns SoundCloudActivitiesOut OK
     * @throws ApiError
     */
    public static getSoundCloudActivityTracks({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudActivitiesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/activities/tracks',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's SoundCloud followers
     * Returns the user's followers via SoundCloud `/me/followers`.
     * @returns SoundCloudFollowersOut OK
     * @throws ApiError
     */
    public static getSoundCloudFollowers({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudFollowersOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/followers',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Get one specific SoundCloud follower
     * Returns the SoundCloud profile for a specific follower if and only if that user follows the authenticated caller. 404 when not following (BOLA-safe).
     * @returns SoundCloudUserProfileOut OK
     * @throws ApiError
     */
    public static getSoundCloudFollower({
        followerId,
    }: {
        /**
         * SoundCloud follower user id
         */
        followerId: any,
    }): CancelablePromise<SoundCloudUserProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/followers/{follower_id}',
            path: {
                'follower_id': followerId,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                404: `Follower not found`,
                422: `Invalid follower_id`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's SoundCloud followings
     * Returns the users followed by the authenticated caller via SoundCloud `/me/followings`.
     * @returns SoundCloudFollowingsOut OK
     * @throws ApiError
     */
    public static getSoundCloudFollowings({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudFollowingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/followings',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List tracks from users the authenticated caller follows
     * Returns recent tracks from followed users via SoundCloud `/me/followings/tracks`.
     * @returns SoundCloudTracksOut OK
     * @throws ApiError
     */
    public static getSoundCloudFollowingsTracks({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/followings/tracks',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Unfollow a SoundCloud user
     * Unfollows a SoundCloud user on behalf of the authenticated caller.
     * @returns OperationResultOut OK
     * @throws ApiError
     */
    public static unfollowSoundCloudUser({
        userId,
    }: {
        /**
         * SoundCloud user id
         */
        userId: any,
    }): CancelablePromise<OperationResultOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/external/soundcloud/me/followings/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                404: `User not found or not being followed`,
                422: `Invalid user_id`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Get one specific SoundCloud followed user
     * Returns the SoundCloud profile for a specific user if and only if the authenticated caller follows them. 404 when not following (BOLA-safe).
     * @returns SoundCloudUserProfileOut OK
     * @throws ApiError
     */
    public static getSoundCloudFollowing({
        userId,
    }: {
        /**
         * SoundCloud user id
         */
        userId: any,
    }): CancelablePromise<SoundCloudUserProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/followings/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                404: `Followed user not found`,
                422: `Invalid user_id`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Follow a SoundCloud user
     * Follows a SoundCloud user on behalf of the authenticated caller. Returns the followed user's profile.
     * @returns SoundCloudUserProfileOut OK
     * @throws ApiError
     */
    public static followSoundCloudUser({
        userId,
    }: {
        /**
         * SoundCloud user id
         */
        userId: any,
    }): CancelablePromise<SoundCloudUserProfileOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/external/soundcloud/me/followings/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                404: `User not found`,
                422: `Invalid user_id`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's liked SoundCloud playlists
     * Returns liked playlists via SoundCloud `/me/likes/playlists`.
     * @returns SoundCloudPlaylistsOut OK
     * @throws ApiError
     */
    public static getSoundCloudLikedPlaylists({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudPlaylistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/likes/playlists',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's liked SoundCloud tracks
     * Returns liked tracks via SoundCloud `/me/likes/tracks`.
     * @returns SoundCloudTracksOut OK
     * @throws ApiError
     */
    public static getSoundCloudLikedTracks({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/likes/tracks',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's SoundCloud playlists
     * Returns the user's playlists via SoundCloud `/me/playlists`.
     * @returns SoundCloudPlaylistsOut OK
     * @throws ApiError
     */
    public static getSoundCloudMyPlaylists({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..100, default 10)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudPlaylistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/playlists',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Refresh the SoundCloud tracks cache for the authenticated user
     * Probes the user's SoundCloud OAuth link and returns a success envelope.
     * @returns SoundCloudRefreshOut OK
     * @throws ApiError
     */
    public static refreshSoundCloudCache(): CancelablePromise<SoundCloudRefreshOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/external/soundcloud/me/refresh',
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List the authenticated user's SoundCloud tracks
     * Returns the user's own tracks via SoundCloud `/me/tracks` with cursor-based pagination through `next_href`.
     * @returns SoundCloudTracksOut OK
     * @throws ApiError
     */
    public static getSoundCloudMyTracks({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..200, default 20)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/me/tracks',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid query`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * List featured SoundCloud playlists
     * Returns SoundCloud's featured public playlists via anonymous client_id auth.
     * @returns SoundCloudPlaylistsOut OK
     * @throws ApiError
     */
    public static getSoundCloudPlaylists({
        limit,
        nextHref,
    }: {
        /**
         * Page size (1..100, default 10)
         */
        limit?: any,
        /**
         * Absolute SoundCloud next_href cursor from a previous response
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudPlaylistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/playlists',
            query: {
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                400: `Invalid query`,
                401: `Authentication required`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
                503: `SoundCloud client_id not configured`,
            },
        });
    }
    /**
     * Cached SoundCloud playlist artwork image
     * Serves the artwork bytes for a cached SoundCloud playlist, proxied + cached server-side. Strong ETag + If-None-Match 304 + public max-age=86400. Anonymous.
     * @returns string Image bytes (jpeg/png/webp/gif)
     * @throws ApiError
     */
    public static getSoundCloudPlaylistArtwork({
        soundcloudId,
        size,
    }: {
        /**
         * SoundCloud numeric playlist id
         */
        soundcloudId: any,
        /**
         * CDN size variant
         */
        size?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/playlists/{soundcloud_id}/artwork',
            path: {
                'soundcloud_id': soundcloudId,
            },
            query: {
                'size': size,
            },
            errors: {
                400: `Invalid id or size`,
                404: `No cached playlist / no artwork / upstream gone`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * Get the authenticated user's SoundCloud profile
     * Returns the SoundCloud profile for the authenticated caller. When the caller has no linked SoundCloud account, falls back to SoundCloud's anonymous `/users/featured` endpoint .
     * @returns SoundCloudUserProfileOut OK
     * @throws ApiError
     */
    public static getSoundCloudProfile(): CancelablePromise<SoundCloudUserProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/profile',
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
                503: `SoundCloud client_id not configured`,
            },
        });
    }
    /**
     * Search cached SoundCloud tracks
     * Searches the local SoundCloud track cache by title, genre, or tag (ILIKE). Never calls SoundCloud live. Anonymous-public per
     * @returns SoundCloudTracksOut OK
     * @throws ApiError
     */
    public static searchSoundCloudTracks({
        query,
        limit,
        offset,
    }: {
        /**
         * Search query (matched against title / genre / tag_list)
         */
        query: any,
        /**
         * Page size (1..200, default 10)
         */
        limit?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<SoundCloudTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/search',
            query: {
                'query': query,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Invalid query / limit / offset`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * List cached SoundCloud tracks (by username or trending)
     * When `username` is provided, returns the cached tracks OWNED by that SoundCloud account - resolved first as a SoundCloud handle/permalink/numeric id, then (fallback) as a Rave.Page username via its linked SoundCloud account. Tracks are scoped to the actual owner (reposts are linked to their original uploader at cache-write time), so a performer's own uploads are returned without the global-trending misattribution. When `username` is omitted, returns the newest N cached tracks (trending).
     * @returns SoundCloudTracksOut OK
     * @throws ApiError
     */
    public static getSoundCloudTracks({
        username,
        limit,
        nextHref,
    }: {
        /**
         * SoundCloud handle / permalink / profile URL / numeric id, OR a Rave.Page username (resolved via the linked SoundCloud account)
         */
        username?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * (Ignored - cached list has no cursor)
         */
        nextHref?: any,
    }): CancelablePromise<SoundCloudTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/tracks',
            query: {
                'username': username,
                'limit': limit,
                'next_href': nextHref,
            },
            errors: {
                401: `Authentication required`,
                404: `Username has no SoundCloud presence`,
                500: `Cache read failed`,
                503: `Cache backend unavailable`,
            },
        });
    }
    /**
     * Delete a SoundCloud track
     * Deletes a SoundCloud track owned by the authenticated user.
     * @returns OperationResultOut OK
     * @throws ApiError
     */
    public static deleteSoundCloudTrack({
        trackId,
    }: {
        /**
         * SoundCloud track id
         */
        trackId: any,
    }): CancelablePromise<OperationResultOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/external/soundcloud/tracks/{track_id}',
            path: {
                'track_id': trackId,
            },
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                404: `Track not found`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Cached SoundCloud track detail
     * Returns the cached SoundCloud track plus linked tracklist IDs. track_id is tried first as a SoundCloud numeric id, then as a local cache UUID. Anonymous-public per
     * @returns SoundCloudTrackCacheOut OK
     * @throws ApiError
     */
    public static getSoundCloudTrackCacheDetails({
        trackId,
    }: {
        /**
         * SoundCloud numeric track id OR local cache UUID
         */
        trackId: any,
    }): CancelablePromise<SoundCloudTrackCacheOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/tracks/{track_id}',
            path: {
                'track_id': trackId,
            },
            errors: {
                400: `Invalid track_id format`,
                404: `Track not in cache`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * Update a SoundCloud track's metadata
     * Updates editable fields on a SoundCloud track owned by the authenticated user. md no Record<string, any>).
     * @returns SoundCloudTrackOut OK
     * @throws ApiError
     */
    public static updateSoundCloudTrack({
        trackId,
        requestBody,
    }: {
        /**
         * SoundCloud track id
         */
        trackId: any,
        /**
         * Track metadata to update
         */
        requestBody: SoundCloudTrackUpdateIn,
    }): CancelablePromise<SoundCloudTrackOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/external/soundcloud/tracks/{track_id}',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `SOUNDCLOUD_NOT_LINKED or invalid body`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                404: `Track not found`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * Cached SoundCloud track artwork image
     * Serves the artwork bytes for a cached SoundCloud track (custom_artwork_url preferred), proxied + cached server-side. Strong ETag + If-None-Match 304 + public max-age=86400. Anonymous.
     * @returns string Image bytes (jpeg/png/webp/gif)
     * @throws ApiError
     */
    public static getSoundCloudTrackArtwork({
        trackId,
        size,
    }: {
        /**
         * SoundCloud numeric track id
         */
        trackId: any,
        /**
         * CDN size variant
         */
        size?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/tracks/{track_id}/artwork',
            path: {
                'track_id': trackId,
            },
            query: {
                'size': size,
            },
            errors: {
                400: `Invalid id or size`,
                404: `No cached track / no artwork / upstream gone`,
                500: `Cache read failed`,
            },
        });
    }
    /**
     * List cached comments for a SoundCloud track
     * Cache-only read. Background refresh keeps wire shape identical.
     * @returns SoundCloudCommentsOut OK
     * @throws ApiError
     */
    public static getSoundCloudTrackComments({
        trackId,
        limit,
        cursor,
    }: {
        /**
         * SoundCloud numeric track ID
         */
        trackId: any,
        /**
         * (Accepted for parity; ignored on the cache-miss path)
         */
        limit?: any,
        /**
         * (Accepted for parity; ignored on the cache-miss path)
         */
        cursor?: any,
    }): CancelablePromise<SoundCloudCommentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/tracks/{track_id}/comments',
            path: {
                'track_id': trackId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `track_id must be numeric`,
                401: `Authentication required`,
            },
        });
    }
    /**
     * Post a comment on a SoundCloud track
     * Posts a comment on a SoundCloud track on behalf of the authenticated user. Optional `timestamp_ms` creates a timed comment. Returns the created comment.
     * @returns SoundCloudCommentItemOut Created
     * @throws ApiError
     */
    public static postSoundCloudTrackComment({
        trackId,
        requestBody,
    }: {
        /**
         * SoundCloud numeric track ID
         */
        trackId: any,
        /**
         * Comment body
         */
        requestBody: SoundCloudCommentWriteIn,
    }): CancelablePromise<SoundCloudCommentItemOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/external/soundcloud/tracks/{track_id}/comments',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid track_id / body`,
                401: `Authentication required or SOUNDCLOUD_TOKEN_EXPIRED`,
                403: `COMMENTS_DISABLED`,
                404: `Track not found`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
    /**
     * SoundCloud - get track streaming URLs + attribution
     * Returns proxy URLs for every available SoundCloud streaming transcoding plus the ToS-mandated attribution block. The FE MUST display attribution alongside playback. The `transcodings[].url` values are proxy URLs the FE passes to its audio element; the resolver endpoint resolves them to short-lived CDN URLs at playback time. Authentication is optional - anon callers receive public-track URLs.
     * @returns SoundCloudStreamOut OK
     * @throws ApiError
     */
    public static getSoundCloudTrackStream({
        trackId,
    }: {
        /**
         * SoundCloud numeric track ID
         */
        trackId: any,
    }): CancelablePromise<SoundCloudStreamOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/tracks/{track_id}/stream',
            path: {
                'track_id': trackId,
            },
            errors: {
                403: `Track is blocked / geo-restricted / paywalled`,
                404: `Track not found on SoundCloud`,
                422: `track_id must be a positive SoundCloud numeric id`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
                503: `SoundCloud not configured (anon mode without client_id)`,
            },
        });
    }
    /**
     * SoundCloud - resolve stream key to short-lived CDN URL (302)
     * Follows the SoundCloud intermediate URL with server-side credentials and returns a 302 redirect to the short-lived pre-signed CDN URL. The browser fetches the CDN URL credential-less. Anonymous-allowed: this is the URL the FE passes to `<audio src>`, which cannot carry auth headers. Validation-first: stream_key MUST be one of the closed enum (http_mp3_128, hls_mp3_128, hls_opus_64, hls_aac_160, preview_mp3_128) BEFORE any SoundCloud call.
     * @returns void
     * @throws ApiError
     */
    public static resolveSoundCloudStreamUrl({
        trackId,
        streamKey,
    }: {
        /**
         * SoundCloud numeric track ID
         */
        trackId: any,
        /**
         * SoundCloud stream format key
         */
        streamKey: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/tracks/{track_id}/stream/{stream_key}',
            path: {
                'track_id': trackId,
                'stream_key': streamKey,
            },
            errors: {
                302: `Redirect to the short-lived SoundCloud CDN URL`,
                403: `Track is blocked / geo-restricted / paywalled`,
                404: `Stream format not available for this track`,
                422: `Invalid track_id or stream_key`,
                429: `SoundCloud rate limited`,
                502: `SoundCloud upstream failure`,
                503: `SoundCloud not configured (anon mode without client_id)`,
            },
        });
    }
    /**
     * Cached SoundCloud user avatar image
     * Serves the avatar bytes for a cached SoundCloud user, proxied + cached server-side so rotting sndcdn URLs and size variants are handled here. Strong ETag + If-None-Match 304 + public max-age=86400. Anonymous.
     * @returns string Image bytes (jpeg/png/webp/gif)
     * @throws ApiError
     */
    public static getSoundCloudUserAvatar({
        soundcloudId,
        size,
    }: {
        /**
         * SoundCloud numeric user id
         */
        soundcloudId: any,
        /**
         * CDN size variant
         */
        size?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/soundcloud/users/{soundcloud_id}/avatar',
            path: {
                'soundcloud_id': soundcloudId,
            },
            query: {
                'size': size,
            },
            errors: {
                400: `Invalid id or size`,
                404: `No cached user / no avatar / upstream gone`,
                500: `Cache read failed`,
            },
        });
    }
}
