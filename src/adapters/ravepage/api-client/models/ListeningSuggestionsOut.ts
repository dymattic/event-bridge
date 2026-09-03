/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListeningSuggestionItem } from './ListeningSuggestionItem';
export type ListeningSuggestionsOut = {
    /**
     * Items are the ranked suggestions, score DESC, capped at `limit`
     * (default 25, max 50). Never null. Recently-played tracks and the
     * seeds themselves are excluded.
     */
    items?: Array<ListeningSuggestionItem>;
    /**
     * SeedCount is how many MB-linked recently-played tracks seeded the
     * aggregation (0 → items always []).
     */
    seed_count?: number;
};

