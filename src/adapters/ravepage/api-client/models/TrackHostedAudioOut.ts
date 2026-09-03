/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackHostedAudioOut = {
    /**
     * AudioReady is the honest PRE-FLIGHT: true only when the upload is
     * attached AND verified playable (live_streams.audio_ready_at set).
     * false means the recording exists but the audio is still being
     * processed - do not route playback there yet.
     */
    audio_ready?: boolean;
    /**
     * MediaUploadID is the media-ingest upload backing the hosted audio
     * (`upl_<uuid>`). Always present - a recording with no upload is not
     * listed here at all.
     */
    media_upload_id?: string;
    /**
     * OffsetMS is where this track starts inside the recording,
     * milliseconds from the start of the hosted audio file. Null when
     * the stored tracklist item carries no numeric offset (a
     * hand-authored "01:23:45" list) - play from 0 and let the user
     * seek. When the track appears more than once in one recording this
     * is the EARLIEST occurrence.
     */
    offset_ms?: number;
    /**
     * RecordingID is the recording (= live stream) id, `strm_<uuid>` -
     * the same wire grammar RecordingOut.recording_id emits.
     */
    recording_id?: string;
    /**
     * StartedAt is the set start timestamp (RFC3339 UTC).
     */
    started_at?: string;
    /**
     * Title is the recording's set title; null when unset.
     */
    title?: string;
    /**
     * Visibility is the recording's read-audience policy.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

