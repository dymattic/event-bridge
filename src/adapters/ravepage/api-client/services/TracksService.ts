/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichFromPlatformsOut } from '../models/EnrichFromPlatformsOut';
import type { EventPlayedTracksOut } from '../models/EventPlayedTracksOut';
import type { FingerprintIdentifyIn } from '../models/FingerprintIdentifyIn';
import type { FingerprintIdentifyOut } from '../models/FingerprintIdentifyOut';
import type { LibraryMatchFlagOut } from '../models/LibraryMatchFlagOut';
import type { LibraryTrackConfirmVariantIn } from '../models/LibraryTrackConfirmVariantIn';
import type { LibraryTrackOut } from '../models/LibraryTrackOut';
import type { LinkSuppressionIn } from '../models/LinkSuppressionIn';
import type { ListenersAlsoPlayOut } from '../models/ListenersAlsoPlayOut';
import type { ListeningSuggestionsOut } from '../models/ListeningSuggestionsOut';
import type { MetadataConsensusOut } from '../models/MetadataConsensusOut';
import type { MetadataObservationIn } from '../models/MetadataObservationIn';
import type { MetadataObservationOut } from '../models/MetadataObservationOut';
import type { PerformerPlayStatsOut } from '../models/PerformerPlayStatsOut';
import type { PerformerSetsOut } from '../models/PerformerSetsOut';
import type { PlayReportIn } from '../models/PlayReportIn';
import type { PlayReportOut } from '../models/PlayReportOut';
import type { ProvisionalTracksOut } from '../models/ProvisionalTracksOut';
import type { StreamArtistsOut } from '../models/StreamArtistsOut';
import type { StreamPreferencesIn } from '../models/StreamPreferencesIn';
import type { StreamPreferencesOut } from '../models/StreamPreferencesOut';
import type { StreamTracklistOut } from '../models/StreamTracklistOut';
import type { TrackArtistCreateIn } from '../models/TrackArtistCreateIn';
import type { TrackArtistOut } from '../models/TrackArtistOut';
import type { TrackBrowseFacetsOut } from '../models/TrackBrowseFacetsOut';
import type { TrackBrowseListOut } from '../models/TrackBrowseListOut';
import type { TrackCreateIn } from '../models/TrackCreateIn';
import type { TrackExternalIDCreateIn } from '../models/TrackExternalIDCreateIn';
import type { TrackExternalIDOut } from '../models/TrackExternalIDOut';
import type { TrackExternalIDVoteIn } from '../models/TrackExternalIDVoteIn';
import type { TrackFieldOverrideIn } from '../models/TrackFieldOverrideIn';
import type { TrackFieldOverrideOut } from '../models/TrackFieldOverrideOut';
import type { TrackFingerprintCreateIn } from '../models/TrackFingerprintCreateIn';
import type { TrackFingerprintOut } from '../models/TrackFingerprintOut';
import type { TracklistArtistsOut } from '../models/TracklistArtistsOut';
import type { TrackMergeIn } from '../models/TrackMergeIn';
import type { TrackOut } from '../models/TrackOut';
import type { TrackUpdateIn } from '../models/TrackUpdateIn';
import type { TrendingMetricsOut } from '../models/TrendingMetricsOut';
import type { UserSetsOut } from '../models/UserSetsOut';
import type { WaveformOut } from '../models/WaveformOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TracksService {
    /**
     * Confirm library-track variant
     * Mints a child canonical track (parent = the currently-
     * matched canonical, optional version_label) and re-points
     * the caller's library row to it (status → match). Use when
     * the matcher flagged the row suspected_variant.
     * @returns TrackOut The minted child track
     * @throws ApiError
     */
    public static confirmLibraryTrackVariant({
        libraryTrackId,
        requestBody,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
        /**
         * Variant payload
         */
        requestBody?: LibraryTrackConfirmVariantIn,
    }): CancelablePromise<TrackOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/tracks/{library_track_id}/confirm-variant',
            path: {
                'library_track_id': libraryTrackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Library row not found / not yours`,
                409: `Library row has no canonical link`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get library-track match flag
     * Returns the fingerprint-corroboration status of a library
     * row's canonical link plus a suggested resolution
     * (confirm_variant | unlink | none). BOLA-scoped to the
     * caller's own library rows.
     * @returns LibraryMatchFlagOut OK
     * @throws ApiError
     */
    public static getLibraryTrackMatchFlag({
        libraryTrackId,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
    }): CancelablePromise<LibraryMatchFlagOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library/tracks/{library_track_id}/match-flag',
            path: {
                'library_track_id': libraryTrackId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Library row not found / not yours`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Unlink library track
     * Clears the canonical link on the caller's library row
     * (status → unknown). Use when the matcher flagged the row
     * suspected_mismatch (wrong track).
     * @returns LibraryTrackOut The updated library row
     * @throws ApiError
     */
    public static unlinkLibraryTrack({
        libraryTrackId,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
    }): CancelablePromise<LibraryTrackOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/tracks/{library_track_id}/unlink',
            path: {
                'library_track_id': libraryTrackId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Library row not found / not yours`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List disputed track external IDs
     * Admin-only. Returns external ID suggestions with conflicting votes.
     * @returns TrackExternalIDOut OK
     * @throws ApiError
     */
    public static listDisputedTrackExternalIDs({
        limit,
    }: {
        /**
         * Page size (1..200)
         */
        limit?: any,
    }): CancelablePromise<Array<TrackExternalIDOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/track-external-ids/disputed',
            query: {
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Admin only`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete a track external ID
     * Removes an external-ID suggestion (e.g. a bad enrichment
     * mis-link). Authorized for an admin, a verified owning
     * performer of the track, or the original suggester. Votes
     * cascade on delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteTrackExternalId({
        externalId,
    }: {
        /**
         * External ID row UUID (or txid_<uuid>)
         */
        externalId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/track-external-ids/{external_id}',
            path: {
                'external_id': externalId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Not authorized`,
                404: `External ID not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Vote on track external ID
     * Casts a vote (yes/no) on an external ID suggestion.
     * @returns TrackExternalIDOut OK
     * @throws ApiError
     */
    public static voteTrackExternalId({
        externalId,
        requestBody,
    }: {
        /**
         * External ID row UUID
         */
        externalId: any,
        /**
         * Vote payload
         */
        requestBody: TrackExternalIDVoteIn,
    }): CancelablePromise<TrackExternalIDOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/track-external-ids/{external_id}/vote',
            path: {
                'external_id': externalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `External ID not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Create track
     * Creates a track row + initial artist/external-id links.
     * @returns TrackOut Created
     * @throws ApiError
     */
    public static createTrack({
        requestBody,
    }: {
        /**
         * Track payload
         */
        requestBody: TrackCreateIn,
    }): CancelablePromise<TrackOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Browse the track catalog
     * Anonymous, filterable listing over canonical tracks with per-field metadata-consensus winners pre-pivoted (artist/genre/label/key/bpm). All filters are optional and composable: `q` (case-insensitive substring on title OR artist), `genre`/`label` (CSV, exact-match-any against the consensus winner, case-insensitive), `camelot` (CSV of Camelot codes like `8A,9B` against the normalized key winner), `bpm_min`/`bpm_max` (inclusive range on the bpm winner), `has_waveform` (a linked library waveform exists), `linked_external` (provider slug, snake_case - e.g. `soundcloud`, `youtube`, `audius`, `spotify`, `musicbrainz` - only tracks with that external link; matches the same two stores `external_providers` projects). Sort with `sort` (added|title|artist|bpm|key|genre|label; default added) + `order` (asc|desc; default desc for added, asc otherwise; key sorts in Camelot wheel order, un-keyed tracks last) - ties always break by title, id for stable pagination. `total` carries the full filtered count.
     * @returns TrackBrowseListOut OK
     * @throws ApiError
     */
    public static browseTracks({
        q,
        genre,
        label,
        camelot,
        bpmMin,
        bpmMax,
        hasWaveform,
        linkedExternal,
        sort,
        order,
        limit,
        offset,
    }: {
        /**
         * Substring on title OR artist (case-insensitive)
         */
        q?: any,
        /**
         * CSV of genres (consensus winner, exact-match any)
         */
        genre?: any,
        /**
         * CSV of labels (consensus winner, exact-match any)
         */
        label?: any,
        /**
         * CSV of Camelot codes (e.g. 8A,9B) against the normalized key winner
         */
        camelot?: any,
        /**
         * Minimum BPM (inclusive)
         */
        bpmMin?: any,
        /**
         * Maximum BPM (inclusive)
         */
        bpmMax?: any,
        /**
         * Filter on linked waveform existence
         */
        hasWaveform?: any,
        /**
         * Provider slug (snake_case) - only tracks linked to that provider
         */
        linkedExternal?: any,
        /**
         * Sort: added|title|artist|bpm|key|genre|label (default added)
         */
        sort?: any,
        /**
         * asc|desc (default desc for added, asc otherwise)
         */
        order?: any,
        /**
         * Page size (1..100)
         */
        limit?: any,
        /**
         * Page offset (>= 0)
         */
        offset?: any,
    }): CancelablePromise<TrackBrowseListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/browse',
            query: {
                'q': q,
                'genre': genre,
                'label': label,
                'camelot': camelot,
                'bpm_min': bpmMin,
                'bpm_max': bpmMax,
                'has_waveform': hasWaveform,
                'linked_external': linkedExternal,
                'sort': sort,
                'order': order,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Malformed filter/sort/paging parameter`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Browse facet counts
     * Anonymous catalog-wide facet counts for the browse filter UI. Counts are per-track over the SAME per-field metadata-consensus winner the browse listing serves (a track with competing genre values counts exactly once, under its modal winner). `genres`/`labels`: top 100 `{value,count}` by count DESC then value ASC (display variant grouped case-insensitively). `camelots`: every Camelot wheel code present among key winners (e.g. `8A`; max 24). `total`: canonical-catalog track count - equals the unfiltered browse `total`.
     * @returns TrackBrowseFacetsOut OK
     * @throws ApiError
     */
    public static browseTrackFacets(): CancelablePromise<TrackBrowseFacetsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/browse/facets',
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Get track by external provider ID
     * Resolves the canonical track linked to a provider-native
     * track id (track_external_ids) and returns the same fully
     * hydrated projection as GET /tracks/{track_id} (artists,
     * external_ids, consensus_best, overrides, field_sources).
     * @returns TrackOut OK
     * @throws ApiError
     */
    public static getTrackByExternalId({
        provider,
        providerTrackId,
    }: {
        /**
         * Provider slug (e.g. soundcloud, spotify, youtube)
         */
        provider: any,
        /**
         * Provider-native track id (1..255 chars)
         */
        providerTrackId: any,
    }): CancelablePromise<TrackOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/by-external/{provider}/{provider_track_id}',
            path: {
                'provider': provider,
                'provider_track_id': providerTrackId,
            },
            errors: {
                400: `Bad provider`,
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get track by ISRC
     * Returns a track by ISRC code.
     * @returns TrackOut OK
     * @throws ApiError
     */
    public static getTrackByIsrc({
        isrc,
    }: {
        /**
         * ISRC code (1..32 chars)
         */
        isrc: any,
    }): CancelablePromise<TrackOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/by-isrc/{isrc}',
            path: {
                'isrc': isrc,
            },
            errors: {
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List an event's played tracks grouped by performer
     * Returns the tracks played at an event, grouped by the
     * performer who played each. Each play carries provider
     * buy/stream links + artist credits; unlinked plays fall
     * back to their raw library title/artist. Event-public read.
     * @returns EventPlayedTracksOut OK
     * @throws ApiError
     */
    public static listEventPlayedTracks({
        eventId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
    }): CancelablePromise<EventPlayedTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/events/{event_id}/played-tracks',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Invalid event id`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Identify a track by Chromaprint fingerprint
     * Returns native tracks that are the same recording as
     * the supplied Chromaprint fingerprint, ranked by acoustic
     * similarity. Anonymous-public corpus lookup.
     * @returns FingerprintIdentifyOut OK
     * @throws ApiError
     */
    public static identifyTrackByFingerprint({
        requestBody,
    }: {
        /**
         * Fingerprint payload
         */
        requestBody: FingerprintIdentifyIn,
    }): CancelablePromise<FingerprintIdentifyOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/fingerprint/identify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Global trending play metrics
     * Most-played genres and artists across all sets in a time window.
     * Genres count every play (raw library genre, incl. unlinked plays);
     * artists count linked plays only (credited via the canonical track).
     * Anonymous-public discovery feed.
     * @returns TrendingMetricsOut OK
     * @throws ApiError
     */
    public static getTrendingMetrics({
        window,
    }: {
        /**
         * Aggregation window
         */
        window?: any,
    }): CancelablePromise<TrendingMetricsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/metrics/trending',
            query: {
                'window': window,
            },
            errors: {
                422: `Invalid window`,
            },
        });
    }
    /**
     * Performer play profile
     * A performer's play profile: top genres + artists they spin and
     * headline counts (total plays, distinct tracks, distinct sets),
     * aggregated over the tracks they played in their sets.
     * Optional time window. Anonymous-public (feeds the public profile).
     * @returns PerformerPlayStatsOut OK
     * @throws ApiError
     */
    public static getPerformerPlayStats({
        performerId,
        window,
    }: {
        /**
         * Performer ID (perf_<uuid> or bare UUID)
         */
        performerId: any,
        /**
         * Aggregation window
         */
        window?: any,
    }): CancelablePromise<PerformerPlayStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/performers/{performer_id}/play-stats',
            path: {
                'performer_id': performerId,
            },
            query: {
                'window': window,
            },
            errors: {
                422: `Invalid performer_id or window`,
            },
        });
    }
    /**
     * List a performer's public sets
     * A performer's PUBLIC, ENDED sets (the "Recent sets"
     * section), newest-first. Anonymous-public - only public
     * ended sets are surfaced. Paginated.
     * @returns PerformerSetsOut OK
     * @throws ApiError
     */
    public static listPerformerSets({
        performerId,
        limit,
        offset,
    }: {
        /**
         * Performer ID (perf_<uuid> or bare UUID)
         */
        performerId: any,
        /**
         * Max sets (1-100, default 20)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<PerformerSetsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/performers/{performer_id}/sets',
            path: {
                'performer_id': performerId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Invalid performer_id or pagination`,
            },
        });
    }
    /**
     * List provisional tracks
     * Admin triage of auto-created (catalogization) tracks.
     * @returns ProvisionalTracksOut OK
     * @throws ApiError
     */
    public static listProvisionalTracks({
        limit,
    }: {
        /**
         * Max rows (1-200, default 50)
         */
        limit?: any,
    }): CancelablePromise<ProvisionalTracksOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/provisional',
            query: {
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Admin only`,
            },
        });
    }
    /**
     * Search tracks
     * Free-text track search across title + artist + ISRC.
     * @returns TrackOut OK
     * @throws ApiError
     */
    public static searchTracks({
        q,
        limit,
    }: {
        /**
         * Search query (1..200 chars)
         */
        q: any,
        /**
         * Page size (1..200)
         */
        limit?: any,
    }): CancelablePromise<Array<TrackOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/search',
            query: {
                'q': q,
                'limit': limit,
            },
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List the artists in a derived live set
     * The "artists from this DJ set" pivot over a PUBLIC
     * stream's derived play log: credited artists ranked by
     * distinct-track count (capped 25) with per-artist RAW
     * genre counts. Anonymous-public - non-public sets are
     * reported as not found, never revealed.
     * @returns StreamArtistsOut OK
     * @throws ApiError
     */
    public static listStreamArtists({
        streamId,
        limit,
    }: {
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
        /**
         * Max artists (1-25, default 25)
         */
        limit?: any,
    }): CancelablePromise<StreamArtistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/streams/{stream_id}/artists',
            path: {
                'stream_id': streamId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Stream not found or not public`,
                422: `Invalid stream_id or limit`,
            },
        });
    }
    /**
     * List the artists in a DJ set's tracklist
     * The "artists from this DJ set" pivot: credited artists
     * behind an uploaded tracklist's matched items, ranked by
     * distinct-track count (capped 25) with per-artist RAW
     * genre counts for client-side family clustering.
     * Anonymous-public. performer_id is null for credit-only
     * (unresolved) artists.
     * @returns TracklistArtistsOut OK
     * @throws ApiError
     */
    public static listTracklistArtists({
        tracklistId,
        limit,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Max artists (1-25, default 25)
         */
        limit?: any,
    }): CancelablePromise<TracklistArtistsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/tracklists/{tracklist_id}/artists',
            path: {
                'tracklist_id': tracklistId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Tracklist not found`,
                422: `Invalid tracklist_id or limit`,
            },
        });
    }
    /**
     * Listening-driven suggestions
     * Ranked track suggestions from the caller's recent plays
     * (last ~200 plays / 30 days): each recently-played
     * MB-linked track seeds its stored ListenBrainz
     * "listeners also play" edges; suggestions are scored by
     * LB co-listen strength × play-recency decay × agreement
     * (distinct seeds pointing at the same recording). The
     * seeds themselves and anything played recently are
     * excluded. Resolved items carry the hydrated canonical
     * track; unresolved recordings are lean external stubs.
     * `because_of` names the top contributing seed per item.
     * Stored edges only - never calls ListenBrainz inline.
     * @returns ListeningSuggestionsOut OK
     * @throws ApiError
     */
    public static getListeningSuggestions({
        limit,
    }: {
        /**
         * Max items (default 25, cap 50)
         */
        limit?: any,
    }): CancelablePromise<ListeningSuggestionsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/users/me/listening-suggestions',
            query: {
                'limit': limit,
            },
            errors: {
                401: `Authentication required`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Report a qualifying track play
     * Records one listen by the authenticated caller into the
     * play log - the seed substrate for
     * GET /tracks/users/me/listening-suggestions.
     *
     * The CLIENT decides when a play qualifies (>=30s played, or
     * >=50% of the track; once per track per listening session)
     * because only it knows how much audio actually played. The
     * server re-validates that evidence, then dedupes and
     * rate-limits:
     * - `session_id` + track is idempotent - a seek/replay storm
     * inside one session lands exactly one row.
     * - The same track inside a ~20min window is absorbed even
     * across session ids (see `dedupe_window_seconds`).
     * - 150 plays per user per hour, then 429.
     *
     * A deduped report is a SUCCESS (200, `recorded:false`,
     * `deduped:true`) - do NOT retry it. A recorded play emits
     * the user-scoped `listening_suggestion.updated` realtime
     * topic (throttled), so suggestion views refresh live.
     *
     * Web plays link the canonical track directly; they never
     * enter the caller's DJ library and never appear in set
     * tracklists, play metrics or trending aggregates.
     * @returns PlayReportOut OK
     * @throws ApiError
     */
    public static reportTrackPlay({
        requestBody,
    }: {
        /**
         * Play report
         */
        requestBody: PlayReportIn,
    }): CancelablePromise<PlayReportOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/users/me/plays',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Authentication required`,
                404: `Track not found`,
                422: `Play does not qualify`,
                429: `Too many plays reported`,
            },
        });
    }
    /**
     * Get default set visibility
     * The caller's default set visibility - newly-created sets
     * inherit it. Absent preference → system default 'private'.
     * @returns StreamPreferencesOut OK
     * @throws ApiError
     */
    public static getStreamPreferences(): CancelablePromise<StreamPreferencesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/users/me/stream-preferences',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Set default set visibility
     * Upsert the caller's default set visibility - newly-created
     * sets inherit it.
     * @returns StreamPreferencesOut OK
     * @throws ApiError
     */
    public static putStreamPreferences({
        requestBody,
    }: {
        /**
         * Default visibility
         */
        requestBody: StreamPreferencesIn,
    }): CancelablePromise<StreamPreferencesOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tracks/users/me/stream-preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Authentication required`,
                422: `Invalid visibility`,
            },
        });
    }
    /**
     * List the caller's sets
     * Returns the distinct sets (by live stream) the caller has
     * played, newest-first, with each set's time span, play
     * count, and attached event. BOLA-scoped: a user reads only
     * their own sets - a path user_id that isn't the caller →
     * 404.
     * @returns UserSetsOut OK
     * @throws ApiError
     */
    public static listUserSets({
        userId,
        limit,
        offset,
    }: {
        /**
         * User ID (usr_<uuid> or bare UUID)
         */
        userId: any,
        /**
         * Max sets (1-500, default 100)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<UserSetsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/users/{user_id}/sets',
            path: {
                'user_id': userId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get the caller's own set tracklist
     * Returns the derived tracklist for one of the caller's
     * sets. BOLA-scoped: a path user_id that isn't the caller →
     * 404; the read also filters by user so a stream that isn't
     * the caller's resolves to an empty tracklist.
     * @returns StreamTracklistOut OK
     * @throws ApiError
     */
    public static getUserSetTracklist({
        userId,
        streamId,
        limit,
        offset,
    }: {
        /**
         * User ID (usr_<uuid> or bare UUID)
         */
        userId: any,
        /**
         * Stream ID (strm_<uuid> or bare UUID)
         */
        streamId: any,
        /**
         * Max tracks (1-500, default 200)
         */
        limit?: any,
        /**
         * Page offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<StreamTracklistOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/users/{user_id}/sets/{stream_id}/tracklist',
            path: {
                'user_id': userId,
                'stream_id': streamId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get track by ID
     * Returns a single track projection.
     * @returns TrackOut OK
     * @throws ApiError
     */
    public static getTrack({
        trackId,
    }: {
        /**
         * Track ID (UUID or trk_<uuid>)
         */
        trackId: any,
    }): CancelablePromise<TrackOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/{track_id}',
            path: {
                'track_id': trackId,
            },
            errors: {
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Update track
     * Admin-only. Patches track fields.
     * @returns TrackOut OK
     * @throws ApiError
     */
    public static updateTrack({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID
         */
        trackId: any,
        /**
         * Patch payload
         */
        requestBody: TrackUpdateIn,
    }): CancelablePromise<TrackOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tracks/{track_id}',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Admin only`,
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Attach artist to track
     * Adds an artist link to a track.
     * @returns TrackArtistOut Created
     * @throws ApiError
     */
    public static attachTrackArtist({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID
         */
        trackId: any,
        /**
         * Artist link payload
         */
        requestBody: TrackArtistCreateIn,
    }): CancelablePromise<TrackArtistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/artists',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Track not found`,
                409: `Artist already linked`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Un-suppress a discovered link
     * Restores a previously suppressed discovered link to
     * platform_links. Authorized for a claimed credited
     * performer of the track; a non-owner gets 404 (BOLA-safe).
     * @returns void
     * @throws ApiError
     */
    public static unsuppressTrackDiscoveredLink({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID (UUID or trk_<uuid>)
         */
        trackId: any,
        /**
         * Discovered link to un-suppress
         */
        requestBody: LinkSuppressionIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tracks/{track_id}/discovered-link-suppressions',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Track/link not found or not owned`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Suppress a discovered link
     * Hides one discovered (MusicBrainz-harvested) link on a
     * track so it no longer appears in platform_links.
     * Authorized for a claimed credited performer of the track;
     * a non-owner gets 404 (BOLA-safe).
     * @returns void
     * @throws ApiError
     */
    public static suppressTrackDiscoveredLink({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID (UUID or trk_<uuid>)
         */
        trackId: any,
        /**
         * Discovered link to suppress
         */
        requestBody: LinkSuppressionIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/discovered-link-suppressions',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Track/link not found or not owned`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Enrich a track from the SoundCloud + YouTube caches
     * Scores the track's title/duration against the local SC + YT
     * caches and writes strong matches as external-id suggestions
     * (official buy/stream links). Authed.
     * @returns EnrichFromPlatformsOut OK
     * @throws ApiError
     */
    public static enrichTrackFromPlatforms({
        trackId,
    }: {
        /**
         * Track ID (UUID or trk_<uuid>)
         */
        trackId: any,
    }): CancelablePromise<EnrichFromPlatformsOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/enrich-from-platforms',
            path: {
                'track_id': trackId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Track not found`,
                422: `Unprocessable Entity`,
                502: `Catalog service unavailable`,
                503: `Enrichment not configured`,
            },
        });
    }
    /**
     * List track external IDs
     * Returns external ID suggestions (Spotify, MusicBrainz, ...) attached to a track.
     * @returns TrackExternalIDOut OK
     * @throws ApiError
     */
    public static listTrackExternalIds({
        trackId,
    }: {
        /**
         * Track ID
         */
        trackId: any,
    }): CancelablePromise<Array<TrackExternalIDOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/{track_id}/external-ids',
            path: {
                'track_id': trackId,
            },
            errors: {
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Suggest track external ID
     * Suggests an external ID (Spotify, MusicBrainz, ...) for a track.
     * @returns TrackExternalIDOut Created
     * @throws ApiError
     */
    public static suggestTrackExternalId({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID
         */
        trackId: any,
        /**
         * External ID payload
         */
        requestBody: TrackExternalIDCreateIn,
    }): CancelablePromise<TrackExternalIDOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/external-ids',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Track not found`,
                409: `Already exists`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Set artist hard-override for a track field
     * A platform-verified credited artist on the track sets an
     * authoritative value for one metadata field. The value
     * wins over crowd consensus on read (source
     * `artist-provided`). Non-owners receive 404 (BOLA-safe).
     * Field authority: objective analysis fields (bpm, key,
     * duration_ms, beatgrid) accept any verified credit;
     * identity fields (title, artist_text, album, label, isrc,
     * release_year) require the track's PRIMARY credit - a
     * verified-but-non-primary credit receives 403.
     * For field=beatgrid supply `markers`; for scalar fields
     * supply `value`.
     * @returns TrackFieldOverrideOut OK
     * @throws ApiError
     */
    public static setTrackFieldOverride({
        trackId,
        field,
        requestBody,
    }: {
        /**
         * Track ID (trk_<uuid> or bare UUID)
         */
        trackId: any,
        /**
         * Metadata field
         */
        field: any,
        /**
         * Override value
         */
        requestBody: TrackFieldOverrideIn,
    }): CancelablePromise<TrackFieldOverrideOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tracks/{track_id}/fields/{field}',
            path: {
                'track_id': trackId,
                'field': field,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Authentication required`,
                403: `Verified credit but not the primary - field not permitted`,
                404: `Track not found or caller not a verified owner`,
                422: `Invalid field or value`,
            },
        });
    }
    /**
     * List track fingerprints
     * Returns Chromaprint fingerprint rows for a track.
     * @returns TrackFingerprintOut OK
     * @throws ApiError
     */
    public static listTrackFingerprints({
        trackId,
    }: {
        /**
         * Track ID
         */
        trackId: any,
    }): CancelablePromise<Array<TrackFingerprintOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/{track_id}/fingerprints',
            path: {
                'track_id': trackId,
            },
            errors: {
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Create track fingerprint
     * Adds a Chromaprint fingerprint row for the track.
     * @returns TrackFingerprintOut Created
     * @throws ApiError
     */
    public static createTrackFingerprint({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID
         */
        trackId: any,
        /**
         * Fingerprint payload
         */
        requestBody: TrackFingerprintCreateIn,
    }): CancelablePromise<TrackFingerprintOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/fingerprints',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Listeners also play
     * Similar recordings for a track from the ListenBrainz
     * community dataset ("people who listen to A also listen
     * to B"), score DESC, capped at 25. Items resolved against
     * the rave.page catalog carry the hydrated canonical track
     * (id, title, artists, provider playability, artwork);
     * unresolved MusicBrainz recordings are lean external
     * stubs with display names. Tracks without a MusicBrainz
     * link return an empty list (recording_mbid null).
     * `exclude` (CSV of track ids, max 200) drops items that
     * resolve to already-queued/played tracks - the radio /
     * queue-extender continuation contract (#62).
     * @returns ListenersAlsoPlayOut OK
     * @throws ApiError
     */
    public static getTrackListenersAlsoPlay({
        trackId,
        exclude,
    }: {
        /**
         * Track ID (UUID or trk_<uuid>)
         */
        trackId: any,
        /**
         * CSV of track ids (UUID or trk_<uuid>) to omit from results
         */
        exclude?: any,
    }): CancelablePromise<ListenersAlsoPlayOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/{track_id}/listeners-also-play',
            path: {
                'track_id': trackId,
            },
            query: {
                'exclude': exclude,
            },
            errors: {
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Merge provisional track
     * Folds a provisional track into a canonical target:
     * observations / fingerprints / external ids / set-log
     * links re-point; the source row is removed; the target's
     * consensus recomputes.
     * @returns void
     * @throws ApiError
     */
    public static mergeProvisionalTrack({
        trackId,
        requestBody,
    }: {
        /**
         * Provisional source track ID
         */
        trackId: any,
        /**
         * Merge target
         */
        requestBody: TrackMergeIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/merge',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Admin only`,
                422: `Invalid source/target`,
            },
        });
    }
    /**
     * Get metadata consensus
     * Per-field candidate metadata values with crowd-sourced
     * confidence (distinct reporters, source-weighted).
     * @returns MetadataConsensusOut OK
     * @throws ApiError
     */
    public static getTrackMetadataConsensus({
        trackId,
    }: {
        /**
         * Track ID (trk_<uuid> or bare UUID)
         */
        trackId: any,
    }): CancelablePromise<MetadataConsensusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/{track_id}/metadata-consensus',
            path: {
                'track_id': trackId,
            },
            errors: {
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Report track metadata
     * Records one crowd-sourced metadata observation against
     * a track; feeds the per-field consensus.
     * @returns MetadataObservationOut Created
     * @throws ApiError
     */
    public static createTrackObservation({
        trackId,
        requestBody,
    }: {
        /**
         * Track ID
         */
        trackId: any,
        /**
         * Observed metadata (at least one field)
         */
        requestBody: MetadataObservationIn,
    }): CancelablePromise<MetadataObservationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/observations',
            path: {
                'track_id': trackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Track not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Promote provisional track
     * Flips an auto-created track canonical.
     * @returns void
     * @throws ApiError
     */
    public static promoteProvisionalTrack({
        trackId,
    }: {
        /**
         * Track ID
         */
        trackId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracks/{track_id}/promote',
            path: {
                'track_id': trackId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Admin only`,
                404: `Track not found or already canonical`,
            },
        });
    }
    /**
     * Read a canonical track's waveform
     * Resolves the most-recently-updated waveform among library rows linked to this canonical track. `drops_ms` carries the contributing library row's DJ-marked drop points (ms from track start, sorted ascending; empty when none synced). `bands_b64` carries the contributing row's spectral band energies when stored (3 bytes per peak bucket: low/mid/high, uint8 each); omitted when never uploaded. Anonymous-public posture (same as the other GET /tracks/{id} reads). The response carries NO owner attribution - peaks of a published track are not personal data, but the contributing library's owner identity is and is never exposed.
     * @returns WaveformOut OK
     * @throws ApiError
     */
    public static getTrackWaveform({
        trackId,
    }: {
        /**
         * Track ID (UUID or trk_<uuid>)
         */
        trackId: any,
    }): CancelablePromise<WaveformOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracks/{track_id}/waveform',
            path: {
                'track_id': trackId,
            },
            errors: {
                404: `No waveform known for this track`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
}
