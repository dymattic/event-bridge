/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OwnRecordingsOut } from '../models/OwnRecordingsOut';
import type { RecordingAudioIn } from '../models/RecordingAudioIn';
import type { RecordingAudioOut } from '../models/RecordingAudioOut';
import type { RecordingCreateIn } from '../models/RecordingCreateIn';
import type { RecordingCreateOut } from '../models/RecordingCreateOut';
import type { RecordingLoudnessIn } from '../models/RecordingLoudnessIn';
import type { RecordingLoudnessOut } from '../models/RecordingLoudnessOut';
import type { RecordingOut } from '../models/RecordingOut';
import type { RecordingTracklistOut } from '../models/RecordingTracklistOut';
import type { RecordingTracklistPutAckOut } from '../models/RecordingTracklistPutAckOut';
import type { RecordingTracklistPutIn } from '../models/RecordingTracklistPutIn';
import type { RecordingWaveformAckOut } from '../models/RecordingWaveformAckOut';
import type { RecordingWaveformIn } from '../models/RecordingWaveformIn';
import type { RecordingWaveformOut } from '../models/RecordingWaveformOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecordingsService {
    /**
     * List the caller's own recordings
     * Returns the authenticated caller's recordings, newest-first, each flagged with `audio_ready` / `has_waveform` / `has_tracklist`. Sourced from the recording rows themselves (not the play log), so an uploaded set with zero banked plays still lists. BOLA-scoped - only the caller's own rows are ever returned.
     * @returns OwnRecordingsOut OK
     * @throws ApiError
     */
    public static listOwnRecordings({
        limit,
        offset,
    }: {
        /**
         * Max rows (1..200, default 50)
         */
        limit?: any,
        /**
         * Rows to skip (default 0)
         */
        offset?: any,
    }): CancelablePromise<OwnRecordingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recordings',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a recorded DJ set
     * Creates a recorded set directly - no backdated live-stream replay. `rights_confirmed` MUST be true: the uploader affirms they hold or have cleared the rights to host the recording including its underlying tracks (422 otherwise, and the affirmation timestamp is stored). An optional `tracklist` is persisted as a real tracklist whose items carry millisecond offsets INTO the recording and ride the same library-ingest/dedup/rematch pipeline as every other tracklist upload. Attach the audio afterwards with `PUT /recordings/{id}/audio`.
     * @returns RecordingCreateOut Created
     * @throws ApiError
     */
    public static createRecording({
        requestBody,
    }: {
        /**
         * Recording + optional stored tracklist
         */
        requestBody: RecordingCreateIn,
    }): CancelablePromise<RecordingCreateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recordings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                413: `Too many tracklist items`,
                422: `rights_confirmed missing, bad timestamps/ids,`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a recording
     * Permanently removes one of the caller's OWN recordings (foreign rows are a BOLA-safe 404; a caller holding the `admin` role may remove any recording - the Terms-of-Service takedown path). This is a HARD delete, not a hide: the recording row goes and every artifact hung off it goes with it - waveform, loudness, release links, set log, quad fingerprints. The hosted audio object is purged from storage too unless `keep_audio=true` is passed, in which case the upload survives as a plain media upload and stays listed under `GET /media-upload/user-uploads`. The link to the stored tracklist is dropped, but the tracklist document itself is KEPT (it may be a list you authored and reference elsewhere, and it survives even when this recording minted it inline) - it stays listed under `GET /tracklists`; delete it explicitly with `DELETE /tracklists/{tracklist_id}`. Play-log rows are NOT removed either - they are the DJ's own play history, not a recording artifact. Idempotent from the client's side: a second call answers 404. There is no undo.
     * @returns void
     * @throws ApiError
     */
    public static deleteRecording({
        recordingId,
        keepAudio,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Keep the backing media upload instead of purging it (default false)
         */
        keepAudio?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/recordings/{recording_id}',
            path: {
                'recording_id': recordingId,
            },
            query: {
                'keep_audio': keepAudio,
            },
            errors: {
                401: `Authentication required`,
                404: `Recording not found (or not the caller's)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a recording
     * Returns a recorded DJ set (recording). A recording is the canonical home for a recorded set: its play-log-derived track count, visibility, event association, and any linked releases. Visibility-gated - a caller who can't see the recording gets 404.
     * @returns RecordingOut OK
     * @throws ApiError
     */
    public static getRecording({
        recordingId,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
    }): CancelablePromise<RecordingOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recordings/{recording_id}',
            path: {
                'recording_id': recordingId,
            },
            errors: {
                404: `Recording not found`,
                422: `Invalid recording_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Attach hosted audio to a recording
     * Points a recording at a completed media-ingest upload. tracks verifies over the internal mesh that the upload exists, is owned by the caller, finished the AV/promotion pipeline (`pipeline_status=ready`) and carries an `audio*` mime type; any miss is a uniform 422 (the specific reason rides the logs, not the wire, so the endpoint is not an upload-enumeration oracle). On success `audio_ready_at` is stamped and media-delivery starts serving the bytes under THIS recording's visibility. A verification outage is 503 - fail-closed and retryable.
     * @returns RecordingAudioOut OK
     * @throws ApiError
     */
    public static putRecordingAudio({
        recordingId,
        requestBody,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Upload to attach
         */
        requestBody: RecordingAudioIn,
    }): CancelablePromise<RecordingAudioOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/recordings/{recording_id}/audio',
            path: {
                'recording_id': recordingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                404: `Recording not found (or not the caller's)`,
                422: `Upload not usable, malformed id,`,
                503: `Upload verification unavailable`,
            },
        });
    }
    /**
     * Read a recording's loudness analysis
     * Returns the stored EBU R128 analysis for a recording. Anonymous-tolerant and gated by the RECORDING's visibility (owner bypass); a caller who can't see the recording gets 404. `momentary_b64` is present only when a momentary series was uploaded.
     * @returns RecordingLoudnessOut OK
     * @throws ApiError
     */
    public static getRecordingLoudness({
        recordingId,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
    }): CancelablePromise<RecordingLoudnessOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recordings/{recording_id}/loudness',
            path: {
                'recording_id': recordingId,
            },
            errors: {
                404: `Recording or loudness not found`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Store a recording's loudness analysis
     * Upserts the EBU R128 analysis for one of the caller's OWN recordings (foreign rows are a BOLA-safe 404). Every field is optional and an omitted field PRESERVES the stored value, so a summary-only write keeps an earlier momentary series. `momentary_b64` is the base64 of a little-endian float32 array carrying one momentary-loudness sample per `step_ms`. `step_ms` is PER-RECORDING - analysers widen the grid for long sets, so it is stored as given and never validated against a fixed value; always read it back before interpreting the series. Loudness values at or below -70 LUFS denote silence (-inf is conventionally sent as -99) and are accepted verbatim rather than clamped.
     * @returns void
     * @throws ApiError
     */
    public static putRecordingLoudness({
        recordingId,
        requestBody,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Loudness summary + optional momentary series
         */
        requestBody: RecordingLoudnessIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/recordings/{recording_id}/loudness',
            path: {
                'recording_id': recordingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON or undecodable momentary_b64`,
                401: `Authentication required`,
                404: `Recording not found (or not the caller's)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a recording from a release
     * Removes a recording↔release link. The caller must own the recording. A missing recording / non-owner / missing link returns 404.
     * @returns void
     * @throws ApiError
     */
    public static unlinkRecordingRelease({
        recordingId,
        releaseId,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Release ID (rel_<uuid> or bare UUID)
         */
        releaseId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/recordings/{recording_id}/releases/{release_id}',
            path: {
                'recording_id': recordingId,
                'release_id': releaseId,
            },
            errors: {
                401: `Authentication required`,
                404: `Recording or link not found`,
                422: `Invalid id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a recording to a release
     * Links a recording to a release (bidirectional). The caller must own BOTH the recording and the release. Any ownership miss or missing row returns 404 (never 403).
     * @returns void
     * @throws ApiError
     */
    public static linkRecordingRelease({
        recordingId,
        releaseId,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Release ID (rel_<uuid> or bare UUID)
         */
        releaseId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recordings/{recording_id}/releases/{release_id}',
            path: {
                'recording_id': recordingId,
                'release_id': releaseId,
            },
            errors: {
                401: `Authentication required`,
                404: `Recording or release not found`,
                422: `Invalid id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a recording's tracklist
     * Returns a recording's tracklist. A STORED (uploaded) tracklist wins when the recording has one - `source=stored`, body in `items`, each entry carrying `start_offset_ms` / `end_offset_ms` into the hosted audio plus the canonical/library hydration fields. Otherwise the play-log-derived list is returned unchanged - `source=derived`, body in `tracks`. Visibility-gated identically to the recording itself.
     * @returns RecordingTracklistOut OK
     * @throws ApiError
     */
    public static getRecordingTracklist({
        recordingId,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
    }): CancelablePromise<RecordingTracklistOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recordings/{recording_id}/tracklist',
            path: {
                'recording_id': recordingId,
            },
            errors: {
                404: `Recording not found`,
                422: `Invalid recording_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Replace a recording's stored tracklist
     * Replaces the stored tracklist of one of the caller's OWN recordings (foreign rows are a BOLA-safe 404). Same item shape as the `tracklist` array on POST /recordings. This is the re-publish path: correct the start offsets after a first publish and push them again WITHOUT re-uploading the audio. The tracklist id is STABLE across replaces - items are swapped in place - so any reference to it survives. Items ride the same library-ingest/dedup/rematch pipeline as a first publish. An empty array CLEARS the stored tracklist: the link is dropped, the response carries `cleared:true` with an empty `tracklist_id`, and the tracklist read falls back to the play-log-derived list. The tracklist document itself is kept (it may be a list you authored and reference elsewhere) - delete it explicitly via `DELETE /tracklists/{id}` if you want it gone. Alternatively send `tracklist_id` INSTEAD of `tracklist` to REFERENCE an existing tracklist you are a member of - no copy is made, so later edits to that tracklist show up here too. The two fields are mutually exclusive.
     * @returns RecordingTracklistPutAckOut OK
     * @throws ApiError
     */
    public static putRecordingTracklist({
        recordingId,
        requestBody,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Replacement tracklist
         */
        requestBody: RecordingTracklistPutIn,
    }): CancelablePromise<RecordingTracklistPutAckOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/recordings/{recording_id}/tracklist',
            path: {
                'recording_id': recordingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                404: `Recording not found (or not the caller's), or referenced tracklist not found / not yours`,
                413: `Too many tracklist items`,
                422: `Malformed item/id, both tracklist and tracklist_id sent,`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Read a recording's waveform
     * Returns the stored waveform for a recording. Anonymous-tolerant and gated by the RECORDING's visibility (owner bypass); a caller who can't see the recording gets 404, identical to a recording that doesn't exist. `bands_b64` is present only when spectral bands were uploaded.
     * @returns RecordingWaveformOut OK
     * @throws ApiError
     */
    public static getRecordingWaveform({
        recordingId,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
    }): CancelablePromise<RecordingWaveformOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recordings/{recording_id}/waveform',
            path: {
                'recording_id': recordingId,
            },
            errors: {
                404: `Recording or waveform not found`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Store a recording's waveform
     * Upserts the client-computed waveform for one of the caller's OWN recordings (foreign rows are a BOLA-safe 404). `peaks_b64` is the base64 of a raw uint8 bucket array; decoded size 1-262144 bytes. Optional `bands_b64` carries spectral band energies - 3 bytes per peak bucket (low/mid/high, uint8 each); decoded length must equal exactly 3x the decoded peaks length. Optional `duration_ms` records the analyzed length. Re-PUT replaces the peaks; omitted `bands_b64` / `duration_ms` preserve previously stored values.
     * @returns RecordingWaveformAckOut OK
     * @throws ApiError
     */
    public static putRecordingWaveform({
        recordingId,
        requestBody,
    }: {
        /**
         * Recording ID (strm_<uuid> or bare UUID)
         */
        recordingId: any,
        /**
         * Base64 peaks (+ optional bands_b64, duration_ms)
         */
        requestBody: RecordingWaveformIn,
    }): CancelablePromise<RecordingWaveformAckOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/recordings/{recording_id}/waveform',
            path: {
                'recording_id': recordingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON, undecodable/empty peaks_b64, or bands_b64 not exactly 3 bytes per peak bucket`,
                401: `Authentication required`,
                404: `Recording not found (or not the caller's)`,
                413: `Decoded peaks exceed 262144 bytes`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
}
