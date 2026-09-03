/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListenersAlsoPlayItem } from './ListenersAlsoPlayItem';
export type ListenersAlsoPlayOut = {
    /**
     * Items are the similar recordings, score DESC, capped at 25.
     * Never null (empty slice when unknown).
     */
    items?: Array<ListenersAlsoPlayItem>;
    /**
     * RecordingMBID is the reference track's MusicBrainz recording id;
     * null when the track has no MB link yet (items is then []).
     */
    recording_mbid?: string;
    /**
     * TrackID is the reference canonical track (bare UUID - TrackOut
     * parity).
     */
    track_id?: string;
};

