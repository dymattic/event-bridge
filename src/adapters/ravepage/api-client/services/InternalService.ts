/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AudiusTrackCachePageRequest } from '../models/AudiusTrackCachePageRequest';
import type { AudiusTrackCachePageResponse } from '../models/AudiusTrackCachePageResponse';
import type { CatalogMatchRequest } from '../models/CatalogMatchRequest';
import type { CatalogMatchResponse } from '../models/CatalogMatchResponse';
import type { DistributionPlaylistsRequest } from '../models/DistributionPlaylistsRequest';
import type { DistributionPlaylistsResponse } from '../models/DistributionPlaylistsResponse';
import type { DistributionStartRequest } from '../models/DistributionStartRequest';
import type { DistributionStartResponse } from '../models/DistributionStartResponse';
import type { EntityLinkRequest } from '../models/EntityLinkRequest';
import type { EntityLinkResponse } from '../models/EntityLinkResponse';
import type { LinkVerifyRequest } from '../models/LinkVerifyRequest';
import type { LinkVerifyResponse } from '../models/LinkVerifyResponse';
import type { ListAdminMemberIDsResponse } from '../models/ListAdminMemberIDsResponse';
import type { OutboxDepthResponse } from '../models/OutboxDepthResponse';
import type { PlatformRefsLookupRequest } from '../models/PlatformRefsLookupRequest';
import type { PlatformRefsLookupResponse } from '../models/PlatformRefsLookupResponse';
import type { ProviderResolveRequest } from '../models/ProviderResolveRequest';
import type { ProviderResolveResponse } from '../models/ProviderResolveResponse';
import type { ReleaseLinksLookupRequest } from '../models/ReleaseLinksLookupRequest';
import type { ReleaseLinksLookupResponse } from '../models/ReleaseLinksLookupResponse';
import type { SoundCloudCatalogCrawlRequest } from '../models/SoundCloudCatalogCrawlRequest';
import type { SoundCloudCatalogCrawlResponse } from '../models/SoundCloudCatalogCrawlResponse';
import type { SoundCloudPurgeUserRequest } from '../models/SoundCloudPurgeUserRequest';
import type { SoundCloudPurgeUserResponse } from '../models/SoundCloudPurgeUserResponse';
import type { SoundCloudSearchForTracklistRequest } from '../models/SoundCloudSearchForTracklistRequest';
import type { SoundCloudSearchForTracklistResponse } from '../models/SoundCloudSearchForTracklistResponse';
import type { SoundCloudTrackCacheByIDsRequest } from '../models/SoundCloudTrackCacheByIDsRequest';
import type { SoundCloudTrackCacheByIDsResponse } from '../models/SoundCloudTrackCacheByIDsResponse';
import type { SoundCloudTrackCachePageRequest } from '../models/SoundCloudTrackCachePageRequest';
import type { SoundCloudTrackCachePageResponse } from '../models/SoundCloudTrackCachePageResponse';
import type { TidalTrackCachePageRequest } from '../models/TidalTrackCachePageRequest';
import type { TidalTrackCachePageResponse } from '../models/TidalTrackCachePageResponse';
import type { TracklistLinksLookupRequest } from '../models/TracklistLinksLookupRequest';
import type { TracklistLinksLookupResponse } from '../models/TracklistLinksLookupResponse';
import type { YouTubeQuotaReportRequest } from '../models/YouTubeQuotaReportRequest';
import type { YouTubeQuotaReportResponse } from '../models/YouTubeQuotaReportResponse';
import type { YouTubeTrackCachePageRequest } from '../models/YouTubeTrackCachePageRequest';
import type { YouTubeTrackCachePageResponse } from '../models/YouTubeTrackCachePageResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InternalService {
    /**
     * List a group's organizer-member user ids (internal)
     * Bare-UUID user ids holding role owner/admin/manager in the group. Internal-mesh-only - consumed by events for the booking group-target notification fan-out.
     * @returns ListAdminMemberIDsResponse OK
     * @throws ApiError
     */
    public static listGroupAdminMemberIds({
        groupId,
    }: {
        /**
         * Group id (bare UUID or grp_<uuid>)
         */
        groupId: any,
    }): CancelablePromise<ListAdminMemberIDsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/internal/groups/{group_id}/admin-member-ids',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group_id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Outbox unpublished-row depth (internal)
     * Cross-worker contract consumed by infra-mgmt's admin System Health cockpit. Reports the transactional-outbox unpublished-row count + oldest-unpublished age. Realtime owns + drains the outbox table; infra-mgmt holds NO SELECT grant on it, so depth crosses the mesh instead of a DB read.
     * @returns OutboxDepthResponse OK
     * @throws ApiError
     */
    public static realtimeOutboxDepthInternal(): CancelablePromise<OutboxDepthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/internal/realtime/outbox/depth',
            errors: {
                401: `Authentication required`,
                503: `Outbox relay not enabled (no database)`,
            },
        });
    }
    /**
     * Page the Audius track cache with set/mix classification (internal)
     * Cross-worker contract consumed by tracks's Audius catalog-hydration tick + the entity-resolution evidence sweep. Cursor-paged export of audius_tracks_cache rows (incl. bpm / musical_key / genre / mood / isrc / license), each classified as track vs DJ set/mix (shared/setmix). `stream_access` mirrors the API's access.stream - the streamability gate; false means the track must NEVER be handed to a player. Verdict drift is persisted best-effort.
     * @returns AudiusTrackCachePageResponse OK
     * @throws ApiError
     */
    public static audiusTrackCachePageInternal({
        requestBody,
    }: {
        /**
         * Page request
         */
        requestBody: AudiusTrackCachePageRequest,
    }): CancelablePromise<AudiusTrackCachePageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/audius/track-cache/page',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Match a track against the SC + YT caches (internal)
     * Cross-worker contract consumed by tracks. Scores the supplied title (+ optional artist / duration) against the local soundcloud_tracks + youtube_videos caches and returns ranked candidates per platform with official metadata + canonical URLs. Read-only; no OAuth.
     * @returns CatalogMatchResponse OK
     * @throws ApiError
     */
    public static catalogMatchInternal({
        requestBody,
    }: {
        /**
         * Match request
         */
        requestBody: CatalogMatchRequest,
    }): CancelablePromise<CatalogMatchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/catalog/match',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Empty title`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List user's playlists on a platform (internal)
     * Cross-worker contract: media-ingest delegates to social-platforms to list the caller's playlists on the target platform. Tokens NEVER cross the worker boundary.
     * @returns DistributionPlaylistsResponse OK
     * @throws ApiError
     */
    public static applyDistributionPlaylists({
        requestBody,
    }: {
        /**
         * Playlists request
         */
        requestBody: DistributionPlaylistsRequest,
    }): CancelablePromise<DistributionPlaylistsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/distribution/playlists',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `PROVIDER_NOT_LINKED`,
                401: `Authentication required or PROVIDER_TOKEN_EXPIRED`,
                422: `VALIDATION_FAILED`,
                429: `PROVIDER_RATE_LIMITED`,
                502: `PROVIDER_UPSTREAM`,
                503: `PROVIDER_UNCONFIGURED`,
            },
        });
    }
    /**
     * Start a distribution job (internal)
     * Cross-worker contract: media-ingest delegates to social-platforms to perform a distribution upload using the user's OAuth-linked external account. Tokens NEVER cross the worker boundary.
     * @returns DistributionStartResponse OK
     * @throws ApiError
     */
    public static applyDistributionStart({
        requestBody,
    }: {
        /**
         * Start request
         */
        requestBody: DistributionStartRequest,
    }): CancelablePromise<DistributionStartResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/distribution/start',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `PROVIDER_NOT_LINKED`,
                401: `Authentication required or PROVIDER_TOKEN_EXPIRED`,
                422: `VALIDATION_FAILED`,
                429: `PROVIDER_RATE_LIMITED`,
                502: `PROVIDER_UPSTREAM`,
                503: `PROVIDER_UNCONFIGURED`,
            },
        });
    }
    /**
     * Apply a cross-worker entity-link mutation (internal)
     * Idempotent link/unlink of a release to a cached YouTube video or SoundCloud track. entity_type accepts "release" only (U1c retired "tracklist" - tracklist media lives in the tracks worker). Internal-mesh-only - callable from tracks via the gateway-mediated mesh-proxy. Cache miss returns 404 RESOURCE_NOT_FOUND; unlink-on-missing returns 404 LINK_NOT_FOUND.
     * @returns EntityLinkResponse OK
     * @throws ApiError
     */
    public static applyEntityLink({
        requestBody,
    }: {
        /**
         * Link request
         */
        requestBody: EntityLinkRequest,
    }): CancelablePromise<EntityLinkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/entity-links',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `RESOURCE_NOT_FOUND or LINK_NOT_FOUND`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Verify YouTube/SoundCloud links (internal)
     * Cross-worker contract consumed by tracks's give-back #12 link-candidate verifier. For each {platform, url} it parses the platform id and confirms existence + identity against the platform's own API (YouTube videos.list with YOUTUBE_API_KEY; SoundCloud /resolve with the app client_id). `checked=false` means the producer did NOT query the platform (unsupported platform, no client, or a quota/rate limit) - the caller must NOT treat `exists=false` as a disown when `checked` is false. `checked=true`+`exists=true` returns the canonical id + owner identity (YouTube channel; SoundCloud owner permalink/id); `checked=true`+`exists=false` means the platform disowns the link (404/deleted/private). Verification carries NO playback verdict - it only proves the link is real.
     * @returns LinkVerifyResponse OK
     * @throws ApiError
     */
    public static linkVerifyInternal({
        requestBody,
    }: {
        /**
         * Link-verify request
         */
        requestBody: LinkVerifyRequest,
    }): CancelablePromise<LinkVerifyResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/links/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve/hydrate provider rows by platform id (internal)
     * Batch resolve of cache-row UUIDs to durable platform ids, and hydration of display metadata for platform ids the caller already holds. Internal-mesh-only - consumed by tracks for `tracklist_media`. A ref with no cached row is ABSENT from `hits` (purged, never cached, or SoundCloud-ToU-gated); absence is the normal miss signal, not an error.
     * @returns PlatformRefsLookupResponse OK
     * @throws ApiError
     */
    public static lookupPlatformRefs({
        requestBody,
    }: {
        /**
         * Refs to resolve/hydrate
         */
        requestBody: PlatformRefsLookupRequest,
    }): CancelablePromise<PlatformRefsLookupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/platform-refs/lookup',
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
     * Resolve ISRC/title to playable provider ids (internal)
     * Cross-worker contract consumed by tracks's provider-resolution cache. Resolves each item to per-provider track ids: TIDAL + Beatport by ISRC only; Spotify + Apple Music by ISRC, falling back to title/artist search for ISRC-less items; Audius + YouTube by title/artist (fuzzy, duration-gated; an Audius row's own ISRC upgrades the match to exact). Fuzzy hits carry the provider-reported ISRC in `provider_isrc` as discovery data the caller may adopt. `playback` is a LEGAL verdict, not a capability guess - `none` = deep link only (TIDAL playback is PROHIBITED without written approval; Beatport likewise), `embed` = the provider's own official player (Spotify, Apple Music, YouTube), `stream` = we may stream it ourselves (Audius, Open Music License, attribution required). Providers with no credentials - or, for YouTube, an exhausted resolve quota budget - are SKIPPED and listed in `skipped_providers`: absence of a hit for a skipped provider means "not asked", NOT "not found", so the caller must not cache a negative for it. With zero credentials configured this returns an empty, valid response.
     * @returns ProviderResolveResponse OK
     * @throws ApiError
     */
    public static providerResolveInternal({
        requestBody,
    }: {
        /**
         * Resolve request
         */
        requestBody: ProviderResolveRequest,
    }): CancelablePromise<ProviderResolveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/providers/resolve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Look up YT/SC links for releases (internal)
     * Batch read of cached YouTube videos + SoundCloud tracks linked to the given releases. Internal-mesh-only - consumed by tracks to hydrate Release responses.
     * @returns ReleaseLinksLookupResponse OK
     * @throws ApiError
     */
    public static lookupReleaseLinks({
        requestBody,
    }: {
        /**
         * Release ids (bare UUIDs)
         */
        requestBody: ReleaseLinksLookupRequest,
    }): CancelablePromise<ReleaseLinksLookupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/release-links/lookup',
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
     * Trigger a full SoundCloud catalog crawl for a user (internal)
     * Fire-and-forget cross-worker trigger consumed by identity after a SoundCloud OAuth link. ACKs 202 and runs the full paginated /me/tracks crawl in the background. Internal-mesh-only - source identity via the gateway mesh-proxy.
     * @returns SoundCloudCatalogCrawlResponse Accepted
     * @throws ApiError
     */
    public static soundcloudCatalogCrawlInternal({
        requestBody,
    }: {
        /**
         * Crawl request
         */
        requestBody: SoundCloudCatalogCrawlRequest,
    }): CancelablePromise<SoundCloudCatalogCrawlResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/soundcloud/catalog-crawl',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Empty/invalid user_id`,
            },
        });
    }
    /**
     * Purge a disconnected SoundCloud user's cached content (internal)
     * Fire-and-forget cross-worker trigger consumed by identity after a SoundCloud OAuth UNLINK. ACKs 202 and purges the disconnecting user's cached UC/PD in the background (ToU D3 "delete within 7 days"). Internal-mesh-only - source identity via the gateway mesh-proxy.
     * @returns SoundCloudPurgeUserResponse Accepted
     * @throws ApiError
     */
    public static soundcloudPurgeUserInternal({
        requestBody,
    }: {
        /**
         * Purge request
         */
        requestBody: SoundCloudPurgeUserRequest,
    }): CancelablePromise<SoundCloudPurgeUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/soundcloud/purge-user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Empty/invalid provider_id`,
            },
        });
    }
    /**
     * Bulk SoundCloud search for a tracklist (internal)
     * Cross-worker contract consumed by tracks. Iterates the caller-supplied queries, calls SoundCloud `/v1/tracks?q=... Per-query failures captured in the row's `error` field; the batch never aborts on a single SC failure. py:1202+::search_tracks` per-query.
     * @returns SoundCloudSearchForTracklistResponse OK
     * @throws ApiError
     */
    public static searchSoundcloudForTracklistInternal({
        requestBody,
    }: {
        /**
         * Bulk-search request
         */
        requestBody: SoundCloudSearchForTracklistRequest,
    }): CancelablePromise<SoundCloudSearchForTracklistResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/soundcloud/search-for-tracklist',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required OR caller's SC token expired`,
                403: `Caller has no linked SoundCloud account`,
                422: `Validation failed`,
                502: `Identity-side token resolution failed`,
                503: `SoundCloud client unconfigured`,
            },
        });
    }
    /**
     * Resolve SoundCloud cache rows by track id (internal)
     * Cross-worker contract consumed by tracks's entity_account_scoring sweep. Given a bounded set of SC track ids, returns the same classified export rows (artist identity + set/mix verdict) without a full cursor scan - the sweep drives evidence by its own linked+tagged tracks rather than paging the whole cache.
     * @returns SoundCloudTrackCacheByIDsResponse OK
     * @throws ApiError
     */
    public static soundcloudTrackCacheByIDsInternal({
        requestBody,
    }: {
        /**
         * By-ids request
         */
        requestBody: SoundCloudTrackCacheByIDsRequest,
    }): CancelablePromise<SoundCloudTrackCacheByIDsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/soundcloud/track-cache/by-ids',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Page the SoundCloud track cache with set/mix classification (internal)
     * Cross-worker contract consumed by tracks's catalog-hydration tick. Cursor-paged export of soundcloud_tracks rows, each classified as track vs DJ set/mix (shared/setmix: >20min OR set-ish keyword in title/genre/tags). Verdicts are persisted on the cache rows best-effort.
     * @returns SoundCloudTrackCachePageResponse OK
     * @throws ApiError
     */
    public static soundcloudTrackCachePageInternal({
        requestBody,
    }: {
        /**
         * Page request
         */
        requestBody: SoundCloudTrackCachePageRequest,
    }): CancelablePromise<SoundCloudTrackCachePageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/soundcloud/track-cache/page',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Page the TIDAL track cache with set/mix classification (internal)
     * Cross-worker contract consumed by tracks's tidal catalog-hydration tick + the entity-resolution evidence sweep. Cursor-paged export of tidal_tracks_cache rows (incl. ISRC/BPM/key), each classified as track vs DJ set/mix (shared/setmix). Verdicts persisted best-effort.
     * @returns TidalTrackCachePageResponse OK
     * @throws ApiError
     */
    public static tidalTrackCachePageInternal({
        requestBody,
    }: {
        /**
         * Page request
         */
        requestBody: TidalTrackCachePageRequest,
    }): CancelablePromise<TidalTrackCachePageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/tidal/track-cache/page',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Look up YT/SC links for tracklists (internal)
     * Batch read of cached YouTube videos + SoundCloud tracks linked to the given tracklists. Internal-mesh-only - consumed by tracks to hydrate Tracklist responses.
     * @returns TracklistLinksLookupResponse OK
     * @throws ApiError
     */
    public static lookupTracklistLinks({
        requestBody,
    }: {
        /**
         * Tracklist ids (bare UUIDs)
         */
        requestBody: TracklistLinksLookupRequest,
    }): CancelablePromise<TracklistLinksLookupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/tracklist-links/lookup',
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
     * Self-metered YouTube Data API quota report (internal)
     * Cross-worker contract consumed by infra-mgmt's admin quota-insights panel. Today's unit spend vs YT_DAILY_QUOTA_UNITS, crawl-budget gate (60%), per-endpoint split, and up to 30 day-bucket history rows from the youtube_quota_usage meter. Self-metered only - a plain API key cannot read Google-side quota.
     * @returns YouTubeQuotaReportResponse OK
     * @throws ApiError
     */
    public static youtubeQuotaReportInternal({
        requestBody,
    }: {
        /**
         * Report request
         */
        requestBody: YouTubeQuotaReportRequest,
    }): CancelablePromise<YouTubeQuotaReportResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/youtube/quota-report',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Page the YouTube video cache with set/mix classification (internal)
     * Cross-worker contract consumed by tracks's youtube catalog-hydration tick. Cursor-paged export of youtube_videos rows, each classified as track vs DJ set/mix (shared/setmix: >20min OR set-ish keyword in title/tags). Verdicts are persisted on the cache rows best-effort.
     * @returns YouTubeTrackCachePageResponse OK
     * @throws ApiError
     */
    public static youtubeTrackCachePageInternal({
        requestBody,
    }: {
        /**
         * Page request
         */
        requestBody: YouTubeTrackCachePageRequest,
    }): CancelablePromise<YouTubeTrackCachePageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/social-platforms/youtube/track-cache/page',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
}
