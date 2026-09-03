/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryBulkAddIn } from '../models/LibraryBulkAddIn';
import type { LibraryBulkAddOut } from '../models/LibraryBulkAddOut';
import type { LibraryBulkDeleteIn } from '../models/LibraryBulkDeleteIn';
import type { LibraryBulkDeleteOut } from '../models/LibraryBulkDeleteOut';
import type { LibraryImportOut } from '../models/LibraryImportOut';
import type { LibraryListOut } from '../models/LibraryListOut';
import type { LibraryStatsOut } from '../models/LibraryStatsOut';
import type { LibraryTrackAddIn } from '../models/LibraryTrackAddIn';
import type { LibraryTrackOut } from '../models/LibraryTrackOut';
import type { WaveformOut } from '../models/WaveformOut';
import type { WaveformPutAckOut } from '../models/WaveformPutAckOut';
import type { WaveformPutIn } from '../models/WaveformPutIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LibraryService {
    /**
     * List the caller's library (filterable)
     * Returns a page of the authenticated caller's library tracks. BOLA-scoped - only the caller's own rows are ever returned. All filters are optional and composable: `q` (case-insensitive substring on title OR artist OR album), `genre`/`label`/`key` (CSV, exact-match-any), `camelot` (CSV of Camelot codes like `8A,9B` matched against the normalized key), `bpm_min`/`bpm_max`, `rating_min` (0-5), `linked` (canonical link present), `has_waveform`. Sort with `sort` (added|updated|title|artist|album|bpm|key|genre|label|rating|plays; default added) + `order` (asc|desc; defaults: desc for added/updated/rating/plays, asc otherwise) - ties always break by artist, title, id for stable pagination. `total` carries the full filtered count for pagination. Optional `updated_since` (RFC3339) keeps the sync-pull contract: rows with `updated_at` strictly after the value, ordered updated_at ASC unless an explicit `sort` is given.
     * @returns LibraryListOut OK
     * @throws ApiError
     */
    public static listLibrary({
        q,
        genre,
        label,
        camelot,
        key,
        bpmMin,
        bpmMax,
        ratingMin,
        linked,
        hasWaveform,
        sort,
        order,
        limit,
        offset,
        updatedSince,
    }: {
        /**
         * Substring search on title/artist/album (case-insensitive)
         */
        q?: any,
        /**
         * CSV of genres (exact-match any)
         */
        genre?: any,
        /**
         * CSV of labels (exact-match any)
         */
        label?: any,
        /**
         * CSV of Camelot codes (e.g. 8A,9A,8B) against the normalized key
         */
        camelot?: any,
        /**
         * CSV of raw key strings (exact-match any)
         */
        key?: any,
        /**
         * Minimum BPM (inclusive)
         */
        bpmMin?: any,
        /**
         * Maximum BPM (inclusive)
         */
        bpmMax?: any,
        /**
         * Minimum rating 0-5 (unrated counts as 0)
         */
        ratingMin?: any,
        /**
         * true = only canonical-linked rows; false = only unlinked
         */
        linked?: any,
        /**
         * true = only rows with a stored waveform; false = only without
         */
        hasWaveform?: any,
        /**
         * Sort: added|updated|title|artist|album|bpm|key|genre|label|rating|plays (default added)
         */
        sort?: any,
        /**
         * asc|desc (default desc for added/updated/rating/plays, asc otherwise)
         */
        order?: any,
        /**
         * Page size (1-200; default 50)
         */
        limit?: any,
        /**
         * Row offset (default 0)
         */
        offset?: any,
        /**
         * RFC3339 timestamp - only rows updated strictly after this; default order updated_at ASC
         */
        updatedSince?: any,
    }): CancelablePromise<LibraryListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library',
            query: {
                'q': q,
                'genre': genre,
                'label': label,
                'camelot': camelot,
                'key': key,
                'bpm_min': bpmMin,
                'bpm_max': bpmMax,
                'rating_min': ratingMin,
                'linked': linked,
                'has_waveform': hasWaveform,
                'sort': sort,
                'order': order,
                'limit': limit,
                'offset': offset,
                'updated_since': updatedSince,
            },
            errors: {
                400: `Malformed filter/sort parameter`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Import a collection file into the caller's library
     * Parses a DJ collection file (one of: tracktor_xml, tracktor_html, recordbox, serato, virtualdj), extracts per-track metadata (title/artist/album/label/bpm/key) and - for recordbox + tracktor_xml - a full beatgrid marker array, then batch-upserts each track into the caller's library. Each row deduplicates by (isrc | normalized title+artist | sha256 of the file path); file paths from the collection file are used ONLY for that irreversible dedup hash and are never stored. Runs the matcher chain to resolve a canonical track, and contributes a metadata observation (source=tracklist_import). Multipart body - `file` is required; `format` optional form field overrides content-sniff. Returns a per-row import summary.
     * @returns LibraryImportOut OK
     * @throws ApiError
     */
    public static importLibrary({
        formData,
    }: {
        formData: {
            /**
             * Collection file (max 10 MiB)
             */
            file: Blob;
            /**
             * Force format (else content-sniff)
             */
            format?: 'tracktor_html' | 'tracktor_xml' | 'recordbox' | 'serato' | 'virtualdj';
        },
    }): CancelablePromise<LibraryImportOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/import',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Could not detect/parse file`,
                401: `Authentication required`,
                413: `File too large (>10 MiB) or too many tracks (>10000)`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * The caller's library tag-occurrence stats
     * Per-user tag/occurrence view over the caller's library: total + linked (canonical-resolved) row counts, plus top-100 occurrence facets for genres, labels, artists (raw artist_text) and musical keys - count DESC, empty values excluded. BOLA-scoped to the authenticated caller.
     * @returns LibraryStatsOut OK
     * @throws ApiError
     */
    public static libraryStats(): CancelablePromise<LibraryStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library/stats',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a single track to the caller's library
     * Adds one track to the caller's library from a typed JSON body (source=single_add). Deduplicates by (isrc | normalized title+artist | sha256 of file_path) - a re-add updates the existing row in place. `file_path` is accepted ONLY to derive that irreversible dedup hash for title-less/ISRC-less rows; it is never stored and never returned. Runs the matcher chain to resolve a canonical track and contributes a metadata observation (source=manual). Optional `beatgrid` marker array and `fingerprint_b64` (chromaprint) sharpen matching + consensus. Optional `drops_ms` (DJ-marked drop points, ms from track start; omitted preserves stored, empty array clears). Returns the resolved library-track row.
     * @returns LibraryTrackOut Created
     * @throws ApiError
     */
    public static addLibraryTrack({
        requestBody,
    }: {
        /**
         * Single library-track add payload (title OR isrc OR file_path required)
         */
        requestBody: LibraryTrackAddIn,
    }): CancelablePromise<LibraryTrackOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/tracks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed (no identifying metadata)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Bulk-add tracks to the caller's library
     * Upserts up to 500 typed library tracks in one call (source=bulk_import) - the native DJ-app library-sync path. Each item follows the single-add semantics: dedup by (isrc | normalized title+artist | sha256 of file_path - the path itself is never stored), matcher chain resolves a canonical track, metadata observation contributed (source=file_tag). Optional per-item `drops_ms` (DJ-marked drop points, ms from track start, ints >= 0, max 64; server sorts + dedupes) - omitted preserves stored drops, explicit empty array clears them. Per-row isolation - a failed row reports status=error with detail and the batch continues. `results[i].status` is `created` (fresh row), `updated` (dedup hit refreshed in place) or `error`; created-vs-updated derives from Postgres xmax=0 on the upsert RETURNING. Error rows carry an empty `library_track_id` and empty `fingerprint_status`.
     * @returns LibraryBulkAddOut OK
     * @throws ApiError
     */
    public static bulkAddLibraryTracks({
        requestBody,
    }: {
        /**
         * Bulk payload - `tracks` array, 1-500 items
         */
        requestBody: LibraryBulkAddIn,
    }): CancelablePromise<LibraryBulkAddOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/tracks/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON, empty tracks array, or more than 500 items`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Bulk-delete library tracks
     * Removes up to 500 of the caller's library rows by id (`ids`), or the caller's ENTIRE library (`all:true`). Exactly one of `ids` / `all` - both or neither is a 400. Foreign/unknown ids are silently skipped (BOLA-safe); `deleted` reports rows actually removed. Privacy-complete: the caller's own library-flow metadata observations for the deleted rows are scrubbed set-based.
     * @returns LibraryBulkDeleteOut OK
     * @throws ApiError
     */
    public static bulkDeleteLibraryTracks({
        requestBody,
    }: {
        /**
         * `ids` (1-500 lib_<uuid>) XOR `all:true`
         */
        requestBody: LibraryBulkDeleteIn,
    }): CancelablePromise<LibraryBulkDeleteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/library/tracks/bulk-delete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON, ids+all both/neither set, >500 ids, or malformed id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete one library track
     * Removes one track from the caller's library, scoped to the authenticated owner - a row belonging to another user is a BOLA-safe 404. Privacy-complete: the caller's own metadata-observation rows created by the library write (source_ref = the row's dedup key, library-flow source types) are deleted too. Other reporters' observations and canonical tracks are never touched.
     * @returns void
     * @throws ApiError
     */
    public static deleteLibraryTrack({
        libraryTrackId,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/library/tracks/{library_track_id}',
            path: {
                'library_track_id': libraryTrackId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not the caller's row)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Read a library track's embedded-tag artwork
     * Serves the stored cover image bytes with the original Content-Type, a strong ETag (sha256-derived) and private cache headers; supports If-None-Match → 304. Readable by the row's owner or any holder of an ACCEPTED whole-library share grant on the owner's library; everyone else gets a BOLA-safe 404.
     * @returns string Image bytes (image/jpeg, image/png or image/webp)
     * @throws ApiError
     */
    public static getLibraryTrackArtwork({
        libraryTrackId,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library/tracks/{library_track_id}/artwork',
            path: {
                'library_track_id': libraryTrackId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found / no artwork / not readable`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Store a library track's embedded-tag artwork
     * Uploads the cover image embedded in the caller's local file tags for one of their OWN library rows (foreign rows are a BOLA-safe 404). Raw body upload - set Content-Type to image/jpeg, image/png or image/webp; max 262144 bytes. Re-PUT replaces the image.
     * @returns void
     * @throws ApiError
     */
    public static putLibraryTrackArtwork({
        libraryTrackId,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/library/tracks/{library_track_id}/artwork',
            path: {
                'library_track_id': libraryTrackId,
            },
            errors: {
                400: `Empty body`,
                401: `Authentication required`,
                404: `Not found (or not the caller's row)`,
                413: `Image exceeds 262144 bytes`,
                415: `Content-Type not image/jpeg|png|webp`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Read a library track's waveform
     * Returns the stored waveform for a library row, plus the row's DJ-marked drop points (`drops_ms`, milliseconds from track start, sorted ascending; empty when none synced). `bands_b64` carries spectral band energies when stored (3 bytes per peak bucket: low/mid/high, uint8 each); omitted when never uploaded. Readable by the row's owner or any holder of an ACCEPTED whole-library share grant on the owner's library (same predicate as GET /library/shared/{owner_id}); everyone else gets a BOLA-safe 404.
     * @returns WaveformOut OK
     * @throws ApiError
     */
    public static getLibraryTrackWaveform({
        libraryTrackId,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
    }): CancelablePromise<WaveformOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/library/tracks/{library_track_id}/waveform',
            path: {
                'library_track_id': libraryTrackId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found / no waveform / not readable`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Store a library track's waveform
     * Upserts the caller's client-computed waveform for one of their OWN library rows (foreign rows are a BOLA-safe 404). `peaks_b64` is the base64 of a raw uint8 bucket array (typically 8192 buckets; decoded size 1-65536 bytes). Optional `bands_b64` carries spectral band energies - 3 bytes per peak bucket (low/mid/high, uint8 each); decoded length must equal exactly 3× the decoded peaks length, else 400 "bands_b64 must decode to exactly 3 bytes per peak bucket". Optional `duration_ms` records the analyzed length (omitted/0 preserves a previously stored value). Re-PUT replaces the peaks; omitted `bands_b64` preserves previously stored bands.
     * @returns WaveformPutAckOut OK
     * @throws ApiError
     */
    public static putLibraryTrackWaveform({
        libraryTrackId,
        requestBody,
    }: {
        /**
         * Library track ID (lib_<uuid> or bare UUID)
         */
        libraryTrackId: any,
        /**
         * Base64 peaks (+ optional bands_b64, duration_ms)
         */
        requestBody: WaveformPutIn,
    }): CancelablePromise<WaveformPutAckOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/library/tracks/{library_track_id}/waveform',
            path: {
                'library_track_id': libraryTrackId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON, undecodable/empty peaks_b64, or bands_b64 not exactly 3 bytes per peak bucket`,
                401: `Authentication required`,
                404: `Not found (or not the caller's row)`,
                413: `Decoded peaks exceed 65536 bytes (bands 196608)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
}
