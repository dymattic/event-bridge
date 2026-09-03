/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtistCredit } from './ArtistCredit';
import type { ProviderLink } from './ProviderLink';
export type HydratedTrack = {
    /**
     * Artists are the credited artists, best-effort hydrated. Never
     * null (empty slice when none known).
     */
    artists?: Array<ArtistCredit>;
    /**
     * ArtworkURL is the canonical cover-art URL, null when unknown
     * (task #60 additive - pre-#60 consumers ignore it).
     */
    artwork_url?: string;
    /**
     * CanonicalTrackID is the linked canonical track (`trk_<uuid>`),
     * null when the source play/library row was never matched.
     */
    canonical_track_id?: string;
    /**
     * DurationMS is the canonical track length in milliseconds, null
     * when unknown (task #60 additive).
     */
    duration_ms?: number;
    /**
     * Providers are buy/stream links across platforms. Never null
     * (empty slice when none known).
     */
    providers?: Array<ProviderLink>;
    /**
     * Title is the canonical title, null when unlinked.
     */
    title?: string;
};

