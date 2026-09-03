/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayedTrack } from './PlayedTrack';
import type { TracklistItemOut } from './TracklistItemOut';
export type RecordingTracklistOut = {
    /**
     * Count is the number of entries in the populated body.
     */
    count?: number;
    /**
     * Items is the stored tracklist, ordered by start offset. Never
     * null; empty on the derived path.
     */
    items?: Array<TracklistItemOut>;
    /**
     * RecordingID is the recording (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * Source names which body is populated.
     */
    source?: 'stored' | 'derived';
    /**
     * StreamID echoes RecordingID (a recording IS a live stream).
     * Retained for backward compatibility with the derived-only shape.
     */
    stream_id?: string;
    /**
     * TracklistID is the stored tracklist (`tl_<uuid>`); null on the
     * derived path.
     */
    tracklist_id?: string;
    /**
     * Tracks is the play-log-derived tracklist. Never null; empty on
     * the stored path.
     */
    tracks?: Array<PlayedTrack>;
};

