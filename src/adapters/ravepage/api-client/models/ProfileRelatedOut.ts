/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileLatestContentItem } from './ProfileLatestContentItem';
import type { ProfileRelatedItem } from './ProfileRelatedItem';
export type ProfileRelatedOut = {
    /**
     * Clubs - related clubs. Empty until ranking wires in.
     */
    clubs?: Array<ProfileRelatedItem>;
    /**
     * LatestContent - recent content from the profile owner ranked
     * against the viewer's taste profile when available. Chronological
     * fallback for anonymous viewers. Capped at 12 items.
     */
    latest_content?: Array<ProfileLatestContentItem>;
    /**
     * RecommendedEvents - related upcoming events. Empty until
     * ranking wires in.
     */
    recommended_events?: Array<ProfileRelatedItem>;
    /**
     * SimilarEntities - Phase-5 candidate list. Empty until ranking
     * wires in .
     */
    similar_entities?: Array<ProfileRelatedItem>;
};

