/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CheckEventVisibilityOut = {
    /**
     * CallerIsAnyPerformer - same as above with any acceptance_status.
     */
    caller_is_any_performer?: boolean;
    /**
     * CallerIsAttendee - caller in event_attendees for this event.
     */
    caller_is_attendee?: boolean;
    /**
     * CallerIsBookedPerformer - caller's performer row linked to
     * event_performers with acceptance_status='accepted'.
     */
    caller_is_booked_performer?: boolean;
    /**
     * CallerIsClubStaff - organizer_type='club' AND caller in
     * club_staff.
     */
    caller_is_club_staff?: boolean;
    /**
     * CallerIsCollaborator - caller in event_collaborators
     * (collaborator_type='user' arm).
     */
    caller_is_collaborator?: boolean;
    /**
     * CallerIsEventUser - caller in event_users for this event.
     */
    caller_is_event_user?: boolean;
    /**
     * CallerIsGroupMember - organizer_type='group' AND caller in
     * group_memberships.
     */
    caller_is_group_member?: boolean;
    /**
     * CallerIsOrganizer - composite OR of the user-org / group-member /
     * club-staff arms.
     */
    caller_is_organizer?: boolean;
    /**
     * Exists reports whether the events row was found.
     */
    exists?: boolean;
    /**
     * IsPublic - visibility='public' AND is_public=TRUE, OR
     * visibility='unlisted'. Zero-value when Exists=false.
     */
    is_public?: boolean;
    /**
     * IsUnlisted - visibility='unlisted' specifically.
     */
    is_unlisted?: boolean;
    /**
     * OrganizerID is the bare-UUID string of events.organizer_id.
     * Empty when the column is NULL.
     */
    organizer_id?: string;
    /**
     * OrganizerType is the events.organizer_type column. One of
     * "group", "user", "club", or "" (unset).
     */
    organizer_type?: string;
    /**
     * Status is the lowercased events.status column.
     */
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    /**
     * Visibility is the lowercased events.visibility column. Empty
     * string when the column is NULL.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

