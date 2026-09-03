/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerAccountOut } from './PerformerAccountOut';
import type { PerformerGenreFamily } from './PerformerGenreFamily';
import type { PerformerID } from './PerformerID';
import type { PerformerTypeID } from './PerformerTypeID';
import type { PerformerTypeOut } from './PerformerTypeOut';
import type { UserID } from './UserID';
export type PerformerOut = {
    /**
     * AutoReconfirmSlotChangeToleranceMinutes is the optional
     * performer booking preference. When set, slot edits whose
     * time-delta stays within ±N minutes auto-clear
     * `BookingRequest.needs_reconfirmation`. Nil = always require
     * manual reconfirmation.
     */
    auto_reconfirm_slot_change_tolerance_minutes?: number;
    /**
     * Bio is the optional freeform bio.
     */
    bio?: string;
    /**
     * CanEdit is true when the authenticated viewer may modify this
     * performer (owns the performer row - user_id - or claimed it -
     * claimed_by_user_id).
     */
    can_edit?: boolean;
    /**
     * ClaimedAt is the timestamp when the performer was claimed.
     * Nil when unclaimed.
     */
    claimed_at?: string;
    /**
     * ClaimedByUserID is the prefixed reference to the user who
     * claimed the performer. Wire form: `usr_<uuid>`. Nil when
     * unclaimed.
     */
    claimed_by_user_id?: UserID;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * ExternalID is the provider-side id paired with Source (e.g.
     * the numeric SoundCloud user id for source="soundcloud").
     * Keys unclaimed-performer presence pages on the FE
     * (/external/soundcloud/artists/{external_id}).
     */
    external_id?: string;
    /**
     * Genres is the derived genre families (count-desc, capped at 5),
     * computed by the profiles genre-families recompute sweep from the
     * performer's canonical tracks + SC set/mix genres. Additive;
     * non-nil (empty array, never null) so the FE shape is stable.
     */
    genres?: Array<PerformerGenreFamily>;
    /**
     * ID is the canonical prefixed performer identifier. Wire form:
     * `perf_<uuid>`.
     */
    id?: PerformerID;
    /**
     * ImageURL is the optional legacy plain-URL image field.
     */
    image_url?: string;
    /**
     * IsClaimed mirrors `performers.is_claimed`. Read-only on the
     * wire.
     */
    is_claimed?: boolean;
    /**
     * IsVerified mirrors `performers.is_verified`. Gates booking
     * acceptance - auto-created stubs land with `is_verified=false`;
     * self-service / admin profiles default true.
     */
    is_verified?: boolean;
    /**
     * LinkedAccounts is the entity-resolution provider-account links
     * (entity_accounts; P7). Populated ONLY on the single-performer
     * read; additive, omitted when empty.
     */
    linked_accounts?: Array<PerformerAccountOut>;
    /**
     * MyRole is the viewer's coarse edit role. Null for anonymous
     * viewers, non-editors, and list responses.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    /**
     * Name is the public / professional name.
     */
    name?: string;
    /**
     * PerformerType is the eager-loaded type projection. Nil when
     * no type assigned.
     */
    performer_type?: PerformerTypeOut;
    /**
     * PerformerTypeID is the prefixed reference to the parent
     * `performer_types` row. Wire form: `ptyp_<uuid>`. Nil when
     * no type assigned.
     */
    performer_type_id?: PerformerTypeID;
    /**
     * Relationship is the coarse viewer↔performer relationship. Null
     * for anonymous viewers and list responses; "none" for an
     * authenticated non-owner.
     */
    relationship?: 'owner' | 'performer' | 'none';
    /**
     * SoundCloudLinked reports whether this performer's SoundCloud
     * account is OAuth-linked on rave.page.
     *
     * Source/ExternalID only mean the performer was IMPORTED from
     * SoundCloud - not that the artist consented. Under the SoundCloud
     * API ToU only a LINKED artist's SC content may be served, so the FE
     * must branch on this flag (not on source=="soundcloud") before
     * rendering SC presence pages, players, or artwork. False means the
     * SC endpoints will 404 for this performer by design.
     */
    soundcloud_linked?: boolean;
    /**
     * Source is the optional source-of-creation marker (e.g.
     * "manual", "import", "booking_ref").
     */
    source?: string;
    /**
     * UpdatedAt is the last-modified timestamp.
     */
    updated_at?: string;
    /**
     * UserID is the prefixed reference to the owning user. Wire
     * form: `usr_<uuid>`. Nil for unclaimed performers.
     */
    user_id?: UserID;
};

