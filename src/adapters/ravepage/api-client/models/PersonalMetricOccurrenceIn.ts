/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricOccurrenceIn = {
    /**
     * EntityID is the entity reference, prefixed (`trk_<uuid>`) or bare
     * UUID. It MUST resolve to a canonical id - see EntitySource.
     */
    entity_id?: string;
    /**
     * EntitySource declares which id space EntityID is in.
     * `canonical` (default) means it is already the platform's
     * canonical id. `library` means it is a user_library_tracks row id
     * and the server resolves it to canonical_track_id before writing
     * the edge; an unresolved library row is REJECTED, never written
     * under its raw id, because a provider-specific id would split one
     * track into several entities and make one listener look like
     * several people. Only meaningful for entity_type=track.
     */
    entity_source?: 'canonical' | 'library';
    /**
     * EntityType is the kind of thing that was listened to / attended.
     */
    entity_type?: 'event' | 'track' | 'club' | 'group' | 'artist' | 'label' | 'genre' | 'release';
    /**
     * OccurredAt is when it happened, RFC3339. Defaults to now.
     * Used for first_seen_at / last_seen_at only.
     */
    occurred_at?: string;
    /**
     * OccurrenceID is a client-generated UUID that makes the write
     * idempotent. It de-duplicates retries and two devices flushing
     * the same offline queue - the (subject, entity) primary key
     * cannot, because a repeat is a legitimate increment. Reuse the
     * SAME id when retrying; mint a new one for a genuinely new
     * listen. Required.
     */
    occurrence_id?: string;
};

