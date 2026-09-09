// Generic, platform-agnostic lineup model for @rave-page/ui event tooling.
// No API/wire types - a consumer (rave.page app, event-bridge extension,
// vrc.tl/vrcpop bridges) maps its own shapes onto these. Times are ISO
// instants (UTC "…Z"); `timezone` is a display concern the board carries,
// never baked into the instant.

/** A performer/DJ on a slot (or in the unscheduled tray). */
export interface LineupPerformer {
    id: string;
    name: string;
    avatarUrl?: string | null;
    /** Secondary line - genre, city, B2B partner, "@handle". */
    subtitle?: string | null;
    status?: 'confirmed' | 'pending' | 'declined';
    tags?: string[];
}

/** A time-signature block holding performers. `order` drives display sort. */
export interface LineupSlot {
    id: string;
    order: number;
    title?: string | null;
    stage?: string | null;
    /** ISO instant or null (untimed slot). */
    startsAt: string | null;
    endsAt: string | null;
    performers: LineupPerformer[];
    note?: string | null;
    /** Populated by `detectIssues`; read by the board for per-slot badges. */
    issues?: LineupIssue[];
}

/** A schedule/capability problem surfaced on a slot or the board. */
export interface LineupIssue {
    kind: 'gap' | 'overlap' | 'unsupported' | 'warning';
    message: string;
}

/**
 * What the target platform can hold. Drives which affordances the board shows
 * and which `detectIssues` findings are real (a platform that allows gaps
 * never flags one).
 */
export interface LineupCapabilities {
    /** B2B - more than one performer per slot. */
    multiplePerformersPerSlot: boolean;
    gapsAllowed: boolean;
    overlapsAllowed: boolean;
    /** false -> times render read-only. */
    editableTimes: boolean;
    /** Cap on slot count; add is disabled at/after it. */
    maxSlots?: number;
    /** Allow adding a typed-in name with no backing id. */
    performerFreeText: boolean;
}

/** Result of a performer search / free-text add - id optional. */
export interface PerformerPick {
    id?: string | null;
    name: string;
    avatarUrl?: string | null;
    subtitle?: string | null;
}
